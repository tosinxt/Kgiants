'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import styles from './shop.module.css';

type SortOption = 'featured' | 'price_asc' | 'price_desc';

const SORT_LABELS: Record<SortOption, string> = {
  featured:   'Featured',
  price_asc:  'Price: Low–High',
  price_desc: 'Price: High–Low',
};

const ease = [0.23, 1, 0.32, 1] as const;

export default function ShopClient({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }
    if (inStockOnly) {
      list = list.filter(p => p.stock > 0);
    }
    switch (sortBy) {
      case 'price_asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price_desc': list.sort((a, b) => b.price - a.price); break;
      case 'featured':   list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
    }
    return list;
  }, [products, activeCategory, sortBy, inStockOnly]);

  const allCategories = ['all', ...categories];

  return (
    <main className={styles.main}>

      {/* ── Page header ─────────────────────────────────────── */}
      <div className={styles.header}>
        <motion.div
          className={styles.headerLeft}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <p className={styles.eyebrow}>All products</p>
          <h1 className={styles.title}>The collection</h1>
        </motion.div>
        <motion.span
          className={styles.count}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filtered.length} item{filtered.length !== 1 ? 's' : ''}
        </motion.span>
      </div>

      {/* ── Controls bar ────────────────────────────────────── */}
      <motion.div
        className={styles.controls}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease }}
      >
        {/* Category chips */}
        <div className={styles.chipRow}>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`${styles.chip} ${activeCategory === cat ? styles.chipActive : ''}`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className={styles.rightControls}>
          {/* In stock toggle */}
          <button
            className={`${styles.chip} ${inStockOnly ? styles.chipActive : ''}`}
            onClick={() => setInStockOnly(p => !p)}
            aria-pressed={inStockOnly}
          >
            In stock
          </button>

          {/* Custom sort dropdown */}
          <div className={styles.sortWrap} ref={sortRef}>
            <button
              className={`${styles.chip} ${styles.sortBtn}`}
              onClick={() => setSortOpen(o => !o)}
              aria-expanded={sortOpen}
            >
              {SORT_LABELS[sortBy]}
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                style={{ transform: sortOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  className={styles.sortDropdown}
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease }}
                >
                  {(Object.keys(SORT_LABELS) as SortOption[]).map(opt => (
                    <button
                      key={opt}
                      className={`${styles.sortOption} ${sortBy === opt ? styles.sortOptionActive : ''}`}
                      onClick={() => { setSortBy(opt); setSortOpen(false); }}
                    >
                      {SORT_LABELS[opt]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ── Product grid ────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <motion.div
          className={styles.empty}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <p>No products match your filters.</p>
          <button
            className={styles.chip}
            onClick={() => { setActiveCategory('all'); setInStockOnly(false); }}
          >
            Clear filters
          </button>
        </motion.div>
      ) : (
        <motion.div
          className={styles.grid}
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show:   { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.45, ease }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <Footer />
    </main>
  );
}
