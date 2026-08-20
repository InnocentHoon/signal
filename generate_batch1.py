import os

BASE_DIR = r"c:\Users\sawan\Downloads\signal\src\app"

FILES = {}

FILES[r"(auth)\layout.tsx"] = """
import React from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            SIGNAL
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
"""

FILES[r"(auth)\login\page.tsx"] = """
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { signIn } from 'next-auth/react'; // Assume next-auth is configured

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Mocking sign-in for now
      // const res = await signIn('credentials', { email, password, redirect: false });
      // if (res?.error) throw new Error(res.error);
      
      if (!email || !password) throw new Error('Please enter email and password');
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
      <h1 className="text-xl font-semibold mb-6">Welcome back</h1>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors"
            required
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-zinc-400">Password</label>
            <Link href="/forgot-password" className="text-xs text-zinc-500 hover:text-white transition-colors">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors"
            required
          />
        </div>

        <div className="flex items-center">
          <input type="checkbox" id="remember" className="rounded border-zinc-800 bg-black text-white focus:ring-0 focus:ring-offset-0" />
          <label htmlFor="remember" className="ml-2 text-sm text-zinc-400">Remember me</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-medium rounded-lg px-4 py-2 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-zinc-500">
        Don't have an account?{' '}
        <Link href="/register" className="text-white hover:underline">
          Create one
        </Link>
      </div>
    </div>
  );
}
"""

FILES[r"(auth)\register\page.tsx"] = """
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
      <h1 className="text-xl font-semibold mb-6">Create an account</h1>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6">
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
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors"
            required
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
            required
          />
        </div>

        <div className="flex items-start mt-2">
          <input 
            type="checkbox" 
            id="terms" 
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 rounded border-zinc-800 bg-black text-white focus:ring-0" 
          />
          <label htmlFor="terms" className="ml-2 text-sm text-zinc-400">
            I accept the <Link href="/terms" className="text-white hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-white hover:underline">Privacy Policy</Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-medium rounded-lg px-4 py-2 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {loading ? 'Creating account...' : 'Create account'}
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
"""

