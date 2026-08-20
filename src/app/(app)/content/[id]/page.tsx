'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const [mode, setMode] = useState<'simple'|'advanced'>('simple');

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
              <div className="flex-1 bg-zinc-800 h-[40%] rounded-t-lg relative">
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