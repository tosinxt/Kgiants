import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder', {
  apiVersion: '2026-04-22.dahlia',
});

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key || key === 're_...') return null;
  return new Resend(key);
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature error:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent;
    await handlePaymentSucceeded(pi);
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSucceeded(pi: Stripe.PaymentIntent) {
  const supabase = getSupabaseAdmin();

  // Idempotency check
  const existing = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_payment_intent_id', pi.id)
    .single();
  if (existing.data) return;

  const metadata = pi.metadata || {};
  const subtotal = parseFloat(metadata.subtotal || '0');
  const vat = parseFloat(metadata.vat || '0');
  const shippingFee = parseFloat(metadata.shipping_fee || '0');
  const shippingAddress = metadata.shipping_address
    ? JSON.parse(metadata.shipping_address)
    : null;

  // Purchase Shippo label
  const { trackingNumber, labelUrl, shippoTransactionId } =
    await purchaseShippingLabel(pi, shippingAddress);

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      customer_email: pi.receipt_email || '',
      stripe_payment_intent_id: pi.id,
      status: 'paid',
      subtotal,
      vat,
      shipping_fee: shippingFee,
      total: pi.amount / 100,
      shipping_address: shippingAddress || { zip: metadata.shipping_zip || '' },
      shipping_service: metadata.shipping_service || '',
      estimated_delivery: getEstimatedDelivery(),
      tracking_number: trackingNumber || null,
      label_url: labelUrl || null,
      shippo_transaction_id: shippoTransactionId || null,
    })
    .select()
    .single();

  if (error || !order) {
    console.error('Failed to create order:', error);
    return;
  }

  // Email customer confirmation
  await sendCustomerEmail(order, pi.receipt_email || '', trackingNumber);

  // Email admin with label PDF
  if (labelUrl) {
    await sendAdminLabelEmail(order, labelUrl, trackingNumber, shippingAddress);
  }
}

// ── Shippo label purchase ────────────────────────────────────────────

async function purchaseShippingLabel(pi: Stripe.PaymentIntent, address: any) {
  const apiKey = process.env.SHIPPO_API_KEY;
  const metadata = pi.metadata || {};
  const shippoRateId = metadata.shippo_rate_id;

  if (!apiKey || apiKey.includes('test_...') || !address || !shippoRateId) {
    console.log('Shippo: skipping label purchase (test mode or missing data)');
    return { trackingNumber: null, labelUrl: null, shippoTransactionId: null };
  }

  // If it's a real Shippo rate ID, purchase it directly
  if (!shippoRateId.startsWith('mock_') && !shippoRateId.startsWith('fallback_') && !shippoRateId.startsWith('free_')) {
    return await buyRateById(apiKey, shippoRateId);
  }

  // Otherwise create a new shipment + buy the cheapest rate
  return await createShipmentAndBuy(apiKey, pi, address);
}

async function buyRateById(apiKey: string, rateId: string) {
  try {
    const res = await fetch('https://api.goshippo.com/transactions/', {
      method: 'POST',
      headers: {
        Authorization: `ShippoToken ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rate: rateId,
        label_file_type: 'PDF',
        async: false,
      }),
    });

    if (!res.ok) {
      console.error('Shippo transaction error:', await res.text());
      return { trackingNumber: null, labelUrl: null, shippoTransactionId: null };
    }

    const tx = await res.json();
    if (tx.status !== 'SUCCESS') {
      console.error('Shippo transaction failed:', tx.messages);
      return { trackingNumber: null, labelUrl: null, shippoTransactionId: null };
    }

    return {
      trackingNumber: tx.tracking_number || null,
      labelUrl: tx.label_url || null,
      shippoTransactionId: tx.object_id || null,
    };
  } catch (err) {
    console.error('Shippo buyRateById error:', err);
    return { trackingNumber: null, labelUrl: null, shippoTransactionId: null };
  }
}

async function createShipmentAndBuy(apiKey: string, pi: Stripe.PaymentIntent, address: any) {
  try {
    const metadata = pi.metadata || {};
    const items = metadata.items_json ? JSON.parse(metadata.items_json) : [];
    const totalWeightOz = items.reduce(
      (sum: number, item: { weight_oz: number; quantity: number }) =>
        sum + (item.weight_oz || 4) * item.quantity,
      4
    );

    // Create shipment
    const shipmentRes = await fetch('https://api.goshippo.com/shipments/', {
      method: 'POST',
      headers: {
        Authorization: `ShippoToken ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address_from: {
          name: 'KGiants',
          street1: process.env.SHIPPO_FROM_STREET || '2123 Sunnymade Dr',
          city: process.env.SHIPPO_FROM_CITY || 'Dallas',
          state: process.env.SHIPPO_FROM_STATE || 'TX',
          zip: process.env.SHIPPO_FROM_ZIP || '75126',
          country: 'US',
          phone: process.env.SHIPPO_FROM_PHONE || '',
          email: process.env.RESEND_FROM_EMAIL || 'orders@kgiants.com',
        },
        address_to: {
          name: address.name || '',
          street1: address.line1 || '',
          street2: address.line2 || '',
          city: address.city || '',
          state: address.state || '',
          zip: address.zip || '',
          country: 'US',
          email: pi.receipt_email || '',
        },
        parcels: [{
          length: '8',
          width: '6',
          height: '4',
          distance_unit: 'in',
          weight: Math.max(totalWeightOz, 1).toString(),
          mass_unit: 'oz',
        }],
        async: false,
      }),
    });

    if (!shipmentRes.ok) {
      console.error('Shippo shipment error:', await shipmentRes.text());
      return { trackingNumber: null, labelUrl: null, shippoTransactionId: null };
    }

    const shipment = await shipmentRes.json();
    const rates = shipment.rates || [];
    if (rates.length === 0) {
      console.error('Shippo: no rates returned');
      return { trackingNumber: null, labelUrl: null, shippoTransactionId: null };
    }

    // Pick cheapest rate
    const cheapest = rates.sort((a: any, b: any) =>
      parseFloat(a.amount) - parseFloat(b.amount)
    )[0];

    return await buyRateById(apiKey, cheapest.object_id);
  } catch (err) {
    console.error('Shippo createShipmentAndBuy error:', err);
    return { trackingNumber: null, labelUrl: null, shippoTransactionId: null };
  }
}

