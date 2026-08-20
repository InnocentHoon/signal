'use client';

import React, { useState } from 'react';

export default function CalendarPage() {
  const [view, setView] = useState('Month');
  
  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Content Calendar</h1>
        <div className="flex gap-4 items-center">
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            {['Month', 'Week', 'List'].map(v => (
              <button 
                key={v} 
                onClick={() => setView(v)}
                className={`px-4 py-1.5 text-sm rounded-md ${view === v ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                {v}
              </button>
            ))}
          </div>
          <button className="bg-white text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-200">
            + New Item
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden min-h-[600px] p-6">
        <div className="grid grid-cols-7 gap-px bg-zinc-800">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="bg-zinc-900 p-2 text-center text-sm text-zinc-400">{d}</div>
          ))}
          {Array.from({length: 35}).map((_, i) => (
            <div key={i} className="bg-zinc-900 min-h-[100px] p-2 flex flex-col gap-1">
              <span className="text-zinc-500 text-sm mb-1">{i + 1}</span>
              {i === 12 && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-400 text-xs p-1 rounded">
                  Published
                </div>
              )}
              {i === 15 && (
                <div className="bg-amber-500/20 border border-amber-500/50 text-amber-400 text-xs p-1 rounded">
                  Draft
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}