FILES[r"(app)\onboarding\page.tsx"] = """
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const NICHES = ['3D Art', 'Design', 'Photography', 'Fashion', 'Fitness', 'Food', 'Travel', 'Tech', 'Business', 'Finance', 'Education', 'Entertainment', 'Lifestyle', 'Beauty', 'Gaming'];
const GOALS = ['Grow followers', 'Increase engagement', 'Increase reach', 'Get clients', 'Generate leads', 'Sell products', 'Build authority', 'Build personal brand', 'Improve consistency'];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  
  const [data, setData] = useState({
    name: '', username: '', niche: '', subNiche: '', targetAudience: '',
    goals: [] as string[],
    style: '', platform: 'Instagram', frequency: '',
    pillars: [{ name: '', target: 20 }]
  });

  const [loading, setLoading] = useState(false);

  const handleNext = () => setStep(s => Math.min(6, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const toggleGoal = (goal: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) ? prev.goals.filter(g => g !== goal) : [...prev.goals, goal]
    }));
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await fetch('/api/profile', { method: 'POST', body: JSON.stringify(data) });
      router.push('/onboarding/connect');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
        <div className="mb-8">
          <div className="flex justify-between text-xs text-zinc-500 mb-2">
            <span>Step {step} of 6</span>
            <span>{Math.round((step / 6) * 100)}%</span>
          </div>
          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all" style={{ width: `${(step / 6) * 100}%` }} />
          </div>
        </div>

        <div className="min-h-[300px]">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-6">Basic Info</h2>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Name</label>
                <input type="text" value={data.name} onChange={e => setData({...data, name: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Username (Handle)</label>
                <input type="text" value={data.username} onChange={e => setData({...data, username: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-6">What do you create?</h2>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Niche</label>
                <select value={data.niche} onChange={e => setData({...data, niche: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white">
                  <option value="">Select a niche</option>
                  {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-6">Target Audience</h2>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Sub-niche (Be specific)</label>
                <input type="text" value={data.subNiche} onChange={e => setData({...data, subNiche: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white" placeholder="e.g. Minimalist UI Design" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Describe your target audience</label>
                <textarea value={data.targetAudience} onChange={e => setData({...data, targetAudience: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white h-24" placeholder="Founders and indie hackers looking to..." />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-6">Main Goals</h2>
              <div className="grid grid-cols-2 gap-3">
                {GOALS.map(goal => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`p-3 rounded-lg border text-sm text-left transition-colors ${data.goals.includes(goal) ? 'bg-white text-black border-white' : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-6">Content Strategy</h2>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Content Style</label>
                <input type="text" value={data.style} onChange={e => setData({...data, style: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white" placeholder="e.g. Educational, Entertaining, Raw" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Posting Frequency</label>
                <select value={data.frequency} onChange={e => setData({...data, frequency: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white">
                  <option value="">Select frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="3x week">3x week</option>
                  <option value="2x week">2x week</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-6">Content Pillars</h2>
              <p className="text-sm text-zinc-400 mb-4">What main topics do you talk about?</p>
              {data.pillars.map((pillar, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <input type="text" value={pillar.name} onChange={e => {
                    const newPillars = [...data.pillars];
                    newPillars[idx].name = e.target.value;
                    setData({...data, pillars: newPillars});
                  }} className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white" placeholder="Pillar name" />
                  <div className="flex items-center gap-2 w-32">
                    <input type="range" min="0" max="100" value={pillar.target} onChange={e => {
                      const newPillars = [...data.pillars];
                      newPillars[idx].target = parseInt(e.target.value);
                      setData({...data, pillars: newPillars});
                    }} className="w-full" />
                    <span className="text-xs text-zinc-400 w-8">{pillar.target}%</span>
                  </div>
                </div>
              ))}
              {data.pillars.length < 5 && (
                <button onClick={() => setData({...data, pillars: [...data.pillars, {name: '', target: 20}]})} className="text-sm text-zinc-400 hover:text-white">
                  + Add Pillar
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-zinc-800">
          <button onClick={handlePrev} disabled={step === 1} className="px-4 py-2 text-sm text-zinc-400 hover:text-white disabled:opacity-0">
            Back
          </button>
          {step < 6 ? (
            <button onClick={handleNext} className="bg-white text-black font-medium rounded-lg px-6 py-2 hover:bg-zinc-200">
              Next
            </button>
          ) : (
            <button onClick={handleFinish} disabled={loading} className="bg-white text-black font-medium rounded-lg px-6 py-2 hover:bg-zinc-200">
              {loading ? 'Saving...' : 'Complete setup'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
"""

FILES[r"(app)\onboarding\connect\page.tsx"] = """
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConnectInstagramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    // Simulate OAuth redirect
    setTimeout(() => {
      window.location.href = '/api/instagram/connect';
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl text-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-xl mx-auto mb-6 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Connect your Instagram</h1>
        <p className="text-zinc-400 mb-6 text-sm">
          SIGNAL needs read-only access to your Instagram insights to provide analytics and content recommendations.
        </p>
        
        <div className="bg-zinc-800/50 rounded-lg p-4 mb-8 text-xs text-zinc-300 text-left">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">✓ Read-only access to post analytics</li>
            <li className="flex items-center gap-2">✓ Secure OAuth connection via Meta</li>
            <li className="flex items-center gap-2 text-green-400">✓ Your password is NEVER shared with SIGNAL</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button onClick={handleConnect} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg px-4 py-3 hover:opacity-90 transition-opacity">
            {loading ? 'Connecting...' : 'Connect Instagram Professional'}
          </button>
          
          <button onClick={() => router.push('/dashboard')} className="w-full bg-transparent text-zinc-400 font-medium rounded-lg px-4 py-3 hover:text-white transition-colors">
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
"""

