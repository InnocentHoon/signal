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
            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${activeTab === tab ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900'}`}
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