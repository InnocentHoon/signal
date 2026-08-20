'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

// Realistic Indian creator content posts
const INDIAN_POSTS = [
  {
    id: 1, type: 'REEL', score: 96, likes: 84200, comments: 1843, saves: 12400, shares: 3200,
    date: '2024-08-14', engagement: 6.8,
    caption: '5 money habits jo mujhe 22 saal mein chahiye thi 💰 Save karo future ke liye! #PersonalFinance #MoneyTips #IndianFinance',
    topic: 'Finance', color: 'from-green-900 to-emerald-800', emoji: '💰',
  },
  {
    id: 2, type: 'CAROUSEL', score: 91, likes: 52300, comments: 967, saves: 18900, shares: 2100,
    date: '2024-08-12', engagement: 5.9,
    caption: 'Virat Kohli ki morning routine — aur kya seekh sakte hain hum 🏏 Slide 2 pe dekho 👆 #Cricket #Motivation #ViratKohli',
    topic: 'Motivation', color: 'from-blue-900 to-indigo-800', emoji: '🏏',
  },
  {
    id: 3, type: 'REEL', score: 88, likes: 127000, comments: 3421, saves: 8700, shares: 14200,
    date: '2024-08-10', engagement: 7.2,
    caption: 'Biryani banane ka secret method jo kisi ne nahi bataya 🍚🔥 Maa ki recipe! #Biryani #IndianFood #CookingReels',
    topic: 'Food', color: 'from-orange-900 to-amber-800', emoji: '🍚',
  },
  {
    id: 4, type: 'IMAGE', score: 74, likes: 31200, comments: 412, saves: 2800, shares: 890,
    date: '2024-08-09', engagement: 3.4,
    caption: 'Pahalgam trip on ₹15,000 — complete itinerary 🏔️ Link in bio! #KashmirTourism #BudgetTravel #IndiaTravel',
    topic: 'Travel', color: 'from-teal-900 to-cyan-800', emoji: '🏔️',
  },
  {
    id: 5, type: 'REEL', score: 94, likes: 93400, comments: 2187, saves: 15600, shares: 7800,
    date: '2024-08-07', engagement: 6.4,
    caption: '10 minute morning yoga jo life badal dega ✨ No equipment needed! #YogaIndia #MorningRoutine #IndianYoga',
    topic: 'Fitness', color: 'from-purple-900 to-violet-800', emoji: '🧘',
  },
  {
    id: 6, type: 'CAROUSEL', score: 89, likes: 48700, comments: 1034, saves: 22300, shares: 3400,
    date: '2024-08-05', engagement: 5.5,
    caption: 'Top 7 AI tools jo Indian freelancers use kar rahe hain 🤖 Game changer! #AITools #Freelancing #IndianStartup',
    topic: 'Tech', color: 'from-slate-800 to-zinc-700', emoji: '🤖',
  },
  {
    id: 7, type: 'REEL', score: 82, likes: 71200, comments: 4892, saves: 3200, shares: 19400,
    date: '2024-08-03', engagement: 5.1,
    caption: 'Jab exam mein 33 marks aate hain vs parents ka reaction 😭💀 Tag karo dost ko! #IndianMemes #CollegeLife #Relatable',
    topic: 'Comedy', color: 'from-yellow-900 to-orange-800', emoji: '😂',
  },
  {
    id: 8, type: 'IMAGE', score: 68, likes: 22100, comments: 287, saves: 1900, shares: 540,
    date: '2024-08-01', engagement: 2.9,
    caption: 'Chandrayaan-3 landing ke 1 year baad kahan pahunche hum 🚀 Proud to be Indian! #Chandrayaan #ISRO #IndiaInSpace',
    topic: 'Education', color: 'from-indigo-900 to-blue-900', emoji: '🚀',
  },
  {
    id: 9, type: 'REEL', score: 93, likes: 108000, comments: 2934, saves: 19800, shares: 12300,
    date: '2024-07-30', engagement: 7.0,
    caption: 'SIP vs FD — kaun behtar hai 2024 mein? 📈 Finally samajh aaya! #SIP #MutualFunds #IndianInvestor',
    topic: 'Finance', color: 'from-green-900 to-teal-800', emoji: '📈',
  },
  {
    id: 10, type: 'CAROUSEL', score: 87, likes: 39800, comments: 743, saves: 16700, shares: 2100,
    date: '2024-07-28', engagement: 4.8,
    caption: 'Pune to Leh bike trip — day by day guide 🏍️ Total cost + route inside! #BikeTrip #LehLadakh #MotoVlog',
    topic: 'Travel', color: 'from-red-900 to-rose-800', emoji: '🏍️',
  },
  {
    id: 11, type: 'REEL', score: 79, likes: 58400, comments: 1672, saves: 4100, shares: 8900,
    date: '2024-07-26', engagement: 4.3,
    caption: 'NEET vs IIT — reality check for Indian students 😤 Thread mein full breakdown! #NEET #IIT #IndianStudents',
    topic: 'Education', color: 'from-blue-900 to-sky-800', emoji: '📚',
  },
  {
    id: 12, type: 'IMAGE', score: 71, likes: 28600, comments: 531, saves: 3400, shares: 720,
    date: '2024-07-24', engagement: 3.1,
    caption: 'My Zomato delivery earnings in Mumbai — real numbers 📦 @zomato #GigEconomy #DeliveryBoy #RealTalk',
    topic: 'Business', color: 'from-orange-900 to-red-900', emoji: '📦',
  },
  {
    id: 13, type: 'REEL', score: 95, likes: 142000, comments: 5621, saves: 21300, shares: 28400,
    date: '2024-07-22', engagement: 8.1,
    caption: 'Dhoni ka "helicopter shot" — physics ke through samjhao 🚁 Watch till end! #Dhoni #Cricket #ScienceOfCricket',
    topic: 'Entertainment', color: 'from-yellow-900 to-amber-800', emoji: '🚁',
  },
  {
    id: 14, type: 'CAROUSEL', score: 85, likes: 44200, comments: 892, saves: 14800, shares: 1900,
    date: '2024-07-20', engagement: 4.6,
    caption: '₹500 mein goa trip? Here is how I did it 🏖️ Hostel + local food + free beaches! #BudgetGoa #GoaTrip',
    topic: 'Travel', color: 'from-cyan-900 to-teal-800', emoji: '🏖️',
  },
  {
    id: 15, type: 'REEL', score: 90, likes: 86700, comments: 2103, saves: 17200, shares: 9800,
    date: '2024-07-18', engagement: 5.8,
    caption: 'Skin care routine under ₹500 — all pharmacy products 🌿 Dermat approved! #SkinCare #IndianSkinCare #GlowUp',
    topic: 'Lifestyle', color: 'from-pink-900 to-rose-800', emoji: '🌿',
  },
  {
    id: 16, type: 'IMAGE', score: 66, likes: 19300, comments: 342, saves: 2100, shares: 480,
    date: '2024-07-16', engagement: 2.5,
    caption: 'My first ₹1 lakh freelance month — what I learned 💻 #Freelance #WorkFromHome #IndianFreelancer',
    topic: 'Business', color: 'from-violet-900 to-purple-800', emoji: '💻',
  },
  {
    id: 17, type: 'REEL', score: 83, likes: 63100, comments: 1487, saves: 5800, shares: 11200,
    date: '2024-07-14', engagement: 4.7,
    caption: 'Andha dhekhta hai, andha padhta hai... aur 95% Indian office workers ka reality 😂 Too real? #OfficeLife #Corporate',
    topic: 'Comedy', color: 'from-amber-900 to-yellow-800', emoji: '🏢',
  },
  {
    id: 18, type: 'CAROUSEL', score: 92, likes: 57400, comments: 1234, saves: 28900, shares: 4200,
    date: '2024-07-12', engagement: 6.2,
    caption: '10 Indian stocks jo next 5 saal mein 10x ho sakte hain 📊 Research-backed analysis! #StockMarket #NSE #BSE',
    topic: 'Finance', color: 'from-emerald-900 to-green-800', emoji: '📊',
  },
  {
    id: 19, type: 'REEL', score: 78, likes: 47200, comments: 893, saves: 3900, shares: 6700,
    date: '2024-07-10', engagement: 3.9,
    caption: 'Varanasi ghat at 4 AM — no tourists, just pure India ✨ Shot on iPhone #Varanasi #IncredibleIndia #Travel',
    topic: 'Travel', color: 'from-orange-950 to-red-900', emoji: '🕌',
  },
  {
    id: 20, type: 'IMAGE', score: 61, likes: 16800, comments: 278, saves: 1700, shares: 390,
    date: '2024-07-08', engagement: 2.1,
    caption: 'Practicing 21 din tak subah 5 baje uthne ke results 🌅 What changed in my life... #5AMClub #MorningRoutine',
    topic: 'Lifestyle', color: 'from-sky-900 to-blue-800', emoji: '🌅',
  },
];

