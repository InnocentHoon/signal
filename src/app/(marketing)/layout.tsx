import React from 'react';
import Link from 'next/link';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800">
      <nav className="border-b border-zinc-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            SIGNAL
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/analyze" className="text-zinc-400 hover:text-white transition-colors">Analyze</Link>
            <Link href="/login" className="text-zinc-400 hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
      <footer className="border-t border-zinc-800/50 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-bold tracking-tighter">SIGNAL</div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}