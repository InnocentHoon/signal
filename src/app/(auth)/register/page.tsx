'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 8) strength += 25;
    if (formData.password.match(/[A-Z]/)) strength += 25;
    if (formData.password.match(/[0-9]/)) strength += 25;
    if (formData.password.match(/[^A-Za-z0-9]/)) strength += 25;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleGoogleSignIn = async () => {
    if (!acceptedTerms) {
      setError('Please accept the Terms of Service to continue.');
      return;
    }
    setGoogleLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/onboarding' });
    } catch {
      setError('Google sign-in failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (!acceptedTerms) {
      return setError('You must accept the terms of service');
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        return;
      }

      const result = await signIn('credentials', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/onboarding');
        router.refresh();
      } else {
        router.push('/login?registered=true');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
      <h1 className="text-xl font-semibold mb-1">Create an account</h1>
      <p className="text-sm text-zinc-500 mb-6">Start finding your signal today</p>

      {/* Terms checkbox (shown before Google too) */}
      <div className="flex items-start mb-5">
        <input
          type="checkbox"
          id="terms"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-1 rounded border-zinc-700 bg-black text-white focus:ring-0"
        />
        <label htmlFor="terms" className="ml-2 text-xs text-zinc-400 leading-relaxed">
          I accept the{' '}
          <Link href="/terms" className="text-white hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-white hover:underline">Privacy Policy</Link>
        </label>
      </div>

      {/* Google Sign Up */}
      <button
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
        className="w-full flex items-center justify-center gap-3 bg-white text-zinc-900 font-medium rounded-lg px-4 py-2.5 hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        <GoogleIcon />
        {googleLoading ? 'Redirecting...' : 'Continue with Google'}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-xs text-zinc-600">or sign up with email</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors"
            placeholder="Your name"
            required
            autoComplete="name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors"
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors"
            placeholder="Min. 8 characters"
            required
            autoComplete="new-password"
          />
          {formData.password && (
            <div className="mt-2 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${passwordStrength < 50 ? 'bg-red-500' : passwordStrength < 100 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Confirm Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors"
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full bg-zinc-800 text-white font-medium rounded-lg px-4 py-2 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account...' : 'Create account with Email'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link href="/login" className="text-white hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}