'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/supabase';
import styles from './product.module.css';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <button 
      onClick={() => addItem(product)} 
      className={styles.addToCartBtn}
    >
      <ShoppingBag size={20} />
      Add to Cart — ${(product.price).toFixed(2)}
    </button>
  );
}