FILES[r"(app)\analytics\page.tsx"] = """
'use client';

import React, { useState, useEffect } from 'react';

const TABS = ['7d', '30d', '90d', '6m', '1y'];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  }, [period]);

  const metrics = [
    { label: 'Followers', value: '12,402', change: '+124', trend: 'up' },
    { label: 'Growth', value: '1.2%', change: '+0.1%', trend: 'up' },
    { label: 'Reach', value: '45,210', change: '-2.4k', trend: 'down' },
    { label: 'Impressions', value: '82,104', change: '+12k', trend: 'up' },
    { label: 'Engagement Rate', value: '4.8%', change: '+0.4%', trend: 'up' },
    { label: 'Avg Likes', value: '412', change: '+42', trend: 'up' },
    { label: 'Avg Comments', value: '24', change: '-2', trend: 'down' },
    { label: 'Saves', value: '1,042', change: '+204', trend: 'up' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setPeriod(t)}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors ${period === t ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-24 bg-zinc-900 rounded-xl" />)}
          </div>
          <div className="h-64 bg-zinc-900 rounded-xl" />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
                <div className="text-zinc-400 text-sm mb-1">{m.label}</div>
                <div className="text-2xl font-semibold mb-2">{m.value}</div>
                <div className={`text-xs ${m.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {m.change} vs previous
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl h-80 flex flex-col">
              <h3 className="font-semibold mb-4 text-zinc-200">Follower Growth</h3>
              <div className="flex-1 border-b border-l border-zinc-800 relative flex items-end">
                {/* Mock Chart */}
                <div className="absolute bottom-0 left-0 w-full h-full p-4 flex items-end gap-2">
                  {[40, 45, 42, 50, 55, 60, 58, 65, 70, 75, 80, 85].map((h, i) => (
                    <div key={i} className="flex-1 bg-zinc-700 hover:bg-white transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl h-80 flex flex-col">
              <h3 className="font-semibold mb-4 text-zinc-200">Engagement Rate</h3>
              <div className="flex-1 border-b border-l border-zinc-800 relative flex items-end">
                {/* Mock Chart */}
                <div className="absolute bottom-0 left-0 w-full h-full p-4 flex items-end gap-2">
                  {[20, 25, 30, 28, 35, 40, 45, 40, 50, 48, 55, 60].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-purple-900/50 to-purple-500 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Top Posts</h3>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-800/50 text-zinc-400">
                  <tr>
                    <th className="px-6 py-3 font-medium">Post</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Format</th>
                    <th className="px-6 py-3 font-medium">Engagement</th>
                    <th className="px-6 py-3 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 rounded-md" />
                        <span className="truncate max-w-[200px]">How to design better UI...</span>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">Oct {10 + i}, 2023</td>
                      <td className="px-6 py-4"><span className="bg-zinc-800 px-2 py-1 rounded text-xs">Reel</span></td>
                      <td className="px-6 py-4">8.{i}%</td>
                      <td className="px-6 py-4">
                        <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded-full text-xs font-medium">9{i}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"""

FILES[r"(app)\content\page.tsx"] = """
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const FILTERS = ['All', 'Reels', 'Images', 'Carousels', 'Videos'];

export default function ContentLibraryPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid'|'table'>('grid');

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Content Library</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 overflow-x-auto w-full md:w-auto">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors ${filter === f ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search content..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 md:w-64 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-white"
          />
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded-md ${view === 'grid' ? 'bg-zinc-800' : 'text-zinc-400'}`}>
              Grid
            </button>
            <button onClick={() => setView('table')} className={`p-1.5 rounded-md ${view === 'table' ? 'bg-zinc-800' : 'text-zinc-400'}`}>
              Table
            </button>
          </div>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[1,2,3,4,5,6,7,8,9,10].map(i => (
            <Link href={`/content/${i}`} key={i} className="group block">
              <div className="aspect-[4/5] bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden relative mb-3">
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">
                  Reel
                </div>
                <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-zinc-300">Oct 12</div>
                      <div className="font-semibold text-sm">4.2k likes</div>
                    </div>
                    <div className="text-green-400 bg-green-400/20 px-2 py-0.5 rounded text-xs font-semibold">
                      92
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-zinc-400 line-clamp-2 group-hover:text-white transition-colors">
                5 tools every designer needs to know about in 2024. Save this for later! 🎨✨
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-800/50 text-zinc-400">
              <tr>
                <th className="px-6 py-3 font-medium">Post</th>
                <th className="px-6 py-3 font-medium">Format</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Likes</th>
                <th className="px-6 py-3 font-medium">Comments</th>
                <th className="px-6 py-3 font-medium">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {[1,2,3,4,5].map(i => (
                <tr key={i} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/content/${i}`} className="hover:underline line-clamp-1 max-w-xs">
                      5 tools every designer needs to know about in 2024...
                    </Link>
                  </td>
                  <td className="px-6 py-4"><span className="bg-zinc-800 px-2 py-1 rounded text-xs">Reel</span></td>
                  <td className="px-6 py-4 text-zinc-400">Oct 12, 2023</td>
                  <td className="px-6 py-4">4,204</td>
                  <td className="px-6 py-4">102</td>
                  <td className="px-6 py-4">
                    <span className="text-green-400 font-medium">92</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-8 flex justify-center gap-2">
        <button className="px-4 py-2 border border-zinc-800 rounded-lg text-sm hover:bg-zinc-900">Previous</button>
        <button className="px-4 py-2 border border-zinc-800 rounded-lg text-sm hover:bg-zinc-900">Next</button>
      </div>
    </div>
  );
}
"""

