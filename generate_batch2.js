const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join('c:', 'Users', 'sawan', 'Downloads', 'signal', 'src', 'app');

const FILES = {
  "(app)/calendar/page.tsx": `
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
                className={\`px-4 py-1.5 text-sm rounded-md \${view === v ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}\`}
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
`,

  "(app)/reports/page.tsx": `
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
            <button onClick={() => setTab('Weekly')} className={\`px-4 py-1.5 text-sm rounded-md \${tab === 'Weekly' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}\`}>Weekly</button>
            <button onClick={() => setTab('Monthly')} className={\`px-4 py-1.5 text-sm rounded-md \${tab === 'Monthly' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}\`}>Monthly</button>
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
`,

  "(app)/settings/page.tsx": `
'use client';

import React, { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');

  return (
    <div className="p-8 max-w-5xl mx-auto text-white flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-64 space-y-1">
        <h1 className="text-2xl font-bold mb-6 px-4">Settings</h1>
        {['Profile', 'Account', 'Instagram', 'Notifications', 'Appearance'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={\`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors \${activeTab === tab ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900'}\`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-8">
        <h2 className="text-xl font-bold mb-6">{activeTab} Settings</h2>
        
        {activeTab === 'Profile' && (
          <form className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Name</label>
              <input type="text" defaultValue="John Doe" className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Bio</label>
              <textarea defaultValue="Designing things" className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white h-24" />
            </div>
            <button className="bg-white text-black px-4 py-2 rounded-lg font-medium text-sm">Save Changes</button>
          </form>
        )}

        {activeTab === 'Instagram' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-black border border-zinc-800 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-full"></div>
                <div>
                  <div className="font-semibold">@johndoe</div>
                  <div className="text-xs text-green-400">Connected</div>
                </div>
              </div>
              <button className="text-red-400 text-sm hover:underline">Disconnect</button>
            </div>
            <div>
              <p className="text-sm text-zinc-400 mb-2">Last synced: 2 hours ago</p>
              <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                Sync Now
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Notifications' && (
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-zinc-800 bg-black text-white focus:ring-0" />
              <span className="text-sm">Email me weekly reports</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-zinc-800 bg-black text-white focus:ring-0" />
              <span className="text-sm">Email me when new trends are detected</span>
            </label>
          </div>
        )}

        {activeTab === 'Appearance' && (
          <div className="space-y-4">
             <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded border-zinc-800 bg-black text-white focus:ring-0" />
              <span className="text-sm">Enable Advanced Mode (shows raw metrics instead of simplified scores)</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
`,

  "(marketing)/layout.tsx": `
import React from 'react';
import Link from 'next/link';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800">
      <nav className="border-b border-zinc-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            SIGNAL
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/analyze" className="text-zinc-400 hover:text-white transition-colors">Analyze</Link>
            <Link href="/login" className="text-zinc-400 hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
      <footer className="border-t border-zinc-800/50 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-bold tracking-tighter">SIGNAL</div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
`,

  "(marketing)/page.tsx": `
import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10 h-screen"></div>

      <section className="max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
          FIND THE SIGNAL.<br/><span className="text-zinc-500">IGNORE THE NOISE.</span>
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Understand what is working across your social presence, discover opportunities in your niche, and know what to create next.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/analyze" className="w-full sm:w-auto px-8 py-4 rounded-full border border-zinc-700 hover:border-zinc-500 font-medium transition-colors">
            Analyze an Account
          </Link>
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
            Get Started &rarr;
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-zinc-800/50">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Profile Intelligence</h2>
            <p className="text-zinc-400 leading-relaxed text-lg">Stop guessing about your growth. We connect directly to your data to provide real-time insights into your audience, engagement patterns, and growth velocity. No vanity metrics, just actionable intelligence.</p>
          </div>
          <div className="aspect-video bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex items-center justify-center">
            <div className="w-full h-full border border-zinc-800/50 rounded-lg bg-black/50 overflow-hidden relative">
               <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-green-500/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-zinc-800/50">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 aspect-video bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4 w-full h-full">
              <div className="bg-zinc-800/50 rounded-lg"></div>
              <div className="bg-zinc-800/50 rounded-lg"></div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold mb-4">Content Intelligence</h2>
            <p className="text-zinc-400 leading-relaxed text-lg">Every post is an experiment. We analyze your content formats, topics, and timing to tell you exactly why a piece performed well, and how to replicate that success.</p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-32 text-center">
        <h2 className="text-4xl font-bold mb-8">Start understanding your content.</h2>
        <Link href="/register" className="inline-block px-10 py-5 rounded-full bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)]">
          Join SIGNAL today
        </Link>
      </section>
    </div>
  );
}
`,

  "(marketing)/privacy/page.tsx": `
import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 prose prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: October 2023</p>
      
      <h2>1. Information We Collect</h2>
      <p>When you use SIGNAL, we collect information that you provide to us directly, such as your email and name when you create an account. When you connect social accounts, we access data via their official APIs (like Meta Graph API) to provide you with analytics.</p>
      
      <h2>2. How We Use Your Information</h2>
      <p>We use your information solely to provide, maintain, and improve the SIGNAL service. We do not sell your data to third parties. AI features process your content data to generate insights, but this data is not used to train global models.</p>
      
      <h2>3. Data Security</h2>
      <p>We implement industry-standard security measures to protect your data. Your passwords are encrypted, and OAuth tokens are stored securely. "Your password is NEVER shared with SIGNAL" when connecting social accounts.</p>
    </div>
  );
}
`,

  "(marketing)/terms/page.tsx": `
import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 prose prose-invert">
      <h1>Terms of Service</h1>
      <p>Last updated: October 2023</p>
      
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using SIGNAL, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
      
      <h2>2. Description of Service</h2>
      <p>SIGNAL provides analytics, content strategy, and social media intelligence tools. We reserve the right to modify or discontinue the service at any time.</p>
      
      <h2>3. User Responsibilities</h2>
      <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account. You may not use the service for any illegal or unauthorized purpose.</p>
    </div>
  );
}
`,

  "(app)/trends/page.tsx": `
'use client';

import React, { useState } from 'react';

export default function TrendsPage() {
  const [hasApiKey] = useState(false);

  if (!hasApiKey) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-white">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center max-w-xl mx-auto mt-20">
          <h2 className="text-2xl font-bold mb-4">YouTube API Required</h2>
          <p className="text-zinc-400 mb-6">
            To view trending topics, SIGNAL requires a YouTube Data API key. Please configure this in your environment variables to unlock the Trends module.
          </p>
          <div className="bg-black border border-zinc-800 rounded p-4 text-sm text-left font-mono text-zinc-500 mb-6">
            YOUTUBE_API_KEY=your_key_here
          </div>
          <button className="bg-white text-black px-6 py-2 rounded-lg font-medium">Check Configuration</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-8">Niche Trends</h1>
      {/* Implementation when API is available */}
    </div>
  );
}
`,

  "(app)/audio/page.tsx": `
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
`,

  "(app)/competitors/page.tsx": `
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
`,

  "(app)/gaps/page.tsx": `
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
`,

  "(app)/analyze/page.tsx": `
'use client';

import React, { useState } from 'react';

export default function AnalyzePage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if(!input) return;
    setLoading(true);
    setTimeout(() => {
      setResult({ username: input, followers: '124k', engagement: '3.2%' });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-white">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Public Account Analyzer</h1>
        <p className="text-zinc-400">Enter any Instagram username to get a quick overview of public metrics.</p>
      </div>

      <form onSubmit={handleAnalyze} className="max-w-xl mx-auto flex gap-4 mb-12">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="@username"
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-zinc-600 shadow-xl"
        />
        <button type="submit" disabled={loading} className="bg-white text-black px-8 font-bold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50">
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {result && !loading && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-zinc-800">
            <div className="w-20 h-20 bg-zinc-800 rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold">{result.username}</h2>
              <p className="text-zinc-400 text-sm mt-1">Public Data Analysis</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <div className="text-zinc-400 text-sm mb-1">Followers (Est)</div>
              <div className="text-3xl font-bold">{result.followers}</div>
            </div>
            <div>
              <div className="text-zinc-400 text-sm mb-1">Avg Engagement</div>
              <div className="text-3xl font-bold">{result.engagement}</div>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-zinc-500">
            Source: Publicly available Instagram data
          </div>
        </div>
      )}
    </div>
  );
}
`
};

for (const [p, content] of Object.entries(FILES)) {
  const fullPath = path.join(BASE_DIR, ...p.split('/'));
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n', 'utf8');
}
console.log('Batch 2 complete');
