'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogIn, UserPlus, LogOut, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

function AuthContent() {
  const { user, login, signup, logout, isDemoMode, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Signed in successfully.');
      } else {
        await signup(email, password);
        toast.success('Account created. Please check your email to confirm.');
      }
      router.push(redirect);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Authentication failed. Please verify credentials.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutofillDemo = () => {
    setEmail('admin@kgiants.com');
    setPassword('admin123');
    toast.success('Admin credentials loaded! Click Sign In below.');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-inputs)',
    padding: '14px 16px',
    fontSize: 14,
    fontFamily: 'var(--font-body)',
    fontWeight: 300,
    color: 'var(--color-ink)',
    outline: 'none',
    transition: 'border-color 150ms ease-out',
  };

  if (user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'var(--color-cream)' }}>
        <div style={{ width: '100%', maxWidth: 360, fontFamily: 'var(--font-body)' }}>
          <div style={{ marginBottom: 32, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-stone)', fontWeight: 500 }}>Active Session</div>
          <div style={{ fontSize: 14, color: 'var(--color-ink)', marginBottom: 4, fontWeight: 300 }}>{user.email}</div>
          
          {isAdmin && (
            <div style={{
              margin: '16px 0 24px',
              padding: '10px 14px',
              background: 'var(--color-emerald-light)',
              border: '1px solid rgba(22, 51, 0, 0.15)',
              fontSize: 12,
              fontFamily: 'var(--font-body)',
              color: 'var(--color-emerald)',
              fontWeight: 500
            }}>
              ✓ Administrator privileges detected
            </div>
          )}

          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {isAdmin && (
              <Link
                href="/admin"
                style={{
                  display: 'block',
                  padding: '13px 20px',
                  background: 'var(--color-emerald)',
                  color: 'var(--color-cream)',
                  borderRadius: 'var(--radius-buttons)',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  transition: 'opacity 150ms'
                }}
              >
                Go to Admin Dashboard
              </Link>
            )}
            
            <Link href="/" style={{ display: 'block', padding: '13px 20px', background: 'var(--color-ink)', color: 'var(--color-cream)', borderRadius: 'var(--radius-buttons)', textAlign: 'center', textDecoration: 'none', fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Back to Shop
            </Link>
            
            <button
              onClick={() => logout()}
              style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-stone)', padding: '13px 20px', borderRadius: 'var(--radius-buttons)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'var(--color-cream)' }}>
      <div style={{ width: '100%', maxWidth: 380, position: 'relative' }}>
        <Link href="/" style={{ position: 'absolute', top: -48, left: 0, color: 'var(--color-stone)', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <ArrowLeft size={12} /> Return Home
        </Link>

        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--color-ink)', marginBottom: 8 }}>
          KGiants
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, color: 'var(--color-ink)', marginBottom: 30, letterSpacing: '-0.03em', lineHeight: 1 }}>
          {isLogin ? 'Sign In' : 'Create Account'}
        </h1>

        {/* Demo Mode active indicator */}
        {isDemoMode && isLogin && (
          <div style={{
            background: 'var(--color-emerald-light)',
            border: '1px solid rgba(22, 51, 0, 0.15)',
            padding: '16px',
            marginBottom: '28px',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            lineHeight: 1.5,
            color: 'var(--color-stone)'
          }}>
            <strong>Demo Mode Active:</strong> Supabase database is not configured. Use the link below to autofill the admin credentials.
            <button
              type="button"
              onClick={handleAutofillDemo}
              style={{
                marginTop: '10px',
                width: '100%',
                padding: '8px 12px',
                background: 'var(--color-emerald)',
                border: 'none',
                color: 'var(--color-cream)',
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'opacity 0.15s'
              }}
            >
              Autofill Admin Credentials
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {['Sign In', 'Register'].map((label, i) => (
            <button
              key={label}
              onClick={() => setIsLogin(i === 0)}
              style={{ flex: 1, padding: '11px', border: `1px solid ${(i === 0) === isLogin ? 'var(--color-ink)' : 'var(--color-border)'}`, background: (i === 0) === isLogin ? 'var(--color-ink)' : 'transparent', color: (i === 0) === isLogin ? 'var(--color-cream)' : 'var(--color-stone)', borderRadius: 'var(--radius-buttons)', fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 180ms ease-out' }}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-stone)', fontWeight: 500, marginBottom: 8, fontFamily: 'var(--font-body)' }}>Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-stone)', fontWeight: 500, marginBottom: 8, fontFamily: 'var(--font-body)' }}>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ marginTop: 8, background: 'var(--color-ink)', color: 'var(--color-cream)', border: '1px solid var(--color-ink)', borderRadius: 'var(--radius-buttons)', padding: '14px', fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.6 : 1, transition: 'opacity 0.2s' }}
          >
            {isSubmitting ? 'Processing...' : (
              <>
                {isLogin ? <LogIn size={14} /> : <UserPlus size={14} />}
                {isLogin ? 'Sign In' : 'Register'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-stone)', fontWeight: 300, background: 'var(--color-cream)' }}>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
