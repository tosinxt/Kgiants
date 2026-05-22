'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import styles from '@/app/page.module.css';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import ScrollVelocity from '@/components/ScrollVelocity';
import { Product } from '@/lib/supabase';

const CATEGORIES = ['All', 'Diffusers', 'Oils'];
const ease = [0.23, 1, 0.32, 1] as const;

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Pure ingredients',
    body: 'Cold-pressed botanicals sourced from certified growers. No synthetic fillers.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: 'Crafted in small batches',
    body: 'Every bottle is made to order — so it reaches you at peak freshness.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Lasting scent',
    body: 'Our diffuser oils are concentrated — a little goes a long way, all day.',
  },
];

const STATS = [
  { value: 'Free shipping', label: 'On orders over $75' },
  { value: '30-day returns', label: 'No questions asked' },
  { value: 'US-wide delivery', label: '3–5 business days' },
];

/* ── Reveal wipe component ──────────────────────────────────────── */
function RevealWipe({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div ref={ref} className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      <motion.div
        style={{
          clipPath: inView ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)',
          transition: 'clip-path 0.9s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function HomeClient({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState('All');

  // Hero parallax
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScrollY } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroBgY = useTransform(heroScrollY, [0, 1], ['0%', '30%']);

  // Stats inView
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.5 });

  // Collection sticky header + stuck detection
  const collectionRef = useRef<HTMLElement>(null);

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p =>
        p.category?.toLowerCase().includes(activeCategory === 'Diffusers' ? 'diffuser' : 'oil')
      );

  return (
    <main className={styles.main}>

      {/* ── HERO — parallax full-bleed ──────────────────────────── */}
      <section ref={heroRef} className={styles.hero} aria-label="Hero">

        {/* Parallax background */}
        <motion.div className={styles.heroBgWrap} style={{ y: heroBgY }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/new-hero.png" alt="" aria-hidden="true" className={styles.heroBg} />
        </motion.div>

        <div className={styles.heroOverlay} aria-hidden="true" />

        <div className={styles.heroContent}>
          <motion.p
            className={styles.heroEyebrow}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease }}
          >
            Premium aromatherapy
          </motion.p>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.35, ease }}
          >
            Scent that<br />
            <em className={styles.heroAccent}>moves you.</em>
          </motion.h1>

          <motion.p
            className={styles.heroSubline}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease }}
          >
            Premium diffusers and botanical oils.<br />
            Made to last — from the first drop.
          </motion.p>

          <motion.div
            className={styles.heroActions}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.65, ease }}
          >
            <Link href="/shop" className={styles.heroCta}>
              Shop the collection
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="#story" className={styles.heroGhost}>Our story</Link>
          </motion.div>
        </div>

        <motion.div
          className={styles.heroTrust}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <span>Free shipping over $75</span>
          <span className={styles.heroTrustDot} />
          <span>30-day returns</span>
          <span className={styles.heroTrustDot} />
          <span>US delivery</span>
        </motion.div>
      </section>

      {/* ── SCROLL VELOCITY STRIP ────────────────────────────── */}
      <div className={styles.velocityStrip} aria-hidden="true">
        <ScrollVelocity
          texts={['Premium aromatherapy', 'Pure botanicals']}
          velocity={60}
          className={styles.velocityText}
          damping={50}
          stiffness={300}
          numCopies={8}
        />
      </div>

      {/* ── STATS BAR — count-up ─────────────────────────────── */}
      <div ref={statsRef} className={styles.statsBar} aria-label="Key benefits">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.value}
            className={styles.statItem}
            initial={{ opacity: 0, y: 8 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: i * 0.05, ease }}
          >
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </motion.div>
        ))}
      </div>

      {/* ── COLLECTION ───────────────────────────────────────── */}
      <section ref={collectionRef} className={styles.collectionSection} id="collection">
        <div className={styles.sectionHead}>
          <div className={styles.sectionHeadLeft}>
            <span className={styles.sectionAccentDot} />
            <motion.h2
              className={styles.sectionTitle}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease }}
            >
              The collection
            </motion.h2>
          </div>
          <Link href="/shop" className={styles.sectionLink}>
            View all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className={styles.chipRow} role="group" aria-label="Filter by category">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`${styles.chip} ${activeCategory === cat ? styles.chipActive : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Staggered product grid */}
        <div className={styles.productGrid}>
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              className={styles.productCard}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.05, ease }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BRAND STORY — reveal wipe ────────────────────────── */}
      <section id="story" className={styles.storySection}>
        <div className={styles.storyGrid}>
          <motion.div
            className={styles.storyLeft}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease }}
          >
            <p className={styles.storyEyebrow}>The philosophy</p>
            <h2 className={styles.storyTitle}>
              Your environment<br />
              shapes your mind
            </h2>
            <p className={styles.storyBody}>
              KGiants was built on a simple idea — the right scent, diffused into the air you
              breathe every day, changes how you feel. Not in a vague way. In a real, immediate,
              noticeable way.
            </p>
            <p className={styles.storyBody}>
              Every product we make starts there: pure ingredients, intentional blends,
              and an experience worth coming back to.
            </p>
            <Link href="/about" className={styles.storyLink}>
              Read our story
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {/* Reveal wipe on story image */}
          <RevealWipe className={styles.storyRight}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hero.png" alt="KGiants signature diffuser" className={styles.storyImage} />
            <div className={styles.storyImageMeta}>
              <span>Signature collection</span>
              <span>Est. 2024</span>
            </div>
          </RevealWipe>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresHeader}>
          <p className={styles.featuresEyebrow}>Why KGiants</p>
          <h2 className={styles.featuresTitle}>Made differently</h2>
        </div>

        <div className={styles.featuresGrid}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: i * 0.12, ease }}
            >
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureBody}>{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <motion.div
          className={styles.ctaInner}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, ease }}
        >
          <p className={styles.ctaEyebrow}>Ready to start</p>
          <h2 className={styles.ctaTitle}>
            Transform your space.<br />One scent at a time.
          </h2>
          <p className={styles.ctaBody}>
            Free shipping on orders over $75. Easy 30-day returns.
          </p>
          <Link href="/shop" className={styles.ctaBtn}>
            Shop now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
