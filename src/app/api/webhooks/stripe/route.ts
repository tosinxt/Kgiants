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

  const trackingRow = trackingNumber
    ? `<div style="display:flex;justify-content:space-between;margin-bottom:12px;">
        <span style="color:#888;">Tracking</span>
        <span>${trackingNumber}</span>
       </div>`
    : '';

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'orders@kgiants.com',
      to: email,
      subject: `KGiants — Order Confirmed (#${order.id.slice(0, 8).toUpperCase()})`,
      html: `
        <div style="font-family:monospace;max-width:560px;margin:0 auto;background:#000;color:#fff;padding:40px;">
          <h1 style="font-size:14px;letter-spacing:2px;text-transform:uppercase;margin-bottom:32px;">KGiants</h1>
          <h2 style="font-size:28px;font-weight:400;margin-bottom:8px;">Order Confirmed</h2>
          <p style="color:#888;font-size:13px;margin-bottom:40px;">Order #${order.id.slice(0, 8).toUpperCase()}</p>
          <div style="border-top:1px solid #333;padding-top:24px;margin-bottom:24px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
              <span style="color:#888;">Subtotal</span><span>$${order.subtotal.toFixed(2)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
              <span style="color:#888;">Tax (7.5%)</span><span>$${(order.vat || 0).toFixed(2)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
              <span style="color:#888;">Shipping</span>
              <span>${(order.shipping_fee || 0) === 0 ? 'Free' : '$' + (order.shipping_fee || 0).toFixed(2)}</span>
            </div>
            ${trackingRow}
            <div style="display:flex;justify-content:space-between;border-top:1px solid #333;padding-top:16px;">
              <span style="font-weight:700;">Total</span>
              <span style="font-weight:700;">$${order.total.toFixed(2)}</span>
            </div>
          </div>
          <p style="color:#888;font-size:13px;">
            Estimated delivery: <span style="color:#fff;">${order.estimated_delivery || '5–7 business days'}</span>
          </p>
          <p style="margin-top:40px;color:#555;font-size:12px;">
            Thank you for shopping with KGiants. Questions? Reply to this email.
          </p>
        </div>
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
      subject: `📦 New Order — Print Label #${order.id.slice(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family:monospace;max-width:560px;margin:0 auto;padding:40px;background:#fff;color:#000;">
          <h1 style="font-size:20px;font-weight:700;margin-bottom:8px;">New Order Received</h1>
          <p style="color:#555;margin-bottom:32px;">Order #${order.id.slice(0, 8).toUpperCase()} · $${order.total.toFixed(2)}</p>

          <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
            <tr><td style="padding:8px 0;color:#555;width:140px;">Ship to</td><td>${toName}</td></tr>
            <tr><td style="padding:8px 0;color:#555;">Address</td><td>${toAddr}</td></tr>
            <tr><td style="padding:8px 0;color:#555;">Tracking</td><td>${trackingNumber || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#555;">Customer email</td><td>${order.customer_email}</td></tr>
          </table>

          <a href="${labelUrl}" style="display:inline-block;background:#000;color:#fff;padding:14px 28px;text-decoration:none;font-size:14px;letter-spacing:1px;">
            DOWNLOAD SHIPPING LABEL (PDF)
          </a>

          <p style="margin-top:32px;color:#999;font-size:12px;">
            Print this label, pack the order, and drop it off at your carrier.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Admin label email failed:', err);
  }
}
