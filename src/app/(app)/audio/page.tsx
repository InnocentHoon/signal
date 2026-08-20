import React from 'react';

export default function AudioTrendsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto text-white">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center max-w-2xl mx-auto mt-20">
        <div className="text-4xl mb-6">🎵</div>
        <h2 className="text-2xl font-bold mb-4">Audio Trends Unavailable</h2>
        <p className="text-zinc-400 leading-relaxed">
          Currently, there is no official, commercial API provided by Instagram or TikTok to reliably track trending audio. Any third-party tool offering this is likely scraping data, which violates Terms of Service and is unstable. SIGNAL prioritizes stability and compliance, so we do not offer scraped audio trends.
        </p>
      </div>
    </div>
  );
}