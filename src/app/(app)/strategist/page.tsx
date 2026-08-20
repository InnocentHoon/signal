'use client';

import React, { useState } from 'react';

export default function StrategistPage() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: 'Hi there! I am your Signal Strategist. I have analyzed your last 30 days of content and current niche trends. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Based on your data, your Reels perform 2x better when posted on Tuesdays. I suggest we create a Reel about UI patterns. Want me to draft the script?` 
      }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col p-4 md:p-8 max-w-5xl mx-auto text-white">
      <div className="mb-4 flex justify-between items-end border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-xl">✨</span> Signal Strategist
          </h1>
          <p className="text-sm text-zinc-400 mt-1">AI trained on your account data.</p>
        </div>
        <div className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-md flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> Active Context
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-6 pr-4 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${m.role === 'user' ? 'bg-white text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-200'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 flex gap-1 items-center">
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {['What should I post this week?', 'Why did my last Reel underperform?', 'Build my week'].map((prompt, i) => (
          <button 
            key={i}
            onClick={() => setInput(prompt)}
            className="whitespace-nowrap bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2 rounded-full text-sm hover:bg-zinc-800 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={handleSend} className="relative">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask your strategist..." 
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-4 pr-12 py-4 text-white focus:outline-none focus:border-zinc-600 shadow-xl"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || loading}
          className="absolute right-2 top-2 bottom-2 bg-white text-black w-10 rounded-lg flex items-center justify-center disabled:opacity-50"
        >
          &uarr;
        </button>
      </form>
    </div>
  );
}