FILES[r"(app)\content\[id]\page.tsx"] = """
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const [mode, setMode] = useState<'simple'|'advanced'>('simple');
  const [analyzing, setAnalyzing] = useState(false);

  return (
    <div className="p-8 max-w-6xl mx-auto text-white">
      <Link href="/content" className="text-zinc-400 hover:text-white text-sm mb-6 inline-flex items-center gap-2">
        &larr; Back to library
      </Link>
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-zinc-800 px-2 py-1 rounded text-xs uppercase font-bold tracking-wider">Reel</span>
            <span className="text-zinc-400 text-sm">October 12, 2023</span>
          </div>
          <p className="text-lg max-w-2xl line-clamp-2">5 tools every designer needs to know about in 2024. Save this for later! 🎨✨ #design #tools</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-zinc-400 mb-1">Performance Score</div>
          <div className="text-4xl font-bold text-green-400">92<span className="text-xl text-zinc-500">/100</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="aspect-[4/5] bg-zinc-900 border border-zinc-800 rounded-xl mb-6"></div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h3 className="font-medium mb-4 text-sm text-zinc-400 uppercase tracking-wider">Metrics Overview</h3>
            <div className="space-y-4">
              {[
                { label: 'Reach', val: '45.2k', badge: 'IG' },
                { label: 'Views', val: '52.1k', badge: 'IG' },
                { label: 'Likes', val: '4,204', badge: 'IG' },
                { label: 'Comments', val: '102', badge: 'IG' },
                { label: 'Shares', val: '840', badge: 'IG' },
                { label: 'Saves', val: '1,204', badge: 'IG' },
                { label: 'Engagement Rate', val: '9.3%', badge: 'SIGNAL' },
              ].map(m => (
                <div key={m.label} className="flex justify-between items-center">
                  <span className="text-zinc-300">{m.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{m.val}</span>
                    <span className="text-[10px] bg-zinc-800 px-1 rounded text-zinc-500">{m.badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold">Performance vs Baseline</h3>
              <div className="bg-black border border-zinc-800 rounded-lg p-1 flex text-xs">
                <button onClick={()=>setMode('simple')} className={`px-3 py-1 rounded ${mode==='simple' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}>Simple</button>
                <button onClick={()=>setMode('advanced')} className={`px-3 py-1 rounded ${mode==='advanced' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}>Advanced</button>
              </div>
            </div>
            
            <div className="h-64 flex items-end gap-8 pb-4 border-b border-zinc-800 relative">
              <div className="flex-1 bg-zinc-800 h-[40%] rounded-t-lg relative group">
                <div className="absolute -top-6 w-full text-center text-xs text-zinc-400">Baseline</div>
              </div>
              <div className="flex-1 bg-green-500/20 border border-green-500/50 h-[80%] rounded-t-lg relative">
                <div className="absolute -top-6 w-full text-center text-xs text-green-400 font-bold">+100%</div>
              </div>
            </div>
            <div className="flex mt-4 gap-8 text-center text-sm text-zinc-400">
              <div className="flex-1">Average Post</div>
              <div className="flex-1 text-white">This Post</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">✨</div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              Why did this perform well?
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed mb-6">
              This reel outperformed your baseline significantly due to high save and share rates. The 'listicle' format (5 tools) triggers utility-driven engagement. Watch time was also 24% higher than your average, likely due to the fast-paced editing in the first 3 seconds.
            </p>

            <h4 className="font-medium text-sm mb-3">How to improve & replicate:</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex gap-2"><span className="text-white">•</span> Create a "Part 2" with 5 more tools within the next 7 days to capitalize on the audience retention.</li>
              <li className="flex gap-2"><span className="text-white">•</span> Try pinning the top comment with a link to a full list to drive off-platform traffic.</li>
              <li className="flex gap-2"><span className="text-white">•</span> The hook "5 tools..." worked perfectly. Reuse this hook structure for different topics (e.g. 5 mistakes, 5 resources).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
"""

