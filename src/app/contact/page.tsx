'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success('Inquiry delivered successfully.');
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1200);
  };

  return (
    <div style={{ background: 'var(--color-canvas-white)', minHeight: '100vh', paddingTop: '140px', paddingBottom: '80px' }}>
      <div className="column-reading animate-reveal" style={{ fontFamily: 'var(--font-dm-sans)' }}>
        <div className="badge-bestseller" style={{ marginBottom: '1.5rem', background: 'var(--color-soft-cloud)', color: 'var(--color-midnight-ink)', display: 'inline-block' }}>
          Support & Operations
        </div>
        
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', 
          lineHeight: 1.1, 
          letterSpacing: '-0.04em', 
          color: 'var(--color-midnight-ink)', 
          marginBottom: '2rem',
          fontWeight: 700
        }}>
          Establish Contact.
        </h1>
        
        <p style={{ 
          fontSize: '1.15rem', 
          lineHeight: 1.6, 
          color: 'var(--color-muted-stone)', 
          marginBottom: '3rem',
          maxWidth: '540px'
        }}>
          For general questions, partnership inquiries, or technical ledger support, please reach out using the fields below.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-midnight-ink)' }}>Full Name</label>
              <input 
                type="text" 
                required 
                placeholder="Tosin Alli"
                style={{ 
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--color-midnight-ink)',
                  padding: '12px 0',
                  fontSize: '16px',
                  outline: 'none',
                  color: 'var(--color-midnight-ink)',
                  fontFamily: 'var(--font-dm-sans)'
                }} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-midnight-ink)' }}>Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="user@example.com"
                style={{ 
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--color-midnight-ink)',
                  padding: '12px 0',
                  fontSize: '16px',
                  outline: 'none',
                  color: 'var(--color-midnight-ink)',
                  fontFamily: 'var(--font-dm-sans)'
                }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-midnight-ink)' }}>Subject</label>
            <select 
              required
              style={{ 
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--color-midnight-ink)',
                padding: '12px 0',
                fontSize: '16px',
                outline: 'none',
                color: 'var(--color-midnight-ink)',
                fontFamily: 'var(--font-dm-sans)',
                cursor: 'pointer'
              }}
            >
              <option value="orders">Order Procurement</option>
              <option value="product">Ledger Curation</option>
              <option value="collab">Partnerships</option>
              <option value="other">General Inquiries</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-midnight-ink)' }}>Message Content</label>
            <textarea 
              required 
              rows={4}
              placeholder="How can we assist you today?"
              style={{ 
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--color-midnight-ink)',
                padding: '12px 0',
                fontSize: '16px',
                outline: 'none',
                color: 'var(--color-midnight-ink)',
                fontFamily: 'var(--font-dm-sans)',
                resize: 'none'
              }} 
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-solid" 
            style={{ 
              alignSelf: 'flex-start', 
              marginTop: '1rem',
              padding: '16px 40px',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'Sending...' : 'Submit Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
