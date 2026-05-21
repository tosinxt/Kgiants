'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './product.module.css';

export default function ScrollGallery({ images, name }: { images: string[]; name: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // For single-image products, just render the image statically
  if (images.length === 1) {
    return (
      <div className={styles.imageContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[0]}
          alt={name}
          className={styles.mainImage}
        />
      </div>
    );
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const containerHeight = container.offsetHeight;

      // Calculate how far we've scrolled through the container
      // When rect.top = navbarHeight, we're at the start
      // When rect.bottom = viewportHeight, we're at the end
      const navbarHeight = 56; // var(--navbar-height)
      const scrollStart = navbarHeight;
      const scrollableHeight = containerHeight - viewportHeight;

      // Progress from 0 (top of container just reached sticky position) to 1 (bottom leaving viewport)
      const scrolled = scrollStart - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

      // Map progress to image index
      const index = Math.floor(progress * images.length);
      const clampedIndex = Math.max(0, Math.min(images.length - 1, index));

      setActiveIndex(clampedIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [images.length]);

  return (
    <div
      ref={containerRef}
      className={styles.scrollGalleryContainer}
      style={{ height: `${images.length * 100}vh` }}
    >
      <div className={styles.stickyPanel}>
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt={`${name} — view ${i + 1}`}
            className={styles.galleryImage}
            style={{
              opacity: activeIndex === i ? 1 : 0,
              transition: 'opacity 0.4s ease-out',
            }}
          />
        ))}

        {/* Dot indicators */}
        <div className={styles.galleryDots}>
          {images.map((_, i) => (
            <span
              key={i}
              className={`${styles.galleryDot} ${activeIndex === i ? styles.galleryDotActive : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
