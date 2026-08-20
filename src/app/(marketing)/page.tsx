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