FILES[r"(app)\radar\page.tsx"] = """
'use client';

import React, { useState } from 'react';

export default function RadarPage() {
  const [hasData] = useState(true);

  if (!hasData) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-white min-h-[80vh] flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📡</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">Radar Inactive</h2>
          <p className="text-zinc-400 mb-8">
            Connect your Instagram account to unlock personalized content opportunities detected from your audience and niche trends.
          </p>
          <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-zinc-200">
            Connect Instagram
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Radar</h1>
        <p className="text-zinc-400">Find your next high-leverage opportunity.</p>
      </div>

      <div className="grid gap-6">
        {[
          { score: 94, topic: 'Figma Auto-layout Tricks', action: 'Create a quick Reel', status: 'NEW' },
          { score: 88, topic: 'Design Systems vs UI Kits', action: 'Carousel deep-dive', status: 'VIEWED' },
          { score: 76, topic: 'Freelance Pricing Strategies', action: 'Talking head video', status: 'ACTIONED' }
        ].map((opp, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
            {opp.status === 'NEW' && <div className="absolute top-0 right-0 bg-blue-500 text-[10px] font-bold px-3 py-1 rounded-bl-lg">NEW</div>}
            
            <div className="flex flex-col items-center justify-center min-w-[100px]">
              <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-2xl font-bold" 
                   style={{ borderColor: opp.score > 90 ? '#4ade80' : opp.score > 80 ? '#facc15' : '#f87171' }}>
                {opp.score}
              </div>
              <span className="text-xs text-zinc-500 mt-2">Opportunity Score</span>
            </div>

            <div className="flex-1 w-full">
              <h3 className="text-xl font-bold mb-1">{opp.topic}</h3>
              <p className="text-zinc-400 text-sm mb-4">Recommended: <span className="text-white">{opp.action}</span></p>
              
              <div className="flex gap-1 h-2 w-full max-w-md rounded-full overflow-hidden">
                <div className="bg-blue-500" style={{ width: '30%' }} title="Trend alignment"></div>
                <div className="bg-purple-500" style={{ width: '40%' }} title="Audience match"></div>
                <div className="bg-green-500" style={{ width: '20%' }} title="Historical success"></div>
                <div className="bg-zinc-700" style={{ width: '10%' }}></div>
              </div>
              <div className="flex gap-4 mt-2 text-[10px] text-zinc-500">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div>Trend</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-purple-500 rounded-full"></div>Audience</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div>Historical</span>
              </div>
            </div>

            <div className="flex md:flex-col gap-3 w-full md:w-auto">
              <button className="flex-1 bg-white text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-200">
                Generate Idea
              </button>
              <button className="flex-1 bg-zinc-800 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-700">
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
"""

