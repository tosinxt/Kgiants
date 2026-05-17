'use client';

import React, { useState, useMemo } from 'react';
import { Order } from '@/lib/supabase';

type StatusFilter = 'all' | 'pending' | 'paid' | 'fulfilled' | 'refunded';

export default function AdminOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() =>
    statusFilter === 'all' ? initialOrders : initialOrders.filter(o => o.status === statusFilter),
    [initialOrders, statusFilter]
  );

  const statuses: StatusFilter[] = ['all', 'pending', 'paid', 'fulfilled', 'refunded'];

  return (
    <div>
      <h1 style={h1}>Orders</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {statuses.map(s => (
          <button
            key={s}
            style={{
              ...filterBtn,
              border: `1px solid ${statusFilter === s ? 'var(--color-ink)' : 'var(--color-border)'}`,
              color: statusFilter === s ? 'var(--color-cream)' : 'var(--color-stone)',
              background: statusFilter === s ? 'var(--color-ink)' : 'transparent',
            }}
            onClick={() => setStatusFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={tbl}>
          <thead>
            <tr>
              {['Order', 'Customer', 'Subtotal', 'VAT', 'Shipping', 'Total', 'Status', 'Date', ''].map(col => (
                <th key={col} style={th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <React.Fragment key={order.id}>
                <tr
                  style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                >
                  <td style={td}>#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td style={td}>{order.customer_email}</td>
                  <td style={td}>${order.subtotal.toFixed(2)}</td>
                  <td style={td}>${order.vat.toFixed(2)}</td>
                  <td style={td}>${order.shipping_fee.toFixed(2)}</td>
                  <td style={{ ...td, fontWeight: 500 }}>${order.total.toFixed(2)}</td>
                  <td style={td}>
                    <span style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid var(--color-border)', padding: '2px 8px', color: 'var(--color-stone)', fontFamily: 'var(--font-body)' }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ ...td, color: 'var(--color-stone)' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td style={{ ...td, color: 'var(--color-stone)', fontSize: 11 }}>{expandedId === order.id ? '▲' : '▼'}</td>
                </tr>
                {expandedId === order.id && (
                  <tr>
                    <td colSpan={9} style={{ padding: '16px 24px', background: 'var(--color-cream)', borderBottom: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: 11, color: 'var(--color-stone)', marginBottom: 8, fontFamily: 'var(--font-body)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        ZIP {order.shipping_address?.zip || '—'} · {order.shipping_service || 'Standard'} · Est. {order.estimated_delivery || '—'}
                      </div>
                      {order.items?.length > 0 && order.items.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: 16, fontSize: 14, color: 'var(--color-ink)', marginTop: 6, fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                          <span>{item.product_name}</span>
                          <span style={{ color: 'var(--color-stone)' }}>× {item.quantity}</span>
                          <span>${(item.unit_price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} style={{ ...td, textAlign: 'center', padding: 60, color: 'var(--color-stone)' }}>No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const h1: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, color: 'var(--color-stone)' };
const tbl: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 300 };
const th: React.CSSProperties = { textAlign: 'left', padding: '8px 16px', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-stone)', borderBottom: '1px solid var(--color-border)', fontWeight: 500 };
const td: React.CSSProperties = { padding: '14px 16px', color: 'var(--color-ink)', verticalAlign: 'middle' };
const filterBtn: React.CSSProperties = { background: 'transparent', padding: '7px 16px', borderRadius: 'var(--radius-buttons)', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 180ms ease-out' };
