"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Footer.module.css';

const colVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        {[
          <div key="brand" className={styles.brandCol}>
            <div className={styles.brandName}>KGiants</div>
            <p className={styles.brandTagline}>
              Premium Aromar+ waterless diffusers and fragrance oils. Engineered to transform your space with continuous, fine-mist aromatherapy.
            </p>
            <div className={styles.subscribeRow}>
              <input type="email" placeholder="Your email" className={styles.subscribeInput} />
              <button className={styles.subscribeBtn}>Subscribe</button>
            </div>
          </div>,

          <div key="shop" className={styles.navCol}>
            <div className={styles.colHeading}>Shop</div>
            <Link href="/shop" className={styles.navLink}>All Products</Link>
            <Link href="/shop?category=Waterless+Diffuser" className={styles.navLink}>Diffusers</Link>
            <Link href="/shop?category=Fragrance+Oil" className={styles.navLink}>Fragrance Oils</Link>
          </div>,

          <div key="company" className={styles.navCol}>
            <div className={styles.colHeading}>Company</div>
            <Link href="/" className={styles.navLink}>About</Link>
            <Link href="/" className={styles.navLink}>Contact</Link>
            <Link href="/" className={styles.navLink}>Stockists</Link>
          </div>,

          <div key="support" className={styles.navCol}>
            <div className={styles.colHeading}>Support</div>
            <Link href="/" className={styles.navLink}>FAQ</Link>
            <Link href="/" className={styles.navLink}>Shipping</Link>
            <Link href="/" className={styles.navLink}>Returns</Link>
          </div>,
        ].map((col, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={colVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {col}
          </motion.div>
        ))}
      </div>

      <motion.div
        className={styles.footerBottom}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <span className={styles.copyright}>© {new Date().getFullYear()} KGiants. All rights reserved.</span>
        <div className={styles.payments}>
          <span className={styles.paymentLabel}>Accepted</span>
          <span className={styles.paymentBadge}>Visa</span>
          <span className={styles.paymentBadge}>MC</span>
          <span className={styles.paymentBadge}>Discover</span>
          <span className={styles.paymentBadge}>PayPal</span>
        </div>
      </motion.div>
    </footer>
  );
}
