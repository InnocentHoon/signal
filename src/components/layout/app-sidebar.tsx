'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Search, 
  BarChart3, 
  FileText, 
  Radar, 
  Lightbulb, 
  TrendingUp, 
  Headphones, 
  Calendar as CalendarIcon, 
  Swords, 
  Maximize, 
  BrainCircuit, 
  Files, 
  Settings,
  LogOut,
} from 'lucide-react';

const mainNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analyze', href: '/analyze', icon: Search },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

const contentNavigation = [
  { name: 'Content', href: '/content', icon: FileText },
  { name: 'Content Radar', href: '/radar', icon: Radar },
  { name: 'Ideas', href: '/ideas', icon: Lightbulb },
  { name: 'Trends', href: '/trends', icon: TrendingUp },
  { name: 'Audio', href: '/audio', icon: Headphones },
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
];

const strategyNavigation = [
  { name: 'Competitors', href: '/competitors', icon: Swords },
  { name: 'Gaps', href: '/gaps', icon: Maximize },
  { name: 'Strategist', href: '/strategist', icon: BrainCircuit },
  { name: 'Reports', href: '/reports', icon: Files },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const displayName = session?.user?.name || session?.user?.email?.split('@')[0] || 'You';
  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const renderNavGroup = (items: { name: string; href: string; icon: React.ElementType }[], title?: string) => (
    <div className="mb-6">
      {title && (
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          {title}
        </p>
      )}
      <nav className="space-y-0.5">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm rounded-sm transition-colors ${
                isActive
                  ? 'bg-surface text-text-primary font-medium'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'
              }`}
            >
              <item.icon className={`mr-3 h-4 w-4 flex-shrink-0 ${isActive ? 'text-text-primary' : 'text-text-muted'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="flex h-full flex-col bg-background border-r border-border w-56">
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-border flex-shrink-0">
        <span className="text-lg font-bold tracking-tight text-text-primary">SIGNAL</span>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto scrollbar-thin py-4">
        {renderNavGroup(mainNavigation)}
        {renderNavGroup(contentNavigation, 'Content')}
        {renderNavGroup(strategyNavigation, 'Intelligence')}
      </div>

      {/* User section — reads from real session */}
      <div className="mt-auto border-t border-border p-4 space-y-1">
        <Link
          href="/settings"
          className="flex items-center px-2 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface transition-colors rounded-sm"
        >
          <Settings className="mr-3 h-4 w-4 text-text-muted" />
          Settings
        </Link>

        <div className="flex items-center justify-between px-2 py-3 mt-2 rounded-sm bg-surface/50 border border-border">
          <div className="flex items-center min-w-0">
            <div className="h-8 w-8 rounded bg-elevated border border-border flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {initials}
            </div>
            <div className="ml-3 flex flex-col min-w-0">
              <span className="text-xs font-medium text-text-primary truncate">{displayName}</span>
              <span className="text-[10px] text-text-muted">Free Plan</span>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            title="Sign out"
            className="ml-2 p-1 text-text-muted hover:text-text-primary transition-colors flex-shrink-0"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
