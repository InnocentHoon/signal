'use client';

import React, { useState } from 'react';

export default function TrendsPage() {
  const [hasApiKey] = useState(false);

  if (!hasApiKey) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-white">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center max-w-xl mx-auto mt-20">
          <h2 className="text-2xl font-bold mb-4">YouTube API Required</h2>
          <p className="text-zinc-400 mb-6">
            To view trending topics, SIGNAL requires a YouTube Data API key. Please configure this in your environment variables to unlock the Trends module.
          </p>
          <div className="bg-black border border-zinc-800 rounded p-4 text-sm text-left font-mono text-zinc-500 mb-6">
            YOUTUBE_API_KEY=your_key_here
          </div>
          <button className="bg-white text-black px-6 py-2 rounded-lg font-medium">Check Configuration</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-8">Niche Trends</h1>
      {/* Implementation when API is available */}
    </div>
  );
}