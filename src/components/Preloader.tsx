'use client';

import React, { useEffect, useState } from 'react';
import styles from './Preloader.module.css';

// All images to preload before revealing the site
const BASE = 'https://hnsaowzakbutxvsqwymy.supabase.co/storage/v1/object/public/assets';

const PRELOAD_IMAGES = [
  `${BASE}/static/new-hero.png`,
  `${BASE}/static/hero.png`,
  `${BASE}/static/white-plugin.png`,
  `${BASE}/static/black-plugin.png`,
  `${BASE}/static/diffuser-2.jpeg`,
  `${BASE}/static/diffuser-3.jpeg`,
];

function loadImage(src: string): Promise<void> {
  return new Promise(resolve => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // never block on a missing image
    img.src = src;
  });
}

export default function Preloader({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let loaded = 0;
    const total = PRELOAD_IMAGES.length;

    const promises = PRELOAD_IMAGES.map(src =>
      loadImage(src).then(() => {
        loaded++;
        setProgress(Math.round((loaded / total) * 100));
      })
    );

    Promise.all(promises).then(() => {
      // Brief pause so 100% is visible
      setTimeout(() => {
        setDone(true);
        // Remove from DOM after fade completes
        setTimeout(() => setHidden(true), 650);
      }, 300);
    });
  }, []);

  return (
    <>
      {!hidden && (
        <div className={`${styles.preloader} ${done ? styles.fadeOut : ''}`} aria-hidden="true">
          <div className={styles.inner}>
            <p className={styles.wordmark}>KGiants</p>
            <div className={styles.trackWrap}>
              <div className={styles.track}>
                <div className={styles.bar} style={{ width: `${progress}%` }} />
              </div>
              <span className={styles.pct}>{progress}</span>
            </div>
            <p className={styles.tagline}>Scent your world</p>
          </div>
        </div>
      )}
      <div className={`${styles.content} ${done ? styles.contentVisible : ''}`}>
        {children}
      </div>
    </>
  );
}
