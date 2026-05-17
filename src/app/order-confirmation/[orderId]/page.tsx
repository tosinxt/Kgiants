import React from 'react';
import Link from 'next/link';
import { getOrderById } from '@/lib/supabase';
import Footer from '@/components/Footer';

type PageParams = Promise<{ orderId: string }>;

export default async function OrderConfirmationPage(props: { params: PageParams }) {
  const params = await props.params;
  const order = await getOrderById(params.orderId);

  if (!order) {
    return (
      <div style={wrap}>
        <div style={card}>
          <div style={label}>Order not found</div>
          <Link href="/shop" style={btnPrimary}>Back to Shop</Link>
        </div>
      </div>
    );
  }

  const shortId = order.id.slice(0, 8).toUpperCase();

  return (
    <>
      <div style={wrap}>
        <div style={card}>
          <div style={{ width: 44, height: 44, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="1.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div style={label}>Order confirmed</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 300, color: 'var(--color-ink)', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>
            #{shortId}
          </h1>
          <p style={{ ...muted, marginBottom: 48 }}>
            Confirmation sent to <span style={{ color: 'var(--color-ink)', fontWeight: 400 }}>{order.customer_email}</span>
          </p>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { k: 'Subtotal',   v: `$${order.subtotal.toFixed(2)}` },
              { k: 'VAT (7.5%)', v: `$${order.vat.toFixed(2)}` },
              { k: 'Shipping',   v: order.shipping_fee === 0 ? 'Free' : `$${order.shipping_fee.toFixed(2)}` },
            ].map(({ k, v }) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                <span style={{ color: 'var(--color-stone)' }}>{k}</span>
                <span style={{ color: 'var(--color-ink)' }}>{v}</span>
              </div>
            ))}
            {order.shipping_service && (
              <div style={{ fontSize: 11, color: 'var(--color-stone-light)', letterSpacing: '0.08em', textAlign: 'right', fontFamily: 'var(--font-body)', fontWeight: 500, textTransform: 'uppercase' }}>
                {order.shipping_service}
              </div>
            )}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500 }}>
              <span style={{ color: 'var(--color-ink)' }}>Total</span>
              <span style={{ color: 'var(--color-ink)' }}>${order.total.toFixed(2)}</span>
            </div>
          </div>

          {order.estimated_delivery && (
            <div style={{ marginTop: 28, padding: '16px 20px', background: 'var(--color-cream)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: 'var(--font-body)' }}>
              <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-stone)', fontWeight: 500 }}>Estimated Delivery</span>
              <span style={{ color: 'var(--color-ink)', fontWeight: 300, fontSize: 14 }}>{order.estimated_delivery}</span>
            </div>
          )}

          <div style={{ marginTop: 48, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/shop" style={btnPrimary}>Continue Shopping</Link>
            <Link href="/" style={btnGhost}>Home</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

const wrap: React.CSSProperties = {
  minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px',
  background: 'var(--color-cream)',
};
const card: React.CSSProperties = {
  width: '100%', maxWidth: 480, fontFamily: 'var(--font-body)',
};
const label: React.CSSProperties = {
  fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-stone)', marginBottom: 12, fontFamily: 'var(--font-body)', fontWeight: 500,
};
const muted: React.CSSProperties = {
  fontSize: 14, color: 'var(--color-stone)', lineHeight: 1.6, fontFamily: 'var(--font-body)', fontWeight: 300,
};
const btnPrimary: React.CSSProperties = {
  display: 'inline-block', background: 'var(--color-ink)', color: 'var(--color-cream)',
  padding: '13px 28px', borderRadius: 'var(--radius-buttons)', textDecoration: 'none',
  fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
  border: '1px solid var(--color-ink)',
};
const btnGhost: React.CSSProperties = {
  display: 'inline-block', background: 'transparent', color: 'var(--color-stone)',
  padding: '13px 28px', borderRadius: 'var(--radius-buttons)', textDecoration: 'none',
  fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
  border: '1px solid var(--color-border)',
};
