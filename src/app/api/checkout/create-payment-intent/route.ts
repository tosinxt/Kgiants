import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder', {
  apiVersion: '2026-04-22.dahlia',
});

const VAT_RATE = 0.075;

export async function POST(req: NextRequest) {
  try {
    const {
      items,
      customerEmail,
      shippingAddress,
      shippingFee,
      shippingRateId,
      shippingService,
      shippingProvider,
    } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
    const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
    const shipping = typeof shippingFee === 'number' ? shippingFee : 0;
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
        // Full address for label generation
        shipping_address: JSON.stringify(shippingAddress),
        // Shippo rate to purchase
        shippo_rate_id: shippingRateId || '',
        shipping_service: shippingService || '',
        shipping_provider: shippingProvider || '',
        // Item weights for parcel
        items_json: JSON.stringify(
          items.map((i: any) => ({
            sku: i.sku || i.id,
            name: i.name,
            quantity: i.quantity,
            weight_oz: i.weight_oz || 4,
          }))
        ),
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      breakdown: { subtotal, vat, shipping, total: total / 100 },
    });
  } catch (err: any) {
    console.error('PaymentIntent error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
