import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder', {
  apiVersion: '2026-04-22.dahlia',
});

const VAT_RATE = 0.075;

export async function POST(req: NextRequest) {
  try {
    const { items, shippingFee, customerEmail, shippingAddress } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
    const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
    const shipping = shippingFee || 0;
    const total = Math.round((subtotal + vat + shipping) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      receipt_email: customerEmail,
      metadata: {
        subtotal: subtotal.toFixed(2),
        vat: vat.toFixed(2),
        shipping_fee: shipping.toFixed(2),
        item_count: items.length.toString(),
        shipping_zip: shippingAddress?.zip || '',
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      breakdown: {
        subtotal,
        vat,
        shipping,
        total: total / 100,
      },
    });
  } catch (err: any) {
    console.error('PaymentIntent error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
