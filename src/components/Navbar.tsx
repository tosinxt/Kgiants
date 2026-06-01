"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Diffusers", href: "/shop?category=Waterless+Diffuser" },
  { label: "Fragrance Oils", href: "/shop?category=Fragrance+Oil" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change / escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>

        {/* Left — wordmark */}
        <div className={styles.navLeft}>
          <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>KGiants</Link>
        </div>

        {/* Center — desktop nav links */}
        <nav className={styles.navCenter} aria-label="Main navigation">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right — cart + hamburger */}
        <div className={styles.navRight}>
          <button
            onClick={toggleCart}
            className={styles.iconBtn}
            aria-label={`Open cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
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

          <button
            className={`${styles.iconBtn} ${styles.hamburger}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`} />
          </button>
        </div>

      </header>

      {/* Mobile drawer */}
      <div
        className={`${styles.drawerBackdrop} ${menuOpen ? styles.drawerBackdropVisible : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <nav
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`}
        aria-label="Mobile navigation"
      >
        <div className={styles.drawerHeader}>
          <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>KGiants</Link>
          <button className={styles.iconBtn} onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.drawerLinks}>
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.drawerLink}
              style={{ transitionDelay: menuOpen ? `${i * 60}ms` : "0ms" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        <div className={styles.drawerFooter}>
          <p>hello@kgiants.com</p>
          <p>Dallas, TX</p>
        </div>
      </nav>
    </>
  );
}
