'use client';

import React, { useState, useEffect } from 'react';

const TABS = ['7d', '30d', '90d', '6m', '1y'];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  }, [period]);

  const metrics = [
    { label: 'Followers', value: '12,402', change: '+124', trend: 'up' },
    { label: 'Growth', value: '1.2%', change: '+0.1%', trend: 'up' },
    { label: 'Reach', value: '45,210', change: '-2.4k', trend: 'down' },
    { label: 'Impressions', value: '82,104', change: '+12k', trend: 'up' },
    { label: 'Engagement Rate', value: '4.8%', change: '+0.4%', trend: 'up' },
    { label: 'Avg Likes', value: '412', change: '+42', trend: 'up' },
    { label: 'Avg Comments', value: '24', change: '-2', trend: 'down' },
    { label: 'Saves', value: '1,042', change: '+204', trend: 'up' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setPeriod(t)}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors ${period === t ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-24 bg-zinc-900 rounded-xl" />)}
          </div>
          <div className="h-64 bg-zinc-900 rounded-xl" />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
                <div className="text-zinc-400 text-sm mb-1">{m.label}</div>
                <div className="text-2xl font-semibold mb-2">{m.value}</div>
                <div className={`text-xs ${m.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {m.change} vs previous
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl h-80 flex flex-col">
              <h3 className="font-semibold mb-4 text-zinc-200">Follower Growth</h3>
              <div className="flex-1 border-b border-l border-zinc-800 relative flex items-end">
                <div className="absolute bottom-0 left-0 w-full h-full p-4 flex items-end gap-2">
                  {[40, 45, 42, 50, 55, 60, 58, 65, 70, 75, 80, 85].map((h, i) => (
                    <div key={i} className="flex-1 bg-zinc-700 hover:bg-white transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl h-80 flex flex-col">
              <h3 className="font-semibold mb-4 text-zinc-200">Engagement Rate</h3>
              <div className="flex-1 border-b border-l border-zinc-800 relative flex items-end">
                <div className="absolute bottom-0 left-0 w-full h-full p-4 flex items-end gap-2">
                  {[20, 25, 30, 28, 35, 40, 45, 40, 50, 48, 55, 60].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-purple-900/50 to-purple-500 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Top Posts</h3>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-800/50 text-zinc-400">
                  <tr>
                    <th className="px-6 py-3 font-medium">Post</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Format</th>
                    <th className="px-6 py-3 font-medium">Engagement</th>
                    <th className="px-6 py-3 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 rounded-md" />
                        <span className="truncate max-w-[200px]">How to design better UI...</span>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">Oct {10 + i}, 2023</td>
                      <td className="px-6 py-4"><span className="bg-zinc-800 px-2 py-1 rounded text-xs">Reel</span></td>
                      <td className="px-6 py-4">8.{i}%</td>
                      <td className="px-6 py-4">
                        <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded-full text-xs font-medium">9{i}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}