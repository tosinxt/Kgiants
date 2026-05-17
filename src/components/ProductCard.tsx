'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, getStockStatus } from '@/lib/supabase';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, minimal = false }: { product: Product; minimal?: boolean }) {
  const [imgSrc, setImgSrc] = useState(product.image_url);
  const isOOS = getStockStatus(product) === 'out_of_stock';

  return (
    <div className={styles.card} style={{ opacity: isOOS ? 0.45 : 1 }}>
      <Link href={`/products/${product.id}`} style={{ display: 'block' }}>
        <div className={styles.imageWrapper}>
          <div className={styles.serialCode}>{product.sku}</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={product.name}
            className={styles.image}
            loading="lazy"
            onError={() => setImgSrc('https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3001-WhiteDiffuser.jpg?v=1709699706')}
          />
          {isOOS && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(250,250,247,0.75)',
              fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--color-stone)',
              fontWeight: 500,
            }}>
              Sold Out
            </div>
          )}
        </div>

        {!minimal && (
          <div className={styles.content}>
            <h3 className={styles.name}>{product.name}</h3>
            {product.scent && (
              <div className={styles.scent}>{product.scent}</div>
            )}
            {product.inspired_by && (
              <div className={styles.inspiredBy}>Inspired by {product.inspired_by}</div>
            )}
            <div className={styles.price}>
              {product.variants ? `From $${product.variants[0].price.toFixed(2)}` : `$${product.price.toFixed(2)}`}
            </div>
          </div>
        )}
      </Link>
    </div>
  );
}
