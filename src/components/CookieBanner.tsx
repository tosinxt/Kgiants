'use client';

import React, { useState, useEffect } from 'react';
import styles from './CookieBanner.module.css';

export default function CookieBanner() {
  const [cookieConsent, setCookieConsent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'true') {
      setCookieConsent(true);
    }
  }, []);

  if (!mounted || cookieConsent) return null;

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setCookieConsent(true);
  };

  return (
    <div className={styles.cookieBanner}>
      <div className={styles.cookieText}>
        Our website uses cookies, but only a few. <a href="#" className={styles.cookieLink}>Learn more.</a>
      </div>
      <button className={styles.acceptBtn} onClick={handleAccept}>
        Accept
      </button>
    </div>
  );
}
