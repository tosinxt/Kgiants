'use client';

import React, { useState } from 'react';
import { Product, getStockStatus } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function AdminProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [saving, setSaving] = useState<string | null>(null);

  const patch = async (id: string, body: Record<string, unknown>) => {
    setSaving(id);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...body }),
      });
      if (!res.ok) throw new Error();
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...body } : p));
      toast.success('Saved');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      <h1 style={h1}>Products</h1>
      <p style={{ fontSize: 12, color: 'var(--color-stone)', marginBottom: 32, letterSpacing: '0.04em', fontFamily: 'var(--font-body)', fontWeight: 300 }}>
        {products.length} products — changes reflect on the storefront in real time.
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table style={tbl}>
          <thead>
            <tr>
              {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Visible', ''].map(col => (
                <th key={col} style={th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const status = getStockStatus(product);
              const isDisabled = saving === product.id;
              return (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--color-border)', opacity: isDisabled ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                  <td style={td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.image_url} alt={product.name} style={{ width: 40, height: 40, objectFit: 'contain', padding: 3, border: '1px solid var(--color-border)', background: 'var(--color-cream)' }} />
                      <span style={{ maxWidth: 180, fontWeight: 400 }}>{product.name}</span>
                    </div>
                  </td>
                  <td style={{ ...td, color: 'var(--color-stone)', fontSize: 11, letterSpacing: '0.06em', fontWeight: 500 }}>{product.sku}</td>
                  <td style={{ ...td, color: 'var(--color-stone)', fontWeight: 300 }}>{product.category}</td>
                  <td style={td}>${product.price.toFixed(2)}</td>
                  <td style={td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button style={qtyBtn} onClick={() => patch(product.id, { stock: Math.max(0, product.stock - 1) })} disabled={isDisabled}>−</button>
                      <span style={{ minWidth: 28, textAlign: 'center', fontFamily: 'var(--font-body)', fontWeight: 400 }}>{product.stock}</span>
                      <button style={qtyBtn} onClick={() => patch(product.id, { stock: product.stock + 1 })} disabled={isDisabled}>+</button>
                    </div>
                  </td>
                  <td style={td}>
                    <span style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: status === 'out_of_stock' ? 'var(--color-stone-light)' : 'var(--color-ink)', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                      {status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={td}>
                    <button
                      style={{ ...toggleBtn, border: `1px solid ${product.visible ? 'var(--color-ink)' : 'var(--color-border)'}`, color: product.visible ? 'var(--color-ink)' : 'var(--color-stone)' }}
                      onClick={() => patch(product.id, { visible: !product.visible })}
                      disabled={isDisabled}
                    >
                      {product.visible ? 'Visible' : 'Hidden'}
                    </button>
                  </td>
                  <td style={td}>
                    <a href={`/products/${product.id}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: 'var(--color-stone)', textDecoration: 'underline', fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                      View →
                    </a>
                  </td>
                </tr>
              );
            })}
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
const qtyBtn: React.CSSProperties = { background: 'var(--color-cream)', border: '1px solid var(--color-border)', color: 'var(--color-ink)', width: 28, height: 28, borderRadius: 0, cursor: 'pointer', fontSize: 16, lineHeight: 1, fontFamily: 'var(--font-body)' };
const toggleBtn: React.CSSProperties = { padding: '5px 12px', borderRadius: 0, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500, background: 'transparent', transition: 'all 180ms ease-out' };
