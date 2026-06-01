'use client';

import React, { useState } from 'react';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';
import styles from './contact.module.css';

const SUBJECTS = [
  { value: 'orders', label: 'Order & Shipping' },
  { value: 'product', label: 'Product Questions' },
  { value: 'collab', label: 'Partnerships' },
  { value: 'other', label: 'General Inquiry' },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Message sent — we\'ll be in touch soon.');
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1200);
  };

  return (
    <>
      <div className={styles.page}>

        {/* Left panel */}
        <div className={styles.left}>
          <div className={styles.leftInner}>
            <p className={styles.eyebrow}>Get in touch</p>
            <h1 className={styles.heading}>
              Let's talk<br />
              <em className={styles.accent}>scent.</em>
            </h1>
            <p className={styles.body}>
              Questions about an order, a product, or just want to say hello?
              We read every message and respond within 1 business day.
            </p>

            <div className={styles.details}>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <span>hello@kgiants.com</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </span>
                <span>Dallas, TX</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </span>
                <span>Mon–Fri, 9am–6pm CT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className={styles.right}>
          <form onSubmit={handleSubmit} className={styles.form}>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <input type="text" required placeholder="Your name" className={styles.input} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input type="email" required placeholder="you@example.com" className={styles.input} />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Subject</label>
              <select required className={styles.select}>
                <option value="" disabled>Select a topic</option>
                {SUBJECTS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Message</label>
              <textarea required rows={6} placeholder="How can we help?" className={styles.textarea} />
            </div>

            <button type="submit" disabled={isSubmitting} className={styles.submit}>
              {isSubmitting ? (
                <>
                  <span className={styles.spinner} />
                  Sending…
                </>
              ) : (
                <>
                  Send message
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>

          </form>
        </div>

      </div>
      <Footer />
    </>
  );
}
