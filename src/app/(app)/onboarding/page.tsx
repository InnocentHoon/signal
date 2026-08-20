'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const NICHES = ['3D Art', 'Design', 'Photography', 'Fashion', 'Fitness', 'Food', 'Travel', 'Tech', 'Business', 'Finance', 'Education', 'Entertainment', 'Lifestyle', 'Beauty', 'Gaming'];
const GOALS = ['Grow followers', 'Increase engagement', 'Increase reach', 'Get clients', 'Generate leads', 'Sell products', 'Build authority', 'Build personal brand', 'Improve consistency'];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const [data, setData] = useState({
    name: '', username: '', niche: '', subNiche: '', targetAudience: '',
    goals: [] as string[],
    style: '', platform: 'INSTAGRAM', frequency: '',
    pillars: [{ name: '', target: 20 }]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => setStep(s => Math.min(6, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const toggleGoal = (goal: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) ? prev.goals.filter(g => g !== goal) : [...prev.goals, goal]
    }));
  };

  // Save profile and go to dashboard (or connect page)
  const saveAndFinish = async (skipToConnect = false) => {
    setLoading(true);
    setError('');

    try {
      // Save profile data
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            displayName: data.name || undefined,
            niche: data.niche || undefined,
            subNiche: data.subNiche || undefined,
            targetAudience: data.targetAudience || undefined,
            mainGoal: data.goals[0] || undefined,
            contentStyle: data.style || undefined,
            primaryPlatform: data.platform,
            postingFrequency: data.frequency || undefined,
          },
          user: {
            name: data.name || undefined,
            username: data.username || undefined,
          },
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to save. Please try again.');
        return;
      }

      // Save content pillars if any are filled in
      const filledPillars = data.pillars.filter(p => p.name.trim());
      for (const pillar of filledPillars) {
        await fetch('/api/content/pillars', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: pillar.name, targetPercentage: pillar.target }),
        });
      }

      router.push(skipToConnect ? '/onboarding/connect' : '/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Skip entire onboarding — go straight to dashboard
  const skipAll = async () => {
    setLoading(true);
    try {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">

        {/* Header with skip all */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-zinc-500 mb-2">
              <span>Step {step} of 6</span>
              <span>{Math.round((step / 6) * 100)}%</span>
            </div>
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all" style={{ width: `${(step / 6) * 100}%` }} />
            </div>
          </div>
          <button
            onClick={skipAll}
            disabled={loading}
            className="ml-6 text-xs text-zinc-500 hover:text-white transition-colors flex-shrink-0"
          >
            Skip all →
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <div className="min-h-[300px]">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-2">Basic Info</h2>
              <p className="text-sm text-zinc-500 mb-6">Tell us a bit about you. You can update this any time in settings.</p>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Display Name</label>
                <input type="text" value={data.name} onChange={e => setData({...data, name: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Username</label>
                <input type="text" value={data.username} onChange={e => setData({...data, username: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="@yourhandle" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-2">What do you create?</h2>
              <p className="text-sm text-zinc-500 mb-6">This helps SIGNAL personalise your insights and recommendations.</p>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Niche</label>
                <select value={data.niche} onChange={e => setData({...data, niche: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white">
                  <option value="">Select a niche</option>
                  {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-2">Target Audience</h2>
              <p className="text-sm text-zinc-500 mb-6">The more specific you are, the better your AI recommendations.</p>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Sub-niche (Be specific)</label>
                <input type="text" value={data.subNiche} onChange={e => setData({...data, subNiche: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white"
                  placeholder="e.g. Minimalist UI Design" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Describe your target audience</label>
                <textarea value={data.targetAudience} onChange={e => setData({...data, targetAudience: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white h-24"
                  placeholder="Founders and indie hackers who want to..." />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-2">Main Goals</h2>
              <p className="text-sm text-zinc-500 mb-6">Select all that apply. This shapes your dashboard focus.</p>
              <div className="grid grid-cols-2 gap-3">
                {GOALS.map(goal => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`p-3 rounded-lg border text-sm text-left transition-colors ${data.goals.includes(goal) ? 'bg-white text-black border-white' : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-2">Content Strategy</h2>
              <p className="text-sm text-zinc-500 mb-6">Helps SIGNAL calibrate benchmarks and posting advice.</p>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Content Style</label>
                <input type="text" value={data.style} onChange={e => setData({...data, style: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white"
                  placeholder="e.g. Educational, Entertaining, Raw" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Posting Frequency</label>
                <select value={data.frequency} onChange={e => setData({...data, frequency: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white">
                  <option value="">Select frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="3x week">3× week</option>
                  <option value="2x week">2× week</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-2">Content Pillars</h2>
              <p className="text-sm text-zinc-400 mb-4">What main topics do you talk about? Set target % for each.</p>
              {data.pillars.map((pillar, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <input
                    type="text"
                    value={pillar.name}
                    onChange={e => {
                      const newPillars = [...data.pillars];
                      newPillars[idx].name = e.target.value;
                      setData({...data, pillars: newPillars});
                    }}
                    className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white"
                    placeholder={`Pillar ${idx + 1} (e.g. Education)`}
                  />
                  <div className="flex items-center gap-2 w-32">
                    <input
                      type="range" min="5" max="100"
                      value={pillar.target}
                      onChange={e => {
                        const newPillars = [...data.pillars];
                        newPillars[idx].target = parseInt(e.target.value);
                        setData({...data, pillars: newPillars});
                      }}
                      className="w-full accent-white"
                    />
                    <span className="text-xs text-zinc-400 w-8">{pillar.target}%</span>
                  </div>
                </div>
              ))}
              {data.pillars.length < 5 && (
                <button
                  onClick={() => setData({...data, pillars: [...data.pillars, {name: '', target: 20}]})}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  + Add Pillar
                </button>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-zinc-800">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white disabled:opacity-0 transition-colors"
          >
            ← Back
          </button>

          <div className="flex items-center gap-3">
            {/* Per-step skip */}
            <button
              onClick={step < 6 ? handleNext : () => saveAndFinish(false)}
              disabled={loading}
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              {step < 6 ? 'Skip step' : 'Skip & go to dashboard'}
            </button>

            {step < 6 ? (
              <button
                onClick={handleNext}
                className="bg-white text-black font-medium rounded-lg px-6 py-2 hover:bg-zinc-200 transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => saveAndFinish(true)}
                disabled={loading}
                className="bg-white text-black font-medium rounded-lg px-6 py-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Connect Instagram →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}