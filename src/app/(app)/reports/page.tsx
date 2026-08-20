'use client';

import React, { useState } from 'react';

export default function ReportsPage() {
  const [tab, setTab] = useState('Weekly');
  const [loading, setLoading] = useState(false);

  const generateReport = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reports</h1>
        <div className="flex gap-4">
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            <button onClick={() => setTab('Weekly')} className={`px-4 py-1.5 text-sm rounded-md ${tab === 'Weekly' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}>Weekly</button>
            <button onClick={() => setTab('Monthly')} className={`px-4 py-1.5 text-sm rounded-md ${tab === 'Monthly' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}>Monthly</button>
          </div>
          <button onClick={generateReport} disabled={loading} className="bg-white text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-200">
            {loading ? 'Generating...' : 'Generate New'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">Strategy Report</h2>
              <p className="text-zinc-400 text-sm">Oct 8 - Oct 15, 2023</p>
            </div>
            <button className="text-zinc-400 hover:text-white border border-zinc-800 px-3 py-1 rounded">Export CSV</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black border border-zinc-800 rounded-lg p-4">
              <div className="text-sm text-zinc-400">Net Growth</div>
              <div className="text-2xl font-bold text-green-400">+412</div>
            </div>
            <div className="bg-black border border-zinc-800 rounded-lg p-4">
              <div className="text-sm text-zinc-400">Total Reach</div>
              <div className="text-2xl font-bold text-white">12.4k</div>
            </div>
            <div className="bg-black border border-zinc-800 rounded-lg p-4">
              <div className="text-sm text-zinc-400">Avg Engagement</div>
              <div className="text-2xl font-bold text-white">4.8%</div>
            </div>
          </div>

          <h3 className="font-semibold text-lg mb-4">Insights & Patterns</h3>
          <ul className="space-y-3 text-zinc-300">
            <li className="flex gap-2"><span>📈</span> Carousels are driving 60% of your saves. Continue this format for educational content.</li>
            <li className="flex gap-2"><span>📉</span> Stories posted after 5PM are getting 30% less reach. Shift to morning posts.</li>
            <li className="flex gap-2"><span>💡</span> Your audience is responding well to "Behind the scenes" content.</li>
          </ul>
        </div>
        
        <h3 className="text-xl font-bold pt-4">Past Reports</h3>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800">
          {[1,2,3].map(i => (
            <div key={i} className="p-4 flex justify-between items-center hover:bg-zinc-800/50 cursor-pointer">
              <div>
                <div className="font-medium">Weekly Report</div>
                <div className="text-sm text-zinc-400">Oct {1-i} - Oct {8-i}, 2023</div>
              </div>
              <div className="text-zinc-400">&rarr;</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}