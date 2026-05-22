"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Product, getStockStatus } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import ClickSpark from "./ClickSpark";
import Magnet from "./Magnet";
import styles from "./ProductCard.module.css";

const FALLBACK =
  "https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3001-WhiteDiffuser.jpg?v=1709699706";

export default function ProductCard({
  product,
  minimal = false,
}: {
  product: Product;
  minimal?: boolean;
}) {
  const images = product.images?.length ? product.images : [product.image_url];
  const hasMultiple = images.length > 1;
  const isOOS = getStockStatus(product) === "out_of_stock";
  const [activeIdx, setActiveIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 350, damping: 28 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 350, damping: 28 });
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setActiveIdx(0);
  };

  const handleAdd = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOOS) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }, [addItem, product, isOOS]);

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.card} ${isOOS ? styles.oos : ""}`}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45 }}
    >
      <Link href={`/products/${product.id}`} style={{ display: "block" }}>

        {/* Image recess — inset well */}
        <div className={styles.imageRecess}>
          {product.sku && <div className={styles.serialCode}>{product.sku}</div>}

          {images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={i === 0 ? product.name : `${product.name} — view ${i + 1}`}
              className={`${styles.image} ${i === 0 ? styles.imageBase : styles.imageAlt}`}
              style={i > 0 ? { opacity: activeIdx === i ? 1 : 0 } : undefined}
              loading={i === 0 ? "eager" : "lazy"}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
            />
          ))}

          {hasMultiple && images.length === 2 && (
            <div className={styles.hoverZone} onMouseEnter={() => setActiveIdx(1)} />
          )}
          {hasMultiple && images.length >= 3 && images.map((_, i) => (
            <div
              key={i}
              className={styles.hoverZoneSegment}
              style={{ left: `${(i / images.length) * 100}%`, width: `${100 / images.length}%` }}
              onMouseEnter={() => setActiveIdx(i)}
            />
          ))}

          {hasMultiple && (
            <div className={styles.dots}>
              {images.map((_, i) => (
                <span key={i} className={`${styles.dot} ${activeIdx === i ? styles.dotActive : ""}`} />
              ))}
            </div>
          )}

          {isOOS && <div className={styles.soldOut}>Sold Out</div>}

          {/* Add to cart — magnetic + spark button */}
          {!minimal && !isOOS && (
            <Magnet padding={40} magnetStrength={4} className={styles.addBtnWrap}>
              <ClickSpark
                sparkColor="#9FE870"
                sparkSize={7}
                sparkRadius={18}
                sparkCount={8}
                duration={500}
                style={{ borderRadius: '50%' }}
              >
                <motion.button
                  className={`${styles.addBtn} ${added ? styles.addBtnDone : ""}`}
                  onClick={handleAdd}
                  whileTap={{ scale: 0.92 }}
                  aria-label={`Add ${product.name} to cart`}
                >
                  {added ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  )}
                </motion.button>
              </ClickSpark>
            </Magnet>
          )}
        </div>

        {/* Info — inside card slab */}
        {!minimal && (
          <div className={styles.info}>
            <h3 className={styles.name}>{product.name}</h3>
            {product.scent && <div className={styles.scent}>{product.scent}</div>}
            {product.inspired_by && (
              <div className={styles.inspiredBy}>Inspired by {product.inspired_by}</div>
            )}
            <div className={styles.priceRow}>
              <span className={styles.price}>
                {product.variants
                  ? `From $${product.variants[0].price.toFixed(2)}`
                  : `$${product.price.toFixed(2)}`}
              </span>
            </div>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
