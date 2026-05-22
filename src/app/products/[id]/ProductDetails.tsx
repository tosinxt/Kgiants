'use client';

import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/supabase';
import styles from './product.module.css';

const ease = [0.23, 1, 0.32, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease },
});

interface Props {
  product: Product;
  shortName: string;
  children: ReactNode; // AddToCartButton
}

export default function ProductDetails({ product, shortName, children }: Props) {
  const displayPrice = product.variants
    ? `From $${product.variants[0].price.toFixed(2)}`
    : `$${product.price.toFixed(2)}`;

  const hasFrom = !!product.variants;

  return (
    <div className={styles.details}>

      {/* Meta row */}
      <motion.div className={styles.meta} {...fadeUp(0)}>
        <span>{product.category}</span>
        <span>{product.sku}</span>
      </motion.div>

      {/* Title — word-by-word entrance */}
      <motion.h1
        className={styles.title}
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
        }}
      >
        {shortName.split(' ').map((word, i) => (
          <motion.span
            key={i}
            className={styles.titleWord}
            variants={{
              hidden: { opacity: 0, y: 28 },
              show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.h1>

      {product.scent && (
        <motion.div className={styles.scent} {...fadeUp(0.2)}>
          {product.scent}
        </motion.div>
      )}

      {product.inspired_by && (
        <motion.p className={styles.inspiredBy} {...fadeUp(0.25)}>
          Inspired by {product.inspired_by}
        </motion.p>
      )}

      {/* Price */}
      <motion.div className={styles.priceRow} {...fadeUp(0.3)}>
        <span className={styles.price}>{hasFrom ? displayPrice : `$${product.price.toFixed(2)}`}</span>
        {hasFrom && <span className={styles.priceNote}>select size below</span>}
      </motion.div>

      {/* Description */}
      {product.description && (
        <motion.p className={styles.description} {...fadeUp(0.35)}>
          {product.description}
        </motion.p>
      )}

      {/* Add to cart — passed as child to keep server/client boundary clean */}
      <motion.div {...fadeUp(0.42)}>
        {children}
      </motion.div>

      {/* Accordions */}
      <motion.div className={styles.accordions} {...fadeUp(0.5)}>
        {product.features && product.features.length > 0 && (
          <Accordion title="Features">
            <ul className={styles.featureList}>
              {product.features.map(f => (
                <li key={f} className={styles.featureItem}>
                  <span className={styles.featureDash}>—</span>
                  {f}
                </li>
              ))}
            </ul>
          </Accordion>
        )}

        {product.scent_notes && (
          <Accordion title="Scent notes">
            <div className={styles.scentNotes}>
              {(['top', 'middle', 'base'] as const).map(layer =>
                product.scent_notes![layer]?.length > 0 && (
                  <div key={layer} className={styles.scentRow}>
                    <span className={styles.scentLayer}>{layer}</span>
                    <span className={styles.scentValue}>
                      {product.scent_notes![layer].join(', ')}
                    </span>
                  </div>
                )
              )}
            </div>
          </Accordion>
        )}

        {product.compatible_with && product.compatible_with.length > 0 && (
          <Accordion title="Compatible with">
            <div className={styles.compatTags}>
              {product.compatible_with.map(item => (
                <span key={item} className={styles.compatTag}>{item}</span>
              ))}
            </div>
          </Accordion>
        )}

        {product.caution && (
          <Accordion title="Caution">
            <p className={styles.cautionText}>{product.caution}</p>
          </Accordion>
        )}
      </motion.div>
    </div>
  );
}

/* ── Animated accordion ──────────────────────────────────────────── */

function Accordion({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.accordion}>
      <button
        className={styles.accordionBtn}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className={`${styles.accordionIcon} ${open ? styles.accordionIconOpen : ''}`}>
          +
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className={styles.accordionBody}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.accordionInner}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
