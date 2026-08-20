'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  TrendingDown,
  TrendingUp,
  Users,
  Heart,
  Eye,
  Zap,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Camera,
} from 'lucide-react';

// ─── Realistic Indian creator demo data ─────────────────────────────────────
function getIndianDemoData(period: '7d' | '30d' | '90d') {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;

  // Fixed reference date so server and browser render identical HTML.
  const referenceDate = new Date('2026-08-20T12:00:00+05:30');

  const base = 34800;

  const followerData = Array.from({ length: days }, (_, i) => {
    const d = new Date(referenceDate);

    d.setDate(d.getDate() - (days - 1 - i));

    const growth = Math.round(
      base +
        i * (base * 0.042 / days) +
        Math.sin(i * 0.7) * 180
    );

    return {
      date: d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      }),
      followers: growth,
    };
  });

  const engagementData = Array.from({ length: days }, (_, i) => {
    const d = new Date(referenceDate);

    d.setDate(d.getDate() - (days - 1 - i));

    // Deterministic variation.
    // Do NOT use Math.random() here because this function runs during render.
    const baseEr =
      4.2 +
      Math.sin(i * 0.5) * 0.9 +
      Math.sin(i * 1.37) * 0.3;

    return {
      date: d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      }),
      rate: Math.max(
        1.8,
        Math.min(8.2, Number(baseEr.toFixed(2)))
      ),
    };
  });

  return {
    profileScore: 8.7,
    healthScore: 88,

    stats: {
      followers: {
        value: '34,800',
        change: 4.2,
        raw: 34800,
      },

      engagement: {
        value: '4.8%',
        change: 0.6,
        raw: 4.8,
      },

      reach: {
        value: '1.2L',
        change: 18.4,
        raw: 120000,
      },

      saves: {
        value: '12.4K',
        change: 22.1,
        raw: 12400,
      },
    },

    followerData,

    engagementData,

    topPosts: [
      {
        emoji: '💰',
        caption: '5 money habits jo 22 saal mein chahiye thi',
        likes: 84200,
        er: '6.8%',
        score: 96,
      },
      {
        emoji: '🧘',
        caption: '10 minute morning yoga — no equipment needed!',
        likes: 93400,
        er: '6.4%',
        score: 94,
      },
      {
        emoji: '🏏',
        caption: 'Virat Kohli ki morning routine — kya seekh sakte hain',
        likes: 52300,
        er: '5.9%',
        score: 91,
      },
    ],

    patterns: [
      'Reels posted 7–9 PM IST pe 52% zyada reach milti hai',
      'Finance content pe save rate baaki niches se 3× zyada hai',
      'Hinglish captions English-only se 40% better perform karti hain',
      'Weekend posts (Sat/Sun) pe 28% higher comments aate hain',
    ],

    alerts: [
      'Engagement rate 3 din se thoda girni shuru hui hai',
      'Story views last week ke comparison mein 12% down hain',
    ],

    recommendations: [
      'Is week 2 aur Finance Reels post karo — best performing topic',
      'Caption mein Hindi question add karo — comments badenge',
      'Post karne se 15 min pehle niche ke accounts ke saath engage karo',
      'Carousel posts mein min. 7 slides rakho — saves ke liye best format',
    ],

    connected: false,
  };
}

