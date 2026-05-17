'use client';

import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useMenu } from '@/context/MenuContext';
import styles from './MenuSidebar.module.css';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop All' },
  { href: '/shop?category=Waterless+Diffuser', label: 'Diffusers' },
  { href: '/shop?category=Fragrance+Oil', label: 'Fragrance Oils' },
  { href: '/contact', label: 'Contact' },
];

export default function MenuSidebar() {
  const { isMenuOpen, closeMenu } = useMenu();

  return (
    <div
      className={`${styles.overlay} ${isMenuOpen ? styles.isOpen : ''}`}
      aria-modal="true"
      role="dialog"
      aria-label="Navigation menu"
    >
      {/* Left half — click to close */}
      <div className={styles.left} onClick={closeMenu} aria-hidden="true" />

      {/* Right half — menu panel */}
      <div className={styles.panel}>
        <div className={styles.panelTop}>
          <span className={styles.panelBrand}>KGiants</span>
          <button
            onClick={closeMenu}
            className={styles.closeBtn}
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <nav className={styles.navLinks}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={styles.link}
              onClick={closeMenu}
            >
              {label}
              <span className={styles.linkArrow}>→</span>
            </Link>
          ))}
        </nav>

        <div className={styles.footer}>
          <div className={styles.footerCol}>
            <Link href="#" className={styles.footerLink}>Instagram</Link>
            <Link href="#" className={styles.footerLink}>Pinterest</Link>
          </div>
          <div className={`${styles.footerCol} ${styles.right}`}>
            <Link href="#" className={styles.footerLink}>Terms</Link>
            <Link href="#" className={styles.footerLink}>Privacy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
