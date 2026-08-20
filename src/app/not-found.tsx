import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-zinc-800 mb-4 select-none">404</div>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-zinc-400 mb-8">
          This page doesn't exist or was moved. Let's get you back on track.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/dashboard"
            className="bg-white text-black font-medium px-6 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="border border-zinc-800 text-zinc-300 font-medium px-6 py-2.5 rounded-lg hover:bg-zinc-900 transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