function fmt(n: number) {
  if (n >= 100000) return (n / 100000).toFixed(1) + 'L';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function MiniChart({
  data,
  color = '#22c55e',
}: {
  data: number[];
  color?: string;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const w = 120;
  const h = 40;

  const pts = data
    .map((v, i) => {
      const x =
        data.length > 1
          ? (i / (data.length - 1)) * w
          : w / 2;

      const y = h - ((v - min) / range) * h;

      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      width={w}
      height={h}
      className="opacity-60"
      aria-hidden="true"
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatCard({
  label,
  value,
  change,
  spark,
  color,
}: {
  label: string;
  value: string;
  change: number;
  spark?: number[];
  color: string;
}) {
  const up = change >= 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex justify-between items-start mb-3">
        <div className="text-sm text-zinc-400">
          {label}
        </div>

        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
            up
              ? 'text-green-400 bg-green-400/10'
              : 'text-red-400 bg-red-400/10'
          }`}
        >
          {up ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}

          {Math.abs(change)}%
        </span>
      </div>

      <div className="text-2xl font-bold mb-2">
        {value}
      </div>

      {spark && (
        <MiniChart
          data={spark}
          color={color}
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();

  const [period, setPeriod] = useState<
    '7d' | '30d' | '90d'
  >('30d');

  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  const data = getIndianDemoData(period);

  const firstName =
    session?.user?.name?.split(' ')[0] || 'Creator';

  const handleSync = useCallback(async () => {
    setSyncing(true);
    setSyncMsg('');

    try {
      const res = await fetch(
        '/api/instagram/sync',
        {
          method: 'POST',
        }
      );

      const json = await res.json();

      if (res.ok) {
        setSyncMsg('✓ Sync complete!');
      } else {
        setSyncMsg(
          json.error || 'Connect Instagram first'
        );
      }
    } catch {
      setSyncMsg(
        'Connect Instagram to sync real data'
      );
    } finally {
      setSyncing(false);

      setTimeout(() => {
        setSyncMsg('');
      }, 4000);
    }
  }, []);

  const sparkFollowers = data.followerData
    .slice(-14)
    .map((d) => d.followers);

  const sparkEngagement = data.engagementData
    .slice(-14)
    .map((d) => d.rate);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Namaste, {firstName} 👋
          </h1>

          <p className="text-sm text-zinc-500 mt-0.5">
            {new Date(
              '2026-08-20T12:00:00+05:30'
            ).toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}

            {' · '}

            Sample data —{' '}
            <Link
              href="/onboarding/connect"
              className="text-white underline"
            >
              connect Instagram
            </Link>{' '}
            for real insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period selector */}

          <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                    period === p
                      ? 'bg-zinc-800 text-white font-medium'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {p === '7d'
                    ? '7 Days'
                    : p === '30d'
                    ? '30 Days'
                    : '90 Days'}
                </button>
              )
            )}
          </div>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                syncing ? 'animate-spin' : ''
              }`}
            />

            {syncing ? 'Syncing...' : 'Sync Data'}
          </button>
        </div>
      </div>

      {/* Sync message */}

      {syncMsg && (
        <div className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm px-4 py-2.5 rounded-lg">
          {syncMsg}
        </div>
      )}

      {/* Connect Instagram CTA */}

      {!data.connected && (
        <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 text-pink-400" />

            <div>
              <p className="font-medium text-sm">
                Connect Instagram for real analytics
              </p>

              <p className="text-xs text-zinc-400">
                Track real followers, engagement and
                content performance
              </p>
            </div>
          </div>

          <Link
            href="/onboarding/connect"
            className="text-sm bg-white text-black px-4 py-1.5 rounded-lg font-medium hover:bg-zinc-200 transition-colors flex-shrink-0"
          >
            Connect
          </Link>
        </div>
      )}

      {/* Stats */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Followers"
          value={data.stats.followers.value}
          change={data.stats.followers.change}
          spark={sparkFollowers}
          color="#22c55e"
        />

        <StatCard
          label="Engagement Rate"
          value={data.stats.engagement.value}
          change={data.stats.engagement.change}
          spark={sparkEngagement}
          color="#a78bfa"
        />

        <StatCard
          label="Estimated Reach"
          value={data.stats.reach.value}
          change={data.stats.reach.change}
          color="#38bdf8"
        />

        <StatCard
          label="Total Saves"
          value={data.stats.saves.value}
          change={data.stats.saves.change}
          color="#fb923c"
        />
      </div>

      {/* Charts row */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Follower Growth */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4">
            Follower Growth
          </h3>

          <div className="h-40 flex items-end gap-1">
            {data.followerData
              .slice(-20)
              .map((d, i, arr) => {
                const min = Math.min(
                  ...arr.map((x) => x.followers)
                );

                const max = Math.max(
                  ...arr.map((x) => x.followers)
                );

                const pct =
                  ((d.followers - min) /
                    (max - min || 1)) *
                  100;

                return (
                  <div
                    key={`${d.date}-${i}`}
                    className="flex-1 flex flex-col justify-end"
                    title={`${d.date}: ${fmt(
                      d.followers
                    )}`}
                  >
                    <div
                      className="bg-green-500/70 hover:bg-green-500 rounded-sm transition-all cursor-pointer"
                      style={{
                        height: `${Math.max(
                          8,
                          pct
                        )}%`,
                      }}
                    />
                  </div>
                );
              })}
          </div>

          <div className="flex justify-between text-xs text-zinc-600 mt-2">
            <span>
              {data.followerData[0]?.date}
            </span>

            <span>
              {
                data.followerData[
                  data.followerData.length - 1
                ]?.date
              }
            </span>
          </div>
        </div>

        {/* Engagement Rate */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4">
            Engagement Rate
          </h3>

          <div className="h-40 flex items-end gap-1">
            {data.engagementData
              .slice(-20)
              .map((d, i, arr) => {
                const min = Math.min(
                  ...arr.map((x) => x.rate)
                );

                const max = Math.max(
                  ...arr.map((x) => x.rate)
                );

                const pct =
                  ((d.rate - min) /
                    (max - min || 1)) *
                  100;

                return (
                  <div
                    key={`${d.date}-${i}`}
                    className="flex-1 flex flex-col justify-end"
                    title={`${d.date}: ${d.rate.toFixed(
                      1
                    )}%`}
                  >
                    <div
                      className="bg-purple-500/70 hover:bg-purple-500 rounded-sm transition-all cursor-pointer"
                      style={{
                        height: `${Math.max(
                          8,
                          pct
                        )}%`,
                      }}
                    />
                  </div>
                );
              })}
          </div>

          <div className="flex justify-between text-xs text-zinc-600 mt-2">
            <span>
              {data.engagementData[0]?.date}
            </span>

            <span>
              {
                data.engagementData[
                  data.engagementData.length - 1
                ]?.date
              }
            </span>
          </div>
        </div>
      </div>

      {/* Top Posts + Patterns + Recommendations */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Posts */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">
              Top Posts
            </h3>

            <Link
              href="/content"
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
            >
              All
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {data.topPosts.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3"
              >
                <span className="text-2xl">
                  {p.emoji}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-300 line-clamp-1">
                    {p.caption}
                  </p>

                  <p className="text-xs text-zinc-500 mt-0.5">
                    {fmt(p.likes)} likes · {p.er} ER
                  </p>
                </div>

                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    p.score >= 90
                      ? 'text-green-400 bg-green-400/10'
                      : 'text-yellow-400 bg-yellow-400/10'
                  }`}
                >
                  {p.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Patterns */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />

            Patterns Found
          </h3>

          <ul className="space-y-3">
            {data.patterns.map((p, i) => (
              <li
                key={i}
                className="text-sm text-zinc-300 flex gap-2"
              >
                <span className="text-yellow-400 mt-0.5 flex-shrink-0">
                  •
                </span>

                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />

            SIGNAL Recommends
          </h3>

          <ul className="space-y-3">
            {data.recommendations.map((r, i) => (
              <li
                key={i}
                className="text-sm text-zinc-300 flex gap-2"
              >
                <span className="text-green-400 mt-0.5 flex-shrink-0">
                  →
                </span>

                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Alerts */}

      {data.alerts.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />

            Alerts
          </h3>

          <div className="space-y-2">
            {data.alerts.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm text-zinc-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />

                {a}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}