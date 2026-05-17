import React from 'react';
import { getStockStatus, type Product } from '@/lib/supabase';

export default function StockBadge({ product }: { product: Product }) {
  const status = getStockStatus(product);

  const map = {
    in_stock:    { label: 'In Stock',                           color: 'var(--color-stone)', opacity: 0.5 },
    low_stock:   { label: `Low Stock — ${product.stock} left`, color: 'var(--color-stone)', opacity: 0.9 },
    out_of_stock:{ label: 'Sold Out',                           color: 'var(--color-stone-light)', opacity: 1 },
  }[status];

  return (
    <span style={{
      display: 'inline-block',
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      color: map.color,
      opacity: map.opacity,
      padding: '2px 0',
    }}>
      {map.label}
    </span>
  );
}
