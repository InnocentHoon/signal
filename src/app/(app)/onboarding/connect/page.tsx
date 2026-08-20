'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConnectInstagramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      // Fetch the OAuth URL from our backend and redirect
      const res = await fetch('/api/instagram/connect');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Meta credentials not configured yet
        router.push('/settings?error=instagram_not_configured');
      }
    } catch {
      router.push('/settings?error=instagram_not_configured');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
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