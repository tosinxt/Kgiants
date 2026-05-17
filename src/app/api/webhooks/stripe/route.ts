import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder', {
  apiVersion: '2026-04-22.dahlia',
});

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
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

  const existing = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_payment_intent_id', pi.id)
    .single();

  if (existing.data) return; // already processed

  const metadata = pi.metadata || {};
  const subtotal = parseFloat(metadata.subtotal || '0');
  const vat = parseFloat(metadata.vat || '0');
  const shippingFee = parseFloat(metadata.shipping_fee || '0');

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
      shipping_address: metadata.shipping_address
        ? JSON.parse(metadata.shipping_address)
        : { zip: metadata.shipping_zip || '' },
      shipping_service: metadata.shipping_service || '',
      estimated_delivery: getEstimatedDelivery(),
    })
    .select()
    .single();

  if (error || !order) {
    console.error('Failed to create order:', error);
    return;
  }

  // Send confirmation email
  await sendConfirmationEmail(order, pi.receipt_email || '');
}

function getEstimatedDelivery(): string {
  const now = new Date();
  const delivery = new Date(now);
  delivery.setDate(now.getDate() + 7);
  return delivery.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

async function sendConfirmationEmail(order: any, email: string) {
  if (!email || !process.env.RESEND_API_KEY) return;
  const resend = getResend();
  if (!resend) return;

  const vatAmount = (order.vat || 0).toFixed(2);
  const shippingAmount = (order.shipping_fee || 0).toFixed(2);

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'orders@kgiants.com',
      to: email,
      subject: `KGiants — Order Confirmed (#${order.id.slice(0, 8).toUpperCase()})`,
      html: `
        <div style="font-family: monospace; max-width: 560px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
          <h1 style="font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 32px;">KGiants</h1>
          <h2 style="font-size: 28px; font-weight: 400; margin-bottom: 8px;">Order Confirmed</h2>
          <p style="color: #888; font-size: 13px; margin-bottom: 40px;">Order #${order.id.slice(0, 8).toUpperCase()}</p>

          <div style="border-top: 1px solid #333; padding-top: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #888;">Subtotal</span>
              <span>$${order.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #888;">VAT (7.5%)</span>
              <span>$${vatAmount}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 24px;">
              <span style="color: #888;">Shipping</span>
              <span>${parseFloat(shippingAmount) === 0 ? 'Free' : '$' + shippingAmount}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid #333; padding-top: 16px;">
              <span style="font-weight: 700;">Total</span>
              <span style="font-weight: 700;">$${order.total.toFixed(2)}</span>
            </div>
          </div>

          <p style="color: #888; font-size: 13px;">
            Estimated delivery: <span style="color: #fff;">${order.estimated_delivery || '5–7 business days'}</span>
          </p>

          <p style="margin-top: 40px; color: #555; font-size: 12px;">
            Thank you for shopping with KGiants. Questions? Reply to this email.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Email send failed:', err);
  }
}
