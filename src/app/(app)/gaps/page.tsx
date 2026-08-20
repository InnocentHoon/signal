import React from 'react';

export default function GapsPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-2">Content Gaps</h1>
      <p className="text-zinc-400 mb-8">Discover missing opportunities in your content strategy.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="font-semibold mb-6">Pillar Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>UI Tips</span>
                <span className="text-zinc-500">Actual: 60% (Target: 40%)</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{width: '60%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Career Advice</span>
                <span className="text-zinc-500">Actual: 10% (Target: 30%)</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{width: '10%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Recommended Actions</h3>
          <div className="space-y-4">
            <div className="bg-black border border-zinc-800 rounded-lg p-4">
              <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded font-medium mb-2 inline-block">CRITICAL GAP</span>
              <p className="text-sm">You are under-delivering on Career Advice content. Your audience has high engagement with this topic when you do post it.</p>
              <button className="text-xs mt-3 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded transition-colors">Generate Career Idea</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}