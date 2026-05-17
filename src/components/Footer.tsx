import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.brandCol}>
          <div className={styles.brandName}>KGiants</div>
          <p className={styles.brandTagline}>
            Premium Aromar+ waterless diffusers and fragrance oils. Engineered to transform your space with continuous, fine-mist aromatherapy.
          </p>
          <div className={styles.subscribeRow}>
            <input type="email" placeholder="Your email" className={styles.subscribeInput} />
            <button className={styles.subscribeBtn}>Subscribe</button>
          </div>
        </div>

        <div className={styles.navCol}>
          <div className={styles.colHeading}>Shop</div>
          <Link href="/shop" className={styles.navLink}>All Products</Link>
          <Link href="/shop?category=Waterless+Diffuser" className={styles.navLink}>Diffusers</Link>
          <Link href="/shop?category=Fragrance+Oil" className={styles.navLink}>Fragrance Oils</Link>
        </div>

        <div className={styles.navCol}>
          <div className={styles.colHeading}>Company</div>
          <Link href="/" className={styles.navLink}>About</Link>
          <Link href="/" className={styles.navLink}>Contact</Link>
          <Link href="/" className={styles.navLink}>Stockists</Link>
        </div>

        <div className={styles.navCol}>
          <div className={styles.colHeading}>Support</div>
          <Link href="/" className={styles.navLink}>FAQ</Link>
          <Link href="/" className={styles.navLink}>Shipping</Link>
          <Link href="/" className={styles.navLink}>Returns</Link>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span className={styles.copyright}>© {new Date().getFullYear()} KGiants. All rights reserved.</span>
        <div className={styles.payments}>
          <span className={styles.paymentLabel}>Accepted</span>
          <span className={styles.paymentBadge}>Visa</span>
          <span className={styles.paymentBadge}>MC</span>
          <span className={styles.paymentBadge}>Discover</span>
          <span className={styles.paymentBadge}>PayPal</span>
        </div>
      </div>
    </footer>
  );
}
