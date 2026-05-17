'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Lock, Truck } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { ShippingRate } from '@/app/api/shipping/rates/route';
import styles from './CheckoutDialog.module.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
const VAT_RATE = 0.075;

function Step1({
  onNext,
  email,
  setEmail,
}: {
  onNext: () => void;
  email: string;
  setEmail: (v: string) => void;
}) {
  const { items, totalPrice, removeItem } = useCart();
  const vat = totalPrice * VAT_RATE;

  return (
    <div className={styles.contentGrid}>
      <div className={styles.cartSection}>
        <h2 className={styles.sectionTitle}>Cart</h2>
        <div className={styles.cartList}>
          {items.length === 0 ? (
            <p style={{ color: 'var(--color-stone)', fontSize: 14, fontFamily: 'var(--font-body)', fontWeight: 300 }}>Your cart is empty.</p>
          ) : (
            items.map(item => (
              <div key={item.id} className={styles.cartItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url} alt={item.name} className={styles.itemImage} />
                <div className={styles.itemInfo}>
                  <div className={styles.itemHeader}>
                    <span className={styles.itemName}>{item.name}</span>
                    <button className={styles.itemRemove} onClick={() => removeItem(item.id)}>
                      <X size={14} />
                    </button>
                  </div>
                  <div className={styles.itemMeta}>Qty: {item.quantity}</div>
                  <div className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.divider} />
        <div className={styles.totalRow}>
          <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className={styles.totalRow}>
          <span>VAT (7.5%)</span><span>${vat.toFixed(2)}</span>
        </div>
        <div className={styles.totalRow}>
          <span>Shipping</span><span>Calculated next</span>
        </div>
        <div className={styles.divider} />
        <div style={{ fontSize: 12, color: 'var(--color-stone-light)', marginTop: 4, fontFamily: 'var(--font-body)', fontWeight: 300 }}>
          7.5% VAT applied at checkout per US tax policy.
        </div>
      </div>

      <div className={styles.verticalDivider} />

      <div className={styles.checkoutSection}>
        <h2 className={styles.sectionTitle}>Checkout</h2>
        <p className={styles.sectionSubtitle}>
          Enter your email to receive your order confirmation.
        </p>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className={styles.emailInput}
        />
        <button
          className={styles.primaryCheckoutBtn}
          disabled={!email || items.length === 0}
          onClick={onNext}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          Continue to Shipping <ArrowRight size={15} />
        </button>
        <div style={{ marginTop: 16, fontSize: 12, color: 'var(--color-stone-light)', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontWeight: 300 }}>
          <Lock size={12} /> All data transmitted via encrypted TLS
        </div>
      </div>
    </div>
  );
}

function Step2({
  onNext,
  onBack,
  zip,
  setZip,
  selectedRate,
  setSelectedRate,
  rates,
  setRates,
  subtotal,
}: {
  onNext: () => void;
  onBack: () => void;
  zip: string;
  setZip: (v: string) => void;
  selectedRate: ShippingRate | null;
  setSelectedRate: (r: ShippingRate) => void;
  rates: ShippingRate[];
  setRates: (r: ShippingRate[]) => void;
  subtotal: number;
}) {
  const [loading, setLoading] = useState(false);
  const { items } = useCart();
  const vat = subtotal * VAT_RATE;

  const fetchRates = async () => {
    if (zip.length < 5) return;
    setLoading(true);
    try {
      const res = await fetch('/api/shipping/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zip,
          items: items.map(i => ({ weight_oz: (i as any).weight_oz || 4, quantity: i.quantity })),
          subtotal,
        }),
      });
      const data = await res.json();
      setRates(data.rates || []);
      if (data.rates?.length > 0) setSelectedRate(data.rates[0]);
    } catch {
      toast.error('Could not fetch shipping rates');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contentGrid}>
      <div className={styles.cartSection}>
        <button onClick={onBack} style={backBtnStyle}><ArrowLeft size={14} /> Back</button>
        <h2 className={styles.sectionTitle}>Shipping</h2>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <input
            type="text"
            value={zip}
            onChange={e => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="US ZIP code"
            className={styles.emailInput}
            style={{ marginBottom: 0, flex: 1 }}
            maxLength={5}
          />
          <button
            onClick={fetchRates}
            disabled={zip.length < 5 || loading}
            className={styles.primaryCheckoutBtn}
            style={{ flex: 'none', width: 'auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {loading ? 'Loading...' : <><Truck size={13} /> Get Rates</>}
          </button>
        </div>

        {rates.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rates.map(rate => (
              <label
                key={rate.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px',
                  border: `1px solid ${selectedRate?.id === rate.id ? 'var(--color-ink)' : 'var(--color-border)'}`,
                  cursor: 'pointer',
                  background: selectedRate?.id === rate.id ? 'var(--color-cream)' : 'transparent',
                  transition: 'all 180ms ease-out', fontSize: 14,
                  fontFamily: 'var(--font-body)', fontWeight: 300,
                }}
              >
                <input
                  type="radio"
                  name="shipping"
                  checked={selectedRate?.id === rate.id}
                  onChange={() => setSelectedRate(rate)}
                  style={{ accentColor: 'var(--color-ink)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--color-ink)', fontWeight: 400 }}>{rate.provider} — {rate.service}</div>
                  <div style={{ color: 'var(--color-stone)', marginTop: 2, fontSize: 12 }}>{rate.estimated_days}</div>
                </div>
                <div style={{ color: 'var(--color-ink)', fontWeight: 400 }}>{rate.price === 0 ? 'Free' : `$${rate.price.toFixed(2)}`}</div>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className={styles.verticalDivider} />

      <div className={styles.checkoutSection}>
        <h2 className={styles.sectionTitle}>Summary</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 300 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-stone)' }}>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-stone)' }}>VAT (7.5%)</span><span>${vat.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-stone)' }}>Shipping</span>
            <span>{selectedRate ? (selectedRate.price === 0 ? 'Free' : `$${selectedRate.price.toFixed(2)}`) : '—'}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
            <span>Total</span>
            <span>${selectedRate ? (subtotal + vat + selectedRate.price).toFixed(2) : (subtotal + vat).toFixed(2)}</span>
          </div>
        </div>
        <button
          className={styles.primaryCheckoutBtn}
          disabled={!selectedRate}
          onClick={onNext}
          style={{ marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          Continue to Payment <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

function PaymentForm({
  onBack,
  email,
  subtotal,
  shippingFee,
  paymentIntentId,
}: {
  onBack: () => void;
  email: string;
  subtotal: number;
  shippingFee: number;
  paymentIntentId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const { clearCart, toggleCheckout } = useCart();
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        receipt_email: email,
        return_url: `${window.location.origin}/order-confirmation/${paymentIntentId}`,
      },
      redirect: 'if_required',
    });
    if (error) {
      toast.error(error.message || 'Payment failed');
      setProcessing(false);
    } else if (paymentIntent?.status === 'succeeded') {
      clearCart();
      toggleCheckout();
      router.push(`/order-confirmation/${paymentIntentId}`);
    }
  };

  return (
    <div className={styles.contentGrid}>
      <div className={styles.cartSection}>
        <button onClick={onBack} style={backBtnStyle}><ArrowLeft size={14} /> Back</button>
        <h2 className={styles.sectionTitle}>Payment</h2>
        <form onSubmit={handleSubmit}>
          <PaymentElement options={{ layout: 'tabs', fields: { billingDetails: { email: 'never' } } }} />
          <button
            type="submit"
            disabled={processing || !stripe}
            className={styles.primaryCheckoutBtn}
            style={{ marginTop: 24, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Lock size={13} />
            {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </button>
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--color-stone-light)', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontWeight: 300 }}>
            <Lock size={12} /> Secured by Stripe · PCI-DSS compliant
          </div>
        </form>
      </div>

      <div className={styles.verticalDivider} />

      <div className={styles.checkoutSection}>
        <h2 className={styles.sectionTitle}>Total</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 300 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-stone)' }}>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-stone)' }}>VAT (7.5%)</span><span>${vat.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-stone)' }}>Shipping</span>
            <span>{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
        </div>
        <div style={{ marginTop: 32, padding: '14px 16px', background: 'var(--color-cream)', border: '1px solid var(--color-border)', fontSize: 12, color: 'var(--color-stone)', lineHeight: 1.6, fontFamily: 'var(--font-body)', fontWeight: 300 }}>
          Apple Pay and Google Pay are available where supported by your browser and device.
        </div>
      </div>
    </div>
  );
}

export default function CheckoutDialog() {
  const { isCheckoutOpen, toggleCheckout, items, totalPrice } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [zip, setZip] = useState('');
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [creatingIntent, setCreatingIntent] = useState(false);

  useEffect(() => {
    if (!isCheckoutOpen) {
      setStep(1);
      setRates([]);
      setSelectedRate(null);
      setClientSecret('');
      setPaymentIntentId('');
    }
  }, [isCheckoutOpen]);

  const createPaymentIntent = useCallback(async () => {
    if (!selectedRate || creatingIntent) return;
    setCreatingIntent(true);
    try {
      const res = await fetch('/api/checkout/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingFee: selectedRate.price,
          customerEmail: email,
          shippingAddress: { zip },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
    } catch (err: any) {
      toast.error('Could not initialize payment: ' + err.message);
    } finally {
      setCreatingIntent(false);
    }
  }, [selectedRate, items, email, zip, creatingIntent]);

  if (!isCheckoutOpen) return null;

  const goToStep3 = async () => {
    await createPaymentIntent();
    setStep(3);
  };

  return (
    <div className={styles.overlay} onClick={toggleCheckout}>
      <motion.div
        className={styles.dialog}
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <button className={styles.closeBtn} onClick={toggleCheckout}><X size={15} /></button>

        <div style={{ position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 10 }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ width: 5, height: 5, borderRadius: '50%', background: step >= n ? 'var(--color-ink)' : 'var(--color-border)', transition: 'background 0.2s' }} />
          ))}
        </div>

        {step === 1 && <Step1 onNext={() => setStep(2)} email={email} setEmail={setEmail} />}

        {step === 2 && (
          <Step2
            onNext={goToStep3}
            onBack={() => setStep(1)}
            zip={zip}
            setZip={setZip}
            selectedRate={selectedRate}
            setSelectedRate={setSelectedRate}
            rates={rates}
            setRates={setRates}
            subtotal={totalPrice}
          />
        )}

        {step === 3 && (
          creatingIntent ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: 60, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-stone)', fontWeight: 300 }}>
              Initializing secure payment...
            </div>
          ) : clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: { fontFamily: 'Jost, sans-serif', borderRadius: '2px', colorPrimary: '#1A1714' },
                },
              }}
            >
              <PaymentForm
                onBack={() => setStep(2)}
                email={email}
                subtotal={totalPrice}
                shippingFee={selectedRate?.price || 0}
                paymentIntentId={paymentIntentId}
              />
            </Elements>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: 60, gap: 16 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-stone)', fontWeight: 300 }}>Could not initialize payment.</p>
              <button onClick={goToStep3} className={styles.primaryCheckoutBtn} style={{ padding: '12px 24px' }}>Retry</button>
            </div>
          )
        )}
      </motion.div>
    </div>
  );
}

const backBtnStyle: React.CSSProperties = {
  background: 'transparent', border: 'none', color: 'var(--color-stone)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
  fontFamily: 'var(--font-body)', fontWeight: 500, letterSpacing: '0.06em',
  textTransform: 'uppercase', marginBottom: 24, padding: 0,
};
