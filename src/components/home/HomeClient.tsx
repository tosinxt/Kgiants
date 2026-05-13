'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import styles from '@/app/page.module.css';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/supabase';
import { ArrowUpRight, ChevronDown } from 'lucide-react';

export default function HomeClient({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(8); // Initialize fallback to exact 8s duration

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Snappy but smooth scroll tracking for perfect frame matching
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 60,
    stiffness: 120,
    restDelta: 0.0005
  });

  // Track actual duration once video metadata loads to override fallback if necessary
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (video.duration > 0) {
        setDuration(video.duration);
      }
    };

    if (video.readyState >= 1 && video.duration > 0) {
      setDuration(video.duration);
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }, []);

  // Map scroll progress to complete video scrubbing cycle
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (v) => {
      if (videoRef.current && duration > 0) {
        // Remap the [0% -> 95%] of scroll progress to the entire [0% -> 100%] of the video timeline.
        // This acts as a buffer to ensure the absolute final frame (fully exploded flowers) is hit
        // and held for the final 5% of vertical travel.
        const remapScalar = Math.min(Math.max(v / 0.95, 0), 1);
        
        // Scale scalar to duration, clamping slightly below full duration (-0.05s) to prevent
        // the browser rendering engine from dropping into an ended/black frame cycle.
        const targetTime = remapScalar * (duration - 0.05);
        
        if (!isNaN(targetTime) && isFinite(targetTime)) {
          videoRef.current.currentTime = targetTime;
        }
      }
    });
    return () => unsubscribe();
  }, [smoothProgress, duration]);

  // Animation values for text overlays fading on scroll-down
  const contentOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 0.18], [1, 0.96]);
  const contentY = useTransform(scrollYProgress, [0, 0.18], [0, -40]);

  return (
    <main className={styles.main} style={{ paddingTop: 0 }}>
      {/* CINEMATIC SCROLL HERO: scrub 'vid_mp_.mp4' */}
      <section ref={containerRef} className={styles.cinematicHero}>
        <div className={styles.stickyContainer}>
          <video 
            ref={videoRef}
            src="/video/vid_mp_.mp4"
            playsInline
            muted
            preload="auto"
            className={styles.cinematicVideo}
          />
          
          {/* Overlay Scrim for text contrast and smooth page integration */}
          <div className={styles.scrim} />

          <motion.div 
            className={styles.overlayContent}
            style={{ 
              opacity: contentOpacity, 
              scale: contentScale,
              y: contentY
            }}
          >
            <h1 className={styles.cinematicTitle}>
              KGiants
            </h1>
            <p className={styles.cinematicTagline}>
              Experience botanical engineering unfolding. Scroll to reveal.
            </p>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Link href="#collection" className="btn-solid" style={{ background: '#ffffff', border: '1px solid #ffffff', color: '#000000' }}>
                Explore Inventory
              </Link>
              <Link href="/categories" className="btn-primary" style={{ border: '1px solid rgba(255,255,255,0.6)', color: '#ffffff' }}>
                Collections <ArrowUpRight size={16} />
              </Link>
            </div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{ position: 'absolute', bottom: '48px', color: 'rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scroll</span>
              <ChevronDown size={20} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED PHILOSOPHY CARD */}
      <section className="section-spacing" style={{ background: 'var(--color-canvas-white)', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <motion.div 
            className={styles.lightCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.narrativeGrid}>
              <div className={styles.narrativeContent}>
                <span className="badge-bestseller" style={{ background: 'var(--color-midnight-ink)', color: 'var(--color-canvas-white)' }}>
                  Brand Evolution
                </span>
                <h2 className={styles.narrativeTitle}>Cinematic Clarity, High-Fidelity.</h2>
                <p className={styles.narrativeDesc}>
                  KGiants synthesizes visual storytelling with robust, digital ledger systems. Each collection utilizes meticulous structural composition to showcase botanical precision.
                </p>
                <Link href="/categories" className="btn-primary" style={{ marginTop: '1rem' }}>
                  View Collections
                </Link>
              </div>
              <div className={styles.narrativeVisual}>
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'var(--color-canvas-white)',
                  padding: '2.5rem'
                }}>
                  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <motion.rect 
                      x="20" y="20" width="160" height="160" rx="30" 
                      stroke="var(--color-midnight-ink)" strokeWidth="1.5" strokeDasharray="6 6" 
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      style={{ originX: "100px", originY: "100px" }}
                      transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                    />
                    <motion.circle 
                      cx="100" cy="100" r="55" 
                      stroke="#19D89F" strokeWidth="8"
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                    />
                    <circle cx="100" cy="100" r="55" stroke="var(--color-midnight-ink)" strokeWidth="2" />
                    <motion.path 
                      d="M70 100H130" 
                      stroke="var(--color-midnight-ink)" strokeWidth="2" strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    />
                    <motion.path 
                      d="M100 70V130" 
                      stroke="var(--color-midnight-ink)" strokeWidth="2" strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* THE CURATIONS GRID */}
      <section id="collection" className={styles.collectionSection} style={{ scrollMarginTop: '100px', position: 'relative', zIndex: 10, background: 'var(--color-canvas-white)' }}>
        <div className="container">
          <motion.div 
            className={styles.collectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge-bestseller" style={{ background: '#19D89F' }}>Curated Selections</span>
            <h2>High-Fidelity Inventory</h2>
          </motion.div>

          <motion.div 
            className={styles.grid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.06
                }
              }
            }}
          >
            {products.map((product) => (
              <motion.div 
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
