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