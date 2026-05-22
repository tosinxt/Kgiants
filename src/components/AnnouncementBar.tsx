'use client';

import styles from './AnnouncementBar.module.css';

const MESSAGES = [
  'Free shipping on orders over $75',
  'New scents just dropped — shop the collection',
  'Small-batch botanicals · No synthetic fillers',
  '30-day returns, no questions asked',
  'US-wide delivery in 3–5 business days',
];

export default function AnnouncementBar() {
  const track = [...MESSAGES, ...MESSAGES];

  return (
    <div className={styles.bar} role="banner" aria-label="Announcements">
      <div className={styles.marqueeWrap} aria-hidden="true">
        <div className={styles.track}>
          {track.map((msg, i) => (
            <span key={i} className={styles.item}>
              <span className={styles.dot} />
              {msg}
            </span>
          ))}
        </div>
      </div>
      <p className={styles.srOnly}>{MESSAGES[0]}</p>
    </div>
  );
}