// ── Emails ───────────────────────────────────────────────────────────

function getEstimatedDelivery(): string {
  const delivery = new Date();
  delivery.setDate(delivery.getDate() + 7);
  return delivery.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

async function sendCustomerEmail(order: any, email: string, trackingNumber: string | null) {
  if (!email) return;
  const resend = getResend();
  if (!resend) return;

  const orderId = order.id.slice(0, 8).toUpperCase();
  const shippingFee = order.shipping_fee || 0;

  const trackingRow = trackingNumber ? `
    <tr>
      <td style="padding:14px 0;color:#8a8a8a;font-size:13px;letter-spacing:0.5px;border-bottom:1px solid #222;width:50%;">Tracking</td>
      <td style="padding:14px 0;font-size:13px;text-align:right;border-bottom:1px solid #222;color:#C9A84C;letter-spacing:0.5px;">${trackingNumber}</td>
    </tr>` : '';

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'orders@kgiants.com',
      to: email,
      subject: `Order Confirmed — #${orderId} | KGiants`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Inter',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-family:'Inter',sans-serif;font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;">KGIANTS</p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-size:11px;letter-spacing:1.5px;color:#444;text-transform:uppercase;">ORDER #${orderId}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Gold divider -->
          <tr>
            <td style="padding:0 0 40px 0;">
              <div style="height:1px;background:linear-gradient(90deg,#C9A84C,#8B6914,transparent);"></div>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="padding:0 0 48px 0;">
              <h1 style="margin:0 0 12px 0;font-family:'Playfair Display',Georgia,serif;font-size:36px;font-weight:400;color:#ffffff;line-height:1.2;letter-spacing:-0.5px;">Order Confirmed</h1>
              <p style="margin:0;font-size:14px;color:#666;line-height:1.6;letter-spacing:0.2px;">Thank you for your purchase. Your order is being prepared with care.</p>
            </td>
          </tr>

          <!-- Order summary card -->
          <tr>
            <td style="padding:0 0 32px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1e1e1e;border-radius:2px;">
                <tr>
                  <td style="padding:28px 28px 0 28px;">
                    <p style="margin:0 0 20px 0;font-size:10px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:#C9A84C;">Order Summary</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 28px 28px 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:14px 0;color:#8a8a8a;font-size:13px;letter-spacing:0.5px;border-bottom:1px solid #222;width:50%;">Subtotal</td>
                        <td style="padding:14px 0;font-size:13px;text-align:right;border-bottom:1px solid #222;color:#e0e0e0;">$${order.subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding:14px 0;color:#8a8a8a;font-size:13px;letter-spacing:0.5px;border-bottom:1px solid #222;">Tax (8.25%)</td>
                        <td style="padding:14px 0;font-size:13px;text-align:right;border-bottom:1px solid #222;color:#e0e0e0;">$${(order.vat || 0).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding:14px 0;color:#8a8a8a;font-size:13px;letter-spacing:0.5px;border-bottom:1px solid #222;">Shipping</td>
                        <td style="padding:14px 0;font-size:13px;text-align:right;border-bottom:1px solid #222;color:#e0e0e0;">${shippingFee === 0 ? 'Complimentary' : '$' + shippingFee.toFixed(2)}</td>
                      </tr>
                      ${trackingRow}
                      <tr>
                        <td style="padding:20px 0 0 0;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#ffffff;">Total</td>
                        <td style="padding:20px 0 0 0;font-size:20px;font-weight:600;text-align:right;color:#C9A84C;font-family:'Playfair Display',Georgia,serif;">$${order.total.toFixed(2)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery -->
          <tr>
            <td style="padding:0 0 48px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-left:2px solid #C9A84C;padding-left:20px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px 0;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;">Estimated Delivery</p>
                    <p style="margin:0;font-size:15px;color:#e0e0e0;font-family:'Playfair Display',Georgia,serif;font-weight:400;">${order.estimated_delivery || '5–7 business days'}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Gold divider -->
          <tr>
            <td style="padding:0 0 32px 0;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 0 8px 0;">
              <p style="margin:0;font-size:12px;color:#444;line-height:1.7;letter-spacing:0.2px;">Questions about your order? Reply directly to this email and we'll take care of you.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p style="margin:0;font-size:11px;color:#333;letter-spacing:0.5px;">KGiants &nbsp;·&nbsp; Dallas, TX &nbsp;·&nbsp; kgiants.com</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });
  } catch (err) {
    console.error('Customer email failed:', err);
  }
}

async function sendAdminLabelEmail(
  order: any,
  labelUrl: string,
  trackingNumber: string | null,
  address: any
) {
  const resend = getResend();
  if (!resend) return;

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kgiants.com';
  const toName = address?.name || 'Customer';
  const toAddr = [address?.line1, address?.city, address?.state, address?.zip]
    .filter(Boolean).join(', ');

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'orders@kgiants.com',
      to: adminEmail,
      subject: `New Order #${order.id.slice(0, 8).toUpperCase()} — $${order.total.toFixed(2)} | Print Label`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Inter',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header bar -->
          <tr>
            <td style="background:#0a0a0a;padding:20px 28px;border-radius:2px 2px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;">KGIANTS</p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-size:11px;letter-spacing:1px;color:#666;text-transform:uppercase;">Admin Alert</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Gold accent line -->
          <tr>
            <td style="height:2px;background:linear-gradient(90deg,#C9A84C,#8B6914);"></td>
          </tr>

          <!-- Body card -->
          <tr>
            <td style="background:#ffffff;padding:36px 28px;">

              <p style="margin:0 0 6px 0;font-size:20px;font-weight:600;color:#0a0a0a;letter-spacing:-0.3px;">New Order Received</p>
              <p style="margin:0 0 32px 0;font-size:13px;color:#888;">Order #${order.id.slice(0, 8).toUpperCase()} &nbsp;·&nbsp; $${order.total.toFixed(2)}</p>

              <!-- Details table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:12px 0;font-size:12px;letter-spacing:0.5px;color:#aaa;border-bottom:1px solid #f0f0f0;width:130px;text-transform:uppercase;">Ship To</td>
                  <td style="padding:12px 0;font-size:13px;color:#111;border-bottom:1px solid #f0f0f0;font-weight:500;">${toName}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0;font-size:12px;letter-spacing:0.5px;color:#aaa;border-bottom:1px solid #f0f0f0;text-transform:uppercase;">Address</td>
                  <td style="padding:12px 0;font-size:13px;color:#111;border-bottom:1px solid #f0f0f0;">${toAddr}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0;font-size:12px;letter-spacing:0.5px;color:#aaa;border-bottom:1px solid #f0f0f0;text-transform:uppercase;">Tracking</td>
                  <td style="padding:12px 0;font-size:13px;color:#111;border-bottom:1px solid #f0f0f0;font-family:monospace;">${trackingNumber || '—'}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0;font-size:12px;letter-spacing:0.5px;color:#aaa;text-transform:uppercase;">Customer</td>
                  <td style="padding:12px 0;font-size:13px;color:#111;">${order.customer_email}</td>
                </tr>
              </table>

              <!-- CTA -->
              <a href="${labelUrl}" style="display:inline-block;background:#0a0a0a;color:#C9A84C;padding:14px 28px;text-decoration:none;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;border-radius:1px;">
                Download Shipping Label
              </a>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0a0a0a;padding:16px 28px;border-radius:0 0 2px 2px;">
              <p style="margin:0;font-size:11px;color:#444;letter-spacing:0.5px;">Print this label · Pack the order · Drop off at carrier</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });
  } catch (err) {
    console.error('Admin label email failed:', err);
  }
}
