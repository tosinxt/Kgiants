#!/usr/bin/env node
/**
 * Test the Stripe webhook endpoint locally.
 *
 * Usage:
 *   node scripts/test-webhook.mjs
 *
 * Make sure your dev server is running: npm run dev
 */

import Stripe from 'stripe';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT  = resolve(__dir, '..');

function loadEnv() {
  const raw = readFileSync(resolve(ROOT, '.env.local'), 'utf8');
  const env = {};
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnv();

const SECRET_KEY    = env.STRIPE_SECRET_KEY;
const WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;
const ENDPOINT      = 'http://localhost:3000/api/webhooks/stripe';

if (!SECRET_KEY || SECRET_KEY.includes('sk_test_...')) {
  console.error('✗ STRIPE_SECRET_KEY not set in .env.local');
  process.exit(1);
}
if (!WEBHOOK_SECRET || WEBHOOK_SECRET.includes('whsec_...')) {
  console.error('✗ STRIPE_WEBHOOK_SECRET not set in .env.local');
  process.exit(1);
}

const stripe = new Stripe(SECRET_KEY, { apiVersion: '2026-04-22.dahlia' });

// ── Build a realistic payment_intent.succeeded event ─────────────────────────
const paymentIntent = {
  id: `pi_test_${Date.now()}`,
  object: 'payment_intent',
  amount: 13799,           // $137.99
  currency: 'usd',
  status: 'succeeded',
  receipt_email: 'hello@tosinxt.com',
  metadata: {
    subtotal: '114.99',
    vat: '9.49',
    shipping_fee: '0.00',
    shipping_service: 'Standard Shipping',
    shipping_address: JSON.stringify({
      name: 'Test Customer',
      line1: '123 Main St',
      city: 'Dallas',
      state: 'TX',
      zip: '75201',
    }),
    items_json: JSON.stringify([
      { product_id: 'AP-3001', product_name: 'Aromar+ Diffuser — White', quantity: 1, unit_price: 79.99, weight_oz: 24 },
      { product_id: 'AP-1006', product_name: 'Fragrance Oil — Dubai',    quantity: 1, unit_price: 35.00, weight_oz: 2  },
    ]),
    shippo_rate_id: 'mock_rate_test',
  },
};

const event = {
  id: `evt_test_${Date.now()}`,
  object: 'event',
  type: 'payment_intent.succeeded',
  created: Math.floor(Date.now() / 1000),
  data: { object: paymentIntent },
  livemode: false,
  api_version: '2026-04-22.dahlia',
};

// Sign the payload exactly as Stripe does
const payload   = JSON.stringify(event);
const timestamp = Math.floor(Date.now() / 1000);
const signed    = `${timestamp}.${payload}`;
const sig       = stripe.webhooks.generateTestHeaderString({
  payload,
  secret: WEBHOOK_SECRET,
});

console.log('Sending test webhook to', ENDPOINT);
console.log('Event type: payment_intent.succeeded');
console.log('PaymentIntent ID:', paymentIntent.id);
console.log('Amount: $' + (paymentIntent.amount / 100).toFixed(2));
console.log('');

try {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'stripe-signature': sig,
    },
    body: payload,
  });

  const text = await res.text();

  if (res.ok) {
    console.log('✓ Webhook accepted (HTTP', res.status + ')');
    console.log('  Response:', text);
    console.log('');
    console.log('Check your Supabase orders table for a new row.');
    console.log('Check your email inboxes if Resend is configured.');
  } else {
    console.error('✗ Webhook rejected (HTTP', res.status + ')');
    console.error('  Response:', text);
  }
} catch (err) {
  console.error('✗ Could not reach', ENDPOINT);
  console.error('  Is the dev server running? (npm run dev)');
  console.error('  Error:', err.message);
}
