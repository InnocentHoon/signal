'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-zinc-400 mb-8">
            An unexpected error occurred. We've logged it and will look into it.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="bg-white text-black font-medium px-6 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Try again
            </button>
            <Link
              href="/dashboard"
              className="border border-zinc-800 text-zinc-300 font-medium px-6 py-2.5 rounded-lg hover:bg-zinc-900 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
