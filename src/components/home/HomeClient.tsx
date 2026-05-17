'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from '@/app/page.module.css';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { Product } from '@/lib/supabase';

const CATEGORIES = [
  { label: 'All', href: '/' },
  { label: 'Diffusers', href: '/?category=Waterless+Diffuser' },
  { label: 'Oils', href: '/?category=Fragrance+Oil' },
];

export default function HomeClient({ products }: { products: Product[] }) {
  const heroProduct = products.find(p => p.featured) || products[0];
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category?.toLowerCase().includes(activeCategory === 'Diffusers' ? 'diffuser' : 'oil'));

  return (
    <main className={styles.main}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroEyebrow}>Luxury Aromatherapy</div>
          <h1 className={styles.heroTitle}>
            Elevate<br />
            <span className={styles.heroTitleItalic}>every space</span>
          </h1>
          <p className={styles.heroDesc}>
            Premium waterless diffusers and curated fragrance oils. Continuous fine-mist aromatherapy, engineered for the modern home.
          </p>
          <Link href="/shop" className={styles.heroCta}>
            Shop the collection
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className={styles.heroRight}>
          {heroProduct && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroProduct.image_url}
                alt={heroProduct.name}
                className={styles.heroImage}
              />
              <div className={styles.heroProductLabel}>{heroProduct.name}</div>
            </>
          )}
        </div>
      </section>

      {/* SECTION HEADER */}
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>The Collection</h2>
        <Link href="/shop" className={styles.sectionLink}>View all</Link>
      </div>

      {/* FILTER ROW */}
      <div className={styles.filterRow}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.label}
            onClick={() => setActiveCategory(cat.label)}
            style={{
              background: activeCategory === cat.label ? 'var(--color-ink)' : 'transparent',
              color: activeCategory === cat.label ? 'var(--color-cream)' : 'var(--color-stone)',
              border: `1px solid ${activeCategory === cat.label ? 'var(--color-ink)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-buttons)',
              padding: '10px 24px',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              cursor: 'pointer',
              transition: 'all 180ms ease-out',
              whiteSpace: 'nowrap' as const,
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* PRODUCTS GRID */}
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
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      <Footer />
    </main>
  );
}
