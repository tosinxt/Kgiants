'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from '@/app/page.module.css';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { BotanicalSprig } from '@/components/BotanicalSvg';
import { Product } from '@/lib/supabase';

const CATEGORIES = ['All', 'Diffusers', 'Oils'];

// Strong ease-out per Emil: starts fast, feels responsive
const ease = [0.23, 1, 0.32, 1] as const;

const MARQUEE_ITEMS = [
  'Pure Botanical',
  'Handcrafted',
  'Aromatherapy',
  'Elevated Living',
  'Natural Essence',
  'Artisanal Scent',
  'Mindful Ritual',
  'Premium Oils',
];

const PILLARS = [
  {
    number: '01',
    title: 'Pure Ingredients',
    body: 'Sourced from the world\'s finest botanical gardens. Every oil cold-pressed, every blend intentional.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Crafted with Care',
    body: 'Small-batch production ensures every bottle meets our exacting standards before it reaches you.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Mindful Ritual',
    body: 'More than fragrance — a daily ritual that transforms your space into a sanctuary of calm.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
  },
];

export default function HomeClient({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const heroProduct = products.find(p => p.featured) || products[0];

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p =>
        p.category?.toLowerCase().includes(activeCategory === 'Diffusers' ? 'diffuser' : 'oil')
      );

  return (
    <main className={styles.main}>

      {/* ── SPLIT HERO ────────────────────────────────────────── */}
      <section
        className={styles.hero}
        aria-label="Hero"
      >
        {/* Left: product image panel */}
        <motion.div
          className={styles.heroImagePanel}
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.0, ease }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero.png"
            alt="KGiants signature collection"
            className={styles.heroImage}
          />
          <div className={styles.heroImageOverlay} />

          {/* Floating product badge */}
          <motion.div
            className={styles.heroBadge}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.9, ease }}
          >
            <span className={styles.heroBadgeLabel}>Featured</span>
            <span className={styles.heroBadgeName}>{heroProduct?.name}</span>
            {heroProduct?.price && (
              <span className={styles.heroBadgePrice}>
                ${heroProduct.variants?.[0]?.price.toFixed(2) ?? heroProduct.price.toFixed(2)}
              </span>
            )}
          </motion.div>
        </motion.div>

        {/* Right: text panel */}
        <div className={styles.heroTextPanel}>
          <motion.div
            className={styles.heroEyebrow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            <span className={styles.heroEyebrowLine} />
            Luxury Aromatherapy
          </motion.div>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.35, ease }}
          >
            Elevate<br />
            <em>every space</em>
          </motion.h1>

          <motion.p
            className={styles.heroSubline}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.55, ease }}
          >
            Premium diffusers &amp; botanical oils crafted for modern living.
            Each scent — a ritual.
          </motion.p>

          <motion.div
            className={styles.heroCtaRow}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease }}
          >
            <Link href="/shop" className={styles.heroCta}>
              Shop the collection
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="#story" className={styles.heroCtaGhost}>
              Our story
            </Link>
          </motion.div>

          <motion.div
            className={styles.heroMeta}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <span>Free shipping over $75</span>
            <span className={styles.heroMetaDot} />
            <span>30-day returns</span>
            <span className={styles.heroMetaDot} />
            <span>US-wide delivery</span>
          </motion.div>

          {/* Decorative index number */}
          <div className={styles.heroIndex} aria-hidden="true">01</div>
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────────────── */}
      <div className={styles.marqueeSection} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className={styles.marqueeItem}>
              {item}
              <span className={styles.marqueeDot} />
            </span>
          ))}
        </div>
      </div>

      {/* ── BRAND STORY ──────────────────────────────────────── */}
      <section id="story" className={styles.storySection}>
        <div className={styles.storyGrid}>
          <motion.div
            className={styles.storyLeft}
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8, ease }}
          >
            <div className={styles.storyEyebrow}>The Philosophy</div>
            <h2 className={styles.storyTitle}>
              Scent is the{' '}
              <em>shortest path</em>{' '}
              to presence
            </h2>
            <p className={styles.storyBody}>
              We believe your environment shapes your state of mind. KGiants was born
              from a simple conviction: that the right fragrance, diffused into the air
              you breathe every day, can elevate your mood, anchor your focus, and
              transform a house into a home.
            </p>
            <p className={styles.storyBody}>
              Every product in our collection is formulated with that intention —
              pure, purposeful, and made to last.
            </p>
            <Link href="/about" className={styles.storyLink}>
              Read our story
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          <motion.div
            className={styles.storyRight}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
          >
            <div className={styles.storyImageFrame}>
              <div className={styles.storyImageAccent} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={products[0]?.image_url || 'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3001-WhiteDiffuser.jpg?v=1709699706'}
                alt="KGiants signature diffuser"
                className={styles.storyImage}
              />
              <div className={styles.storyImageCaption}>
                <span>Signature Collection</span>
                <span>Est. 2024</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PILLARS ──────────────────────────────────────────── */}
      <section className={styles.pillarsSection}>
        <div className={styles.pillarsHeader}>
          <motion.div
            className={styles.pillarsRule}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          />
          <motion.span
            className={styles.pillarsEyebrow}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Why KGiants
          </motion.span>
          <motion.div
            className={styles.pillarsRule}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          />
        </div>

        <div className={styles.pillarsGrid}>
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.number}
              className={styles.pillar}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
            >
              <div className={styles.pillarNumber}>{pillar.number}</div>
              <div className={styles.pillarIcon}>{pillar.icon}</div>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarBody}>{pillar.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── COLLECTION ───────────────────────────────────────── */}
      <section className={styles.collectionSection}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionHeadLeft}>
            <div className={styles.sectionAccentLine} />
            <motion.h2
              className={styles.sectionTitle}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease }}
            >
              The Collection
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link href="/shop" className={styles.sectionLink}>
              View all
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Filter row */}
        <div className={styles.filterRow} role="group" aria-label="Filter products by category">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className={styles.productGrid}>
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              className={styles.productCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.55, delay: Math.min(i * 0.06, 0.28), ease }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── RITUAL CTA ───────────────────────────────────────── */}
      <section className={styles.ritualSection}>
        <div className={styles.ritualInner}>
          <motion.div
            className={styles.ritualEyebrow}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease }}
          >
            Begin your ritual
          </motion.div>
          <motion.h2
            className={styles.ritualTitle}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
          >
            Transform your space.{' '}
            <br />
            <em>Transform your day.</em>
          </motion.h2>
          <motion.p
            className={styles.ritualBody}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            Free shipping on orders over $75 · Easy 30-day returns
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
          >
            <Link href="/shop" className={styles.ritualCta}>
              Shop now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Decorative botanical divider */}
        <div className={styles.ritualSprig}>
          <BotanicalSprig />
        </div>
      </section>

      <Footer />
    </main>
  );
}