FILES[r"(app)\ideas\page.tsx"] = """
'use client';

import React, { useState } from 'react';

export default function IdeasPage() {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setIdeas([
        { score: 95, title: '5 Hidden Features in Figma', hook: 'Stop using Figma like a beginner. Here are 5 hidden features you need.', format: 'Reel', cta: 'Save this for your next project!' },
        { score: 88, title: 'My $10k/mo Freelance Process', hook: 'How I structure my design projects to charge $10k+ consistently.', format: 'Carousel', cta: 'Comment "PROCESS" for my exact template.' }
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-8">Idea Generator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleGenerate} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="font-semibold mb-4">New Ideas</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Topic</label>
                <input type="text" className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-white" placeholder="e.g. UI Design Tips" required />
              </div>
              
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Format</label>
                <select className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm">
                  <option>Any Format</option>
                  <option>Reel</option>
                  <option>Carousel</option>
                  <option>Single Image</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Goal</label>
                <select className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm">
                  <option>Engagement</option>
                  <option>Reach</option>
                  <option>Saves</option>
                  <option>Conversion</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-white text-black font-medium py-2 rounded-lg mt-4 disabled:opacity-50">
                {loading ? 'Generating...' : 'Generate Ideas'}
              </button>
            </div>
          </form>

          {/* Additional tools mini-forms could go here */}
        </div>

        <div className="lg:col-span-2">
          {ideas.length === 0 && !loading ? (
            <div className="h-full min-h-[400px] border border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500">
              Generate ideas to see them here
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => <div key={i} className="h-48 bg-zinc-900 animate-pulse rounded-xl" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {ideas.map((idea, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs font-bold">{idea.score} Match</span>
                      <span className="text-zinc-400 text-xs bg-zinc-800 px-2 py-1 rounded">{idea.format}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-zinc-400 hover:text-white p-1">Save</button>
                      <button className="text-zinc-400 hover:text-white p-1">Copy</button>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{idea.title}</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-zinc-500 block text-xs uppercase mb-1">Suggested Hook</span>
                      <p className="text-white">"{idea.hook}"</p>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-xs uppercase mb-1">Call to Action</span>
                      <p className="text-zinc-300">{idea.cta}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
"""

FILES[r"(app)\strategist\page.tsx"] = """
'use client';

import React, { useState } from 'react';

export default function StrategistPage() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: 'Hi there! I am your Signal Strategist. I have analyzed your last 30 days of content and current niche trends. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Based on your data, your Reels perform 2x better when posted on Tuesdays. I suggest we create a Reel about UI patterns. Want me to draft the script?` 
      }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col p-4 md:p-8 max-w-5xl mx-auto text-white">
      <div className="mb-4 flex justify-between items-end border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-xl">✨</span> Signal Strategist
          </h1>
          <p className="text-sm text-zinc-400 mt-1">AI trained on your account data.</p>
        </div>
        <div className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-md flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> Active Context
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-6 pr-4 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${m.role === 'user' ? 'bg-white text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-200'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 flex gap-1 items-center">
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {['What should I post this week?', 'Why did my last Reel underperform?', 'Build my week'].map((prompt, i) => (
          <button 
            key={i}
            onClick={() => setInput(prompt)}
            className="whitespace-nowrap bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2 rounded-full text-sm hover:bg-zinc-800 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={handleSend} className="relative">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask your strategist..." 
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-4 pr-12 py-4 text-white focus:outline-none focus:border-zinc-600 shadow-xl"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || loading}
          className="absolute right-2 top-2 bottom-2 bg-white text-black w-10 rounded-lg flex items-center justify-center disabled:opacity-50"
        >
          &uarr;
        </button>
      </form>
    </div>
  );
}
"""

FILES[r"(app)\calendar\page.tsx"] = """
'use client';

import React, { useState } from 'react';

export default function CalendarPage() {
  const [view, setView] = useState('Month');
  
  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Content Calendar</h1>
        <div className="flex gap-4 items-center">
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            {['Month', 'Week', 'List'].map(v => (
              <button 
                key={v} 
                onClick={() => setView(v)}
                className={`px-4 py-1.5 text-sm rounded-md ${view === v ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                {v}
              </button>
            ))}
          </div>
          <button className="bg-white text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-200">
            + New Item
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden min-h-[600px] p-6 flex items-center justify-center text-zinc-500">
        Calendar {view} View Component - To be implemented
      </div>
    </div>
  );
}
"""

for path, content in FILES.items():
    full_path = os.path.join(BASE_DIR, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

print("Generated batch 1")
