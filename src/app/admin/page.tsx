import React from 'react';
import { getOrders, getAllProductsAdmin } from '@/lib/supabase';
import Link from 'next/link';

export default async function AdminOverviewPage() {
  const [orders, products] = await Promise.all([getOrders(), getAllProductsAdmin()]);

  const totalRevenue = orders
    .filter(o => o.status === 'paid' || o.status === 'fulfilled')
    .reduce((sum, o) => sum + o.total, 0);

  const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.low_stock_threshold);
  const oos = products.filter(p => p.stock === 0);

  const stats = [
    { label: 'Orders',    value: orders.length },
    { label: 'Revenue',   value: `$${totalRevenue.toFixed(2)}` },
    { label: 'Products',  value: products.length },
    { label: 'Low Stock', value: lowStock.length, warn: lowStock.length > 0 },
  ];

  return (
    <div>
      <h1 style={h1}>Overview</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 48 }}>
        {stats.map(s => (
          <div key={s.label} style={{ padding: '20px 24px', background: 'var(--color-white)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: 10, color: 'var(--color-stone)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, fontFamily: 'var(--font-body)', fontWeight: 500 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 300, color: s.warn ? 'var(--color-gold)' : 'var(--color-ink)', letterSpacing: '-0.02em' }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {(oos.length > 0 || lowStock.length > 0) && (
        <div style={{ marginBottom: 32, padding: '16px 20px', background: 'var(--color-white)', border: '1px solid var(--color-border)' }}>
          {oos.length > 0 && (
            <p style={{ fontSize: 13, color: 'var(--color-stone)', marginBottom: 6, fontFamily: 'var(--font-body)', fontWeight: 300 }}>
              Out of stock: {oos.map(p => p.name).join(', ')}
            </p>
          )}
          {lowStock.length > 0 && (
            <p style={{ fontSize: 13, color: 'var(--color-stone)', fontFamily: 'var(--font-body)', fontWeight: 300 }}>
              Low stock: {lowStock.map(p => `${p.name} (${p.stock})`).join(', ')}
            </p>
          )}
          <Link href="/admin/products" style={{ fontSize: 11, color: 'var(--color-ink)', textDecoration: 'underline', marginTop: 10, display: 'inline-block', letterSpacing: '0.06em', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
            Manage stock →
          </Link>
        </div>
      )}

      <h2 style={h2}>Recent Orders</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={tbl}>
          <thead>
            <tr>
              {['Order', 'Customer', 'Total', 'Status', 'Date'].map(col => (
                <th key={col} style={th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 10).map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={td}>#{order.id.slice(0, 8).toUpperCase()}</td>
                <td style={td}>{order.customer_email}</td>
                <td style={td}>${order.total.toFixed(2)}</td>
                <td style={td}><span style={badge()}>{order.status}</span></td>
                <td style={{ ...td, color: 'var(--color-stone)' }}>{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} style={{ ...td, textAlign: 'center', padding: 60, color: 'var(--color-stone)' }}>No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const h1: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 32, color: 'var(--color-stone)' };
const h2: React.CSSProperties = { ...h1, marginTop: 0, marginBottom: 16 };
const tbl: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 300 };
const th: React.CSSProperties = { textAlign: 'left', padding: '8px 16px', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-stone)', borderBottom: '1px solid var(--color-border)', fontWeight: 500 };
const td: React.CSSProperties = { padding: '14px 16px', color: 'var(--color-ink)' };

function badge(): React.CSSProperties {
  return {
    display: 'inline-block', padding: '2px 8px',
    fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' as const,
    border: '1px solid var(--color-border)', color: 'var(--color-stone)',
    fontFamily: 'var(--font-body)', fontWeight: 500,
  };
}
