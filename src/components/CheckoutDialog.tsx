"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Lock, Truck } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { ShippingRate } from "@/app/api/shipping/rates/route";
import styles from "./CheckoutDialog.module.css";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);
const VAT_RATE = 0.0825;

/* ── Order summary (always visible on left) ─────────────────────── */

function OrderSummary({
  subtotal,
  selectedRate,
}: {
  subtotal: number;
  selectedRate: ShippingRate | null;
}) {
  const { items } = useCart();
  const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
  const shipping = selectedRate?.price ?? null;
  const total = shipping !== null ? subtotal + vat + shipping : null;

  return (
    <div className={styles.summary}>
      <h2 className={styles.summaryTitle}>Order Summary</h2>
      <ul className={styles.summaryItems}>
        {items.map((item) => (
          <li key={item.id} className={styles.summaryItem}>
            <div className={styles.summaryImgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image_url} alt={item.name} className={styles.summaryImg} />
              <span className={styles.summaryQtyBadge}>{item.quantity}</span>
            </div>
            <div className={styles.summaryItemInfo}>
              <span className={styles.summaryItemName}>{item.name}</span>
              <span className={styles.summaryItemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.summaryLedger}>
        <div className={styles.ledgerRow}>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.ledgerRow}>
          <span>Tax (8.25%)</span>
          <span>${vat.toFixed(2)}</span>
        </div>
        <div className={styles.ledgerRow}>
          <span>Shipping</span>
          <span className={shipping === 0 ? styles.free : undefined}>
            {shipping === null
              ? "—"
              : shipping === 0
              ? "Free"
              : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className={styles.ledgerTotal}>
          <span>Total</span>
          <span>{total !== null ? `$${total.toFixed(2)}` : "—"}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Step 1: Contact + Address ──────────────────────────────────── */

interface AddressState {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
}

const emptyAddress: AddressState = {
  name: "", line1: "", line2: "", city: "", state: "", zip: "",
};

function DetailsStep({
  onNext,
  loading,
  email,
  setEmail,
  address,
  setAddress,
}: {
  onNext: () => void;
  loading: boolean;
  email: string;
  setEmail: (v: string) => void;
  address: AddressState;
  setAddress: (a: AddressState) => void;
}) {
  const { items } = useCart();

  const update =
    (field: keyof AddressState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setAddress({ ...address, [field]: e.target.value });

  const valid =
    !!email &&
    !!address.name &&
    !!address.line1 &&
    !!address.city &&
    !!address.state &&
    address.zip.length === 5 &&
    items.length > 0;

  return (
    <div className={styles.formPanel}>
      <h2 className={styles.formTitle}>Contact & Shipping</h2>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Contact</legend>
        <label className={styles.label}>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={styles.input}
          />
        </label>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Shipping address</legend>
        <label className={styles.label}>
          Full name
          <input
            type="text"
            required
            value={address.name}
            onChange={update("name")}
            placeholder="Jane Smith"
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Address line 1
          <input
            type="text"
            required
            value={address.line1}
            onChange={update("line1")}
            placeholder="123 Main St"
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Address line 2
          <input
            type="text"
            value={address.line2}
            onChange={update("line2")}
            placeholder="Apt, suite, etc. (optional)"
            className={styles.input}
          />
        </label>
        <div className={styles.row3}>
          <label className={`${styles.label} ${styles.grow}`}>
            City
            <input
              type="text"
              required
              value={address.city}
              onChange={update("city")}
              placeholder="New York"
              className={styles.input}
            />
          </label>
          <label className={styles.label} style={{ width: 72 }}>
            State
            <input
              type="text"
              required
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value.slice(0, 2).toUpperCase() })
              }
              placeholder="NY"
              maxLength={2}
              className={styles.input}
            />
          </label>
          <label className={styles.label} style={{ width: 96 }}>
            ZIP
            <input
              type="text"
              required
              value={address.zip}
              onChange={(e) =>
                setAddress({
                  ...address,
                  zip: e.target.value.replace(/\D/g, "").slice(0, 5),
                })
              }
              placeholder="10001"
              maxLength={5}
              className={styles.input}
            />
          </label>
        </div>
      </fieldset>

      <button
        className={styles.primaryBtn}
        disabled={!valid || loading}
        onClick={onNext}
      >
        {loading ? (
          "Fetching rates…"
        ) : (
          <>
            Get shipping rates <ArrowRight size={15} />
          </>
        )}
      </button>
      <p className={styles.secureNote}>
        <Lock size={11} /> All data transmitted via encrypted TLS
      </p>
    </div>
  );
}

/* ── Step 2: Shipping rate picker ───────────────────────────────── */

function ShippingStep({
  onNext,
  onBack,
  rates,
  selectedRate,
  setSelectedRate,
  loading,
}: {
  onNext: () => void;
  onBack: () => void;
  rates: ShippingRate[];
  selectedRate: ShippingRate | null;
  setSelectedRate: (r: ShippingRate) => void;
  loading: boolean;
}) {
  return (
    <div className={styles.formPanel}>
      <button className={styles.backBtn} onClick={onBack}>
        <ArrowLeft size={14} /> Back
      </button>
      <h2 className={styles.formTitle}>Shipping method</h2>

      {loading ? (
        <p className={styles.initNote}>Fetching rates…</p>
      ) : (
        <div className={styles.rateList}>
          {rates.map((rate) => (
            <label
              key={rate.id}
              className={`${styles.rateOption} ${
                selectedRate?.id === rate.id ? styles.rateOptionSelected : ""
              }`}
            >
              <input
                type="radio"
                name="shippingRate"
                checked={selectedRate?.id === rate.id}
                onChange={() => setSelectedRate(rate)}
                className={styles.rateRadio}
              />
              <div className={styles.rateInfo}>
                <span className={styles.rateProvider}>
                  <Truck size={13} /> {rate.provider}
                </span>
                <span className={styles.rateService}>{rate.service}</span>
                <span className={styles.rateEta}>{rate.estimated_days}</span>
              </div>
              <span className={styles.ratePrice}>
                {rate.price === 0 ? (
                  <span className={styles.free}>Free</span>
                ) : (
                  `$${rate.price.toFixed(2)}`
                )}
              </span>
            </label>
          ))}
        </div>
      )}

      <button
        className={styles.primaryBtn}
        disabled={!selectedRate || loading}
        onClick={onNext}
      >
        Continue to payment <ArrowRight size={15} />
      </button>
    </div>
  );
}

/* ── Step 3: Payment ────────────────────────────────────────────── */

function PaymentStep({
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
  const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
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
      redirect: "if_required",
    });
    if (error) {
      toast.error(error.message || "Payment failed");
      setProcessing(false);
    } else if (paymentIntent?.status === "succeeded") {
      clearCart();
      toggleCheckout();
      router.push(`/order-confirmation/${paymentIntentId}`);
    }
  };

  return (
    <div className={styles.formPanel}>
      <button className={styles.backBtn} onClick={onBack}>
        <ArrowLeft size={14} /> Back
      </button>
      <h2 className={styles.formTitle}>Payment</h2>
      <form onSubmit={handleSubmit}>
        <PaymentElement
          options={{
            layout: "tabs",
            fields: { billingDetails: { email: "never" } },
          }}
        />
        <button
          type="submit"
          disabled={processing || !stripe}
          className={styles.primaryBtn}
          style={{ marginTop: 24 }}
        >
          <Lock size={13} />
          {processing ? "Processing…" : `Pay $${total.toFixed(2)}`}
        </button>
      </form>
      <p className={styles.secureNote}>
        <Lock size={11} /> Secured by Stripe · PCI-DSS compliant
      </p>
    </div>
  );
}

/* ── Root dialog ────────────────────────────────────────────────── */

export default function CheckoutDialog() {
  const { isCheckoutOpen, toggleCheckout, items, totalPrice } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState<AddressState>(emptyAddress);
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [fetchingRates, setFetchingRates] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [creatingIntent, setCreatingIntent] = useState(false);

  useEffect(() => {
    if (!isCheckoutOpen) {
      setStep(1);
      setRates([]);
      setSelectedRate(null);
      setClientSecret("");
      setPaymentIntentId("");
    }
  }, [isCheckoutOpen]);

  const fetchRates = useCallback(async () => {
    if (fetchingRates) return;
    setFetchingRates(true);
    try {
      const res = await fetch("/api/shipping/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zip: address.zip,
          items: items.map((i) => ({
            weight_oz: (i as any).weight_oz || 4,
            quantity: i.quantity,
          })),
          subtotal: totalPrice,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const fetchedRates: ShippingRate[] = data.rates || [];
      setRates(fetchedRates);
      if (fetchedRates.length > 0) setSelectedRate(fetchedRates[0]);
      setStep(2);
    } catch (err: any) {
      toast.error("Could not fetch shipping rates. Please try again.");
    } finally {
      setFetchingRates(false);
    }
  }, [fetchingRates, address.zip, items, totalPrice]);

  const createPaymentIntent = useCallback(async () => {
    if (!selectedRate || creatingIntent) return;
    setCreatingIntent(true);
    try {
      const res = await fetch("/api/checkout/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerEmail: email,
          shippingAddress: address,
          shippingFee: selectedRate.price,
          shippingRateId: selectedRate.id,
          shippingService: selectedRate.service,
          shippingProvider: selectedRate.provider,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      setStep(3);
    } catch (err: any) {
      toast.error("Could not initialize payment: " + err.message);
    } finally {
      setCreatingIntent(false);
    }
  }, [selectedRate, creatingIntent, items, email, address]);

  if (!isCheckoutOpen) return null;

  const stepLabels = ["Details", "Shipping", "Payment"];

  return (
    <div className={styles.overlay} onClick={toggleCheckout}>
      <motion.div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Step indicator */}
        <div className={styles.stepBar}>
          {stepLabels.map((label, i) => (
            <React.Fragment key={label}>
              <div className={styles.stepNode}>
                <span
                  className={`${styles.stepDot} ${
                    step >= i + 1 ? styles.stepDotActive : ""
                  }`}
                />
                <span
                  className={
                    step === i + 1
                      ? styles.stepLabelActive
                      : styles.stepLabelDim
                  }
                >
                  {label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div
                  className={`${styles.stepConnector} ${
                    step > i + 1 ? styles.stepConnectorFilled : ""
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          className={styles.closeBtn}
          onClick={toggleCheckout}
          aria-label="Close checkout"
        >
          <X size={15} />
        </button>

        <div className={styles.body}>
          <OrderSummary subtotal={totalPrice} selectedRate={selectedRate} />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                className={styles.formCol}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                <DetailsStep
                  onNext={fetchRates}
                  loading={fetchingRates}
                  email={email}
                  setEmail={setEmail}
                  address={address}
                  setAddress={setAddress}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                className={styles.formCol}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                <ShippingStep
                  onNext={createPaymentIntent}
                  onBack={() => setStep(1)}
                  rates={rates}
                  selectedRate={selectedRate}
                  setSelectedRate={setSelectedRate}
                  loading={creatingIntent}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                className={styles.formCol}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                {creatingIntent ? (
                  <div className={styles.formPanel}>
                    <p className={styles.initNote}>
                      Initializing secure payment…
                    </p>
                  </div>
                ) : clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          fontFamily: "Jost, sans-serif",
                          borderRadius: "4px",
                          colorPrimary: "#1A1714",
                        },
                      },
                    }}
                  >
                    <PaymentStep
                      onBack={() => setStep(2)}
                      email={email}
                      subtotal={totalPrice}
                      shippingFee={selectedRate?.price ?? 0}
                      paymentIntentId={paymentIntentId}
                    />
                  </Elements>
                ) : (
                  <div className={styles.formPanel}>
                    <button
                      className={styles.backBtn}
                      onClick={() => setStep(2)}
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                    <p className={styles.initNote}>
                      Could not initialize payment.
                    </p>
                    <button
                      className={styles.primaryBtn}
                      onClick={createPaymentIntent}
                    >
                      Retry
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
