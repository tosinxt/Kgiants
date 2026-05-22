"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useMenu } from "@/context/MenuContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { totalItems, isCartOpen, toggleCart } = useCart();
  const { isMenuOpen, toggleMenu, closeMenu } = useMenu();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCartClick = () => {
    if (isMenuOpen) closeMenu();
    toggleCart();
  };

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>

      {/* Left — menu toggle */}
      <div className={styles.navLeft}>
        <button
          className={styles.iconBtn}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          <div className={styles.menuLines}>
            <span className={`${styles.menuLine} ${isMenuOpen ? styles.menuLineOpen1 : ""}`} />
            <span className={`${styles.menuLine} ${isMenuOpen ? styles.menuLineOpen2 : ""}`} />
          </div>
        </button>
      </div>

      {/* Center — wordmark */}
      <div className={styles.navCenter}>
        <Link href="/" className={styles.logo}>KGiants</Link>
      </div>

      {/* Right — cart */}
      <div className={styles.navRight}>
        <button
          onClick={handleCartClick}
          className={styles.iconBtn}
          aria-label={`Open cart, ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {totalItems > 0 && (
            <span className={styles.cartBadge}>{totalItems}</span>
          )}
        </button>
      </div>

    </header>
  );
}
