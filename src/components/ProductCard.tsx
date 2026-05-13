'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking button inside card
    e.stopPropagation();
    addItem(product);
  };

  return (
    <div className={styles.card}>
      <Link href={`/products/${product.id}`} style={{ display: 'block', flex: 1 }}>
        <div className={styles.imageWrapper}>
          <div className={styles.categoryBadge}>
            <span className="badge-bestseller">{product.category}</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={product.image_url} 
            alt={product.name} 
            className={styles.image} 
            loading="lazy"
          />
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.name}>{product.name}</h3>
          <div className={styles.price}>${product.price.toFixed(2)}</div>
        </div>
      </Link>
      
      <div className={styles.footer}>
        <button onClick={handleAddToCart} className={styles.addButton}>
          <Plus size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
