'use client';

import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product, ProductVariant, getStockStatus } from '@/lib/supabase';
import StockBadge from '@/components/StockBadge';
import styles from './product.module.css';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const status = getStockStatus(product);
  const isOOS = status === 'out_of_stock';
  const hasVariants = product.variants && product.variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    hasVariants ? product.variants![0] : null
  );

  const handleAdd = () => {
    if (isOOS) return;
    const itemToAdd: Product = selectedVariant
      ? {
          ...product,
          price: selectedVariant.price,
          name: `${product.name} (${selectedVariant.title})`,
        }
      : product;
    addItem(itemToAdd);
  };

  return (
    <div className={styles.buttonGroup} style={{ flexDirection: 'column', gap: 'var(--spacing-16)' }}>
      <StockBadge product={product} />

      {hasVariants && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {product.variants!.map(variant => (
            <button
              key={variant.title}
              onClick={() => setSelectedVariant(variant)}
              style={{
                padding: '8px 16px',
                border: `1px solid ${selectedVariant?.title === variant.title ? 'var(--color-ink)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-buttons)',
                background: selectedVariant?.title === variant.title ? 'var(--color-ink)' : 'transparent',
                color: selectedVariant?.title === variant.title ? 'var(--color-cream)' : 'var(--color-stone)',
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                fontWeight: 400,
                cursor: 'pointer',
                transition: 'all 180ms ease-out',
                letterSpacing: '0.04em',
              }}
            >
              {variant.title}
              <span style={{ marginLeft: 8, opacity: 0.6, fontSize: 11 }}>
                ${variant.price.toFixed(2)}
              </span>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={handleAdd}
        disabled={isOOS}
        className="btn-primary"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          opacity: isOOS ? 0.35 : 1,
          cursor: isOOS ? 'not-allowed' : 'pointer',
          width: '100%',
        }}
      >
        <ShoppingBag size={14} />
        {isOOS
          ? 'Out of Stock'
          : `Add to Cart — $${(selectedVariant?.price ?? product.price).toFixed(2)}`
        }
      </button>
    </div>
  );
}
