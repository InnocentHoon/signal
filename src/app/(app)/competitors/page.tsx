'use client';

import React, { useState } from 'react';

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState(['@competitor1', '@competitor2']);
  const [newComp, setNewComp] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if(newComp) {
      setCompetitors([...competitors, newComp]);
      setNewComp('');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Competitor Intelligence</h1>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
        <form onSubmit={handleAdd} className="flex gap-4">
          <input 
            type="text" 
            value={newComp}
            onChange={e => setNewComp(e.target.value)}
            placeholder="Enter Instagram username (e.g. @therock)"
            className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white"
          />
          <button type="submit" className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-zinc-200">
            Track
          </button>
        </form>
      </div>

      <div className="grid gap-6">
        {competitors.map((comp, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-full"></div>
              <div>
                <div className="font-bold">{comp}</div>
                <div className="text-sm text-zinc-400">Tracking active</div>
              </div>
            </div>
            <button className="text-sm text-zinc-400 hover:text-white border border-zinc-800 px-4 py-2 rounded-lg">
              View Analysis
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}