const FILTERS = ['All', 'Reels', 'Images', 'Carousels'];
const TOPICS = ['All Topics', 'Finance', 'Motivation', 'Food', 'Travel', 'Fitness', 'Tech', 'Comedy', 'Education', 'Entertainment', 'Business', 'Lifestyle'];

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

function scoreColor(s: number) {
  if (s >= 90) return 'text-green-400 bg-green-400/10';
  if (s >= 75) return 'text-yellow-400 bg-yellow-400/10';
  return 'text-zinc-400 bg-zinc-400/10';
}

function typeColor(t: string) {
  if (t === 'REEL') return 'bg-purple-500/20 text-purple-300';
  if (t === 'CAROUSEL') return 'bg-blue-500/20 text-blue-300';
  return 'bg-zinc-700 text-zinc-300';
}

export default function ContentLibraryPage() {
  const [filter, setFilter] = useState('All');
  const [topic, setTopic] = useState('All Topics');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [sort, setSort] = useState<'date' | 'likes' | 'score'>('date');

  const filtered = useMemo(() => {
    return INDIAN_POSTS
      .filter(p => {
        if (filter !== 'All') {
          const map: Record<string, string> = { Reels: 'REEL', Images: 'IMAGE', Carousels: 'CAROUSEL' };
          if (p.type !== map[filter]) return false;
        }
        if (topic !== 'All Topics' && p.topic !== topic) return false;
        if (search && !p.caption.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === 'likes') return b.likes - a.likes;
        if (sort === 'score') return b.score - a.score;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [filter, topic, search, sort]);

  return (
    <div className="max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Content Library</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{filtered.length} posts · Sample data — connect Instagram for real content</p>
        </div>
        <Link
          href="/onboarding/connect"
          className="text-sm bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors flex-shrink-0"
        >
          + Connect Instagram
        </Link>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Type filter */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors ${filter === f ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Topic filter */}
        <select
          value={topic}
          onChange={e => setTopic(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-300 focus:outline-none"
        >
          {TOPICS.map(t => <option key={t}>{t}</option>)}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value as typeof sort)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-300 focus:outline-none"
        >
          <option value="date">Newest First</option>
          <option value="likes">Most Liked</option>
          <option value="score">Top Score</option>
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[180px] bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:border-zinc-600"
        />

        {/* View toggle */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 ml-auto">
          <button onClick={() => setView('grid')} className={`px-3 py-1.5 rounded-md text-sm transition-colors ${view === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}>Grid</button>
          <button onClick={() => setView('table')} className={`px-3 py-1.5 rounded-md text-sm transition-colors ${view === 'table' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}>Table</button>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 text-zinc-500">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No posts match your filters</p>
          <button onClick={() => { setFilter('All'); setTopic('All Topics'); setSearch(''); }} className="mt-3 text-sm text-white underline">Clear filters</button>
        </div>
      )}

      {view === 'grid' && filtered.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(post => (
            <Link href={`/content/${post.id}`} key={post.id} className="group block">
              <div className={`aspect-[4/5] bg-gradient-to-br ${post.color} rounded-xl overflow-hidden relative mb-2 border border-white/5`}>
                {/* Emoji thumbnail */}
                <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-40">
                  {post.emoji}
                </div>

                {/* Type badge */}
                <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${typeColor(post.type)}`}>
                  {post.type}
                </div>

                {/* Score */}
                <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${scoreColor(post.score)}`}>
                  {post.score}
                </div>

                {/* Bottom stats */}
                <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/90 to-transparent">
                  <div className="flex justify-between items-end text-xs">
                    <div>
                      <div className="text-zinc-400">{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                      <div className="font-semibold text-white">{fmt(post.likes)} likes</div>
                    </div>
                    <div className="text-zinc-400">{post.engagement}% ER</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-2 group-hover:text-zinc-200 transition-colors leading-relaxed">
                {post.caption}
              </p>
            </Link>
          ))}
        </div>
      )}

      {view === 'table' && filtered.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-800/50 text-zinc-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 font-medium">Post</th>
                <th className="px-5 py-3 font-medium">Topic</th>
                <th className="px-5 py-3 font-medium">Format</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium text-right">Likes</th>
                <th className="px-5 py-3 font-medium text-right">Comments</th>
                <th className="px-5 py-3 font-medium text-right">Saves</th>
                <th className="px-5 py-3 font-medium text-right">ER%</th>
                <th className="px-5 py-3 font-medium text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filtered.map(post => (
                <tr key={post.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-5 py-3.5 max-w-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{post.emoji}</span>
                      <Link href={`/content/${post.id}`} className="hover:underline text-zinc-200 line-clamp-2 text-xs leading-relaxed">
                        {post.caption.slice(0, 80)}...
                      </Link>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-zinc-400">{post.topic}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor(post.type)}`}>{post.type}</span>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-400 text-xs">
                    {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium">{fmt(post.likes)}</td>
                  <td className="px-5 py-3.5 text-right text-zinc-300">{fmt(post.comments)}</td>
                  <td className="px-5 py-3.5 text-right text-zinc-300">{fmt(post.saves)}</td>
                  <td className="px-5 py-3.5 text-right text-zinc-300">{post.engagement}%</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`font-bold text-sm ${scoreColor(post.score)}`}>{post.score}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}