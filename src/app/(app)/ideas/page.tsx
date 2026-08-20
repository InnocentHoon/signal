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