'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Product } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import styles from './shop.module.css';

type SortOption = 'featured' | 'price_asc' | 'price_desc';

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

  // Sync category from URL query (?category=...)
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

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

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Shop</h1>
        <span className={styles.subtitle}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className={styles.controls}>
        {/* Category tabs */}
        <div className={styles.filterGroup}>
          <button
            className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.active : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className={styles.rightControls}>
          <button
            className={`${styles.filterBtn} ${inStockOnly ? styles.active : ''}`}
            onClick={() => setInStockOnly(p => !p)}
          >
            In Stock Only
          </button>

          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
          >
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low–High</option>
            <option value="price_desc">Price: High–Low</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>No products match your filters.</p>
          <button className={styles.filterBtn} onClick={() => { setActiveCategory('all'); setInStockOnly(false); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <motion.div
          className={styles.grid}
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.04 } },
          }}
        >
          {filtered.map(product => (
            <motion.div
              key={product.id}
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
