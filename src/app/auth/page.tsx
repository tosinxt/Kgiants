'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogIn, UserPlus, LogOut, User as UserIcon, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

function AuthContent() {
  const { user, login, signup, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle redirect if specified in URL parameters
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        await login(email);
        toast.success('Signed in successfully.');
      } else {
        await signup(email);
        toast.success('Account registered.');
      }
      router.push(redirect);
    } catch (error) {
      toast.error('Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user) {
    return (
      <div style={{ background: 'var(--color-canvas-white)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'var(--color-soft-cloud)', padding: '3rem', borderRadius: '30px', width: '100%', maxWidth: '440px', border: '1px solid var(--color-light-steel)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--color-vivacious-green)', color: 'var(--color-midnight-ink)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--color-midnight-ink)' }}>
            <UserIcon size={28} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '24px', color: 'var(--color-midnight-ink)', letterSpacing: '-0.02em', marginBottom: '0.5rem', fontWeight: 600 }}>Active Session</h2>
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', color: 'var(--color-muted-stone)', marginBottom: '2.5rem' }}>{user.email}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/" style={{ display: 'block', width: '100%', background: 'var(--color-midnight-ink)', color: 'var(--color-canvas-white)', padding: '14px', borderRadius: '40px', textAlign: 'center', textDecoration: 'none', fontSize: '14px', fontWeight: 500, fontFamily: 'var(--font-dm-sans)', border: '1px solid var(--color-midnight-ink)', transition: 'all 0.2s ease' }}>
              Back to Ledger
            </Link>
            <button onClick={logout} style={{ fontFamily: 'var(--font-dm-sans)', width: '100%', background: 'transparent', border: '1px solid var(--color-midnight-ink)', color: 'var(--color-midnight-ink)', padding: '14px', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, transition: 'all 0.2s ease' }}>
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--color-canvas-white)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
        <Link href="/" style={{ position: 'absolute', top: '-48px', left: 0, color: 'var(--color-midnight-ink)', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontSize: '13px', fontFamily: 'var(--font-dm-sans)', fontWeight: 500, opacity: 0.8 }}>
          <ArrowLeft size={14} /> Return Home
        </Link>

        <div style={{ background: 'var(--color-soft-cloud)', padding: '3rem 2.5rem', borderRadius: '30px', border: '1px solid var(--color-light-steel)' }}>
          
          <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', color: 'var(--color-muted-stone)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.5rem' }}>
            Security Access
          </div>

          <h1 style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '32px', letterSpacing: '-0.04em', color: 'var(--color-midnight-ink)', marginBottom: '2rem', fontWeight: 700 }}>
            {isLogin ? 'Login' : 'Register'}
          </h1>

          {/* Toggle Mechanism using Moonli style */}
          <div style={{ display: 'flex', background: 'var(--color-light-steel)', borderRadius: '40px', padding: '4px', marginBottom: '2.5rem', border: '1px solid var(--color-midnight-ink)' }}>
            <button 
              onClick={() => setIsLogin(true)}
              style={{ flex: 1, padding: '12px', border: 0, background: isLogin ? 'var(--color-canvas-white)' : 'transparent', color: 'var(--color-midnight-ink)', borderRadius: '40px', fontSize: '14px', fontWeight: 500, fontFamily: 'var(--font-dm-sans)', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              style={{ flex: 1, padding: '12px', border: 0, background: !isLogin ? 'var(--color-canvas-white)' : 'transparent', color: 'var(--color-midnight-ink)', borderRadius: '40px', fontSize: '14px', fontWeight: 500, fontFamily: 'var(--font-dm-sans)', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--color-midnight-ink)' }}>Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                style={{ width: '100%', background: 'var(--color-canvas-white)', border: '1px solid var(--color-midnight-ink)', borderRadius: '12px', padding: '14px', fontSize: '14px', fontFamily: 'var(--font-dm-sans)', color: 'var(--color-midnight-ink)', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--color-midnight-ink)' }}>Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', background: 'var(--color-canvas-white)', border: '1px solid var(--color-midnight-ink)', borderRadius: '12px', padding: '14px', fontSize: '14px', fontFamily: 'var(--font-dm-sans)', color: 'var(--color-midnight-ink)', outline: 'none' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{ 
                fontFamily: 'var(--font-dm-sans)',
                marginTop: '1rem', 
                background: 'var(--color-midnight-ink)', 
                color: 'var(--color-canvas-white)', 
                border: '1px solid var(--color-midnight-ink)', 
                borderRadius: '40px', 
                padding: '16px', 
                fontSize: '15px', 
                fontWeight: 500, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Processing...' : (
                <>
                  {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                  {isLogin ? 'Sign In' : 'Register'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div style={{ background: 'var(--color-canvas-white)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-midnight-ink)', fontFamily: 'var(--font-dm-sans)' }}>
        Loading Gateway...
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
