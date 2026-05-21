"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useMenu } from "@/context/MenuContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { totalItems, isCartOpen, toggleCart } = useCart();
  const { isMenuOpen, toggleMenu, closeMenu } = useMenu();

  const handleMenuClick = () => {
    if (isCartOpen) toggleCart(); // close cart first
    toggleMenu();
  };

  const handleCartClick = () => {
    if (isMenuOpen) closeMenu(); // close menu first
    toggleCart();
  };
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      {/* Left — menu trigger */}
      <div className={styles.navLeft}>
        <button
          className={styles.menuBtn}
          onClick={handleMenuClick}
          aria-label="Open menu"
        >
          <div className={styles.menuLines}>
            <div className={styles.menuLine} style={{ width: "100%" }} />
            <div className={styles.menuLine} />
          </div>
          <span className={styles.menuBtnLabel}>Menu</span>
        </button>
      </div>

      {/* Center — wordmark */}
      <div className={styles.navCenter}>
        <Link href="/" className={styles.logo}>
          KGiants
        </Link>
      </div>

      {/* Right — cart */}
      <div className={styles.navRight}>
        <button
          onClick={handleCartClick}
          className={styles.cartBtn}
          aria-label={`Open cart — ${totalItems} items`}
        >
          <span className={styles.cartBtnLabel}>Bag</span>
          <span
            className={`${styles.cartCount} ${totalItems > 0 ? styles.hasItems : styles.empty}`}
          >
            {totalItems}
          </span>
        </button>
      </div>
    </header>
  );
}
