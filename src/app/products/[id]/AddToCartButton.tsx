'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { Product, ProductVariant, getStockStatus } from '@/lib/supabase';
import StockBadge from '@/components/StockBadge';
import ClickSpark from '@/components/ClickSpark';
import styles from './product.module.css';

const ease = [0.23, 1, 0.32, 1] as const;

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const status = getStockStatus(product);
  const isOOS = status === 'out_of_stock';
  const hasVariants = !!(product.variants && product.variants.length > 0);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    hasVariants ? product.variants![0] : null
  );
  const [added, setAdded] = useState(false);

  const displayPrice = (selectedVariant?.price ?? product.price).toFixed(2);

  const handleAdd = () => {
    if (isOOS) return;
    const itemToAdd: Product = selectedVariant
      ? { ...product, price: selectedVariant.price, name: `${product.name} (${selectedVariant.title})` }
      : product;
    addItem(itemToAdd);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className={styles.cartWrap}>
      <StockBadge product={product} />

      {hasVariants && (
        <div>
          <p className={styles.variantLabel}>Size</p>
          <div className={styles.variantGroup}>
            {product.variants!.map(v => (
              <button
                key={v.title}
                onClick={() => setSelectedVariant(v)}
                className={`${styles.variantChip} ${selectedVariant?.title === v.title ? styles.variantChipActive : ''}`}
              >
                {v.title}
                <span className={styles.variantPrice}>${v.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <ClickSpark sparkColor="#9FE870" sparkCount={10} sparkRadius={60} duration={500}>
        <motion.button
          onClick={handleAdd}
          disabled={isOOS}
          className={`${styles.addBtn} ${added ? styles.addBtnAdded : ''} ${isOOS ? styles.addBtnOOS : ''}`}
          whileHover={isOOS ? {} : { scale: 1.02 }}
          whileTap={isOOS ? {} : { scale: 0.97 }}
          transition={{ duration: 0.2, ease }}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="added"
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Added to cart
              </motion.span>
            ) : (
              <motion.span
                key="add"
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {isOOS ? 'Out of stock' : `Add to cart — $${displayPrice}`}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </ClickSpark>
    </div>
  );
}
