'use client';

import React from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { CommandPalette } from '@/components/layout/command-palette';
import { Bell, RefreshCw, Slash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = pathname?.split('/')[1] || 'Dashboard';
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <CommandPalette />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6 bg-surface z-10">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted capitalize">Signal</span>
            <Slash className="h-3 w-3 text-border-accent -rotate-12" />
            <h1 className="text-sm font-medium text-text-primary capitalize">{title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center mr-4 text-xs text-text-muted border border-border bg-elevated px-2 py-1 rounded">
              Press <kbd className="mx-1 font-mono text-text-primary">/</kbd> for commands
            </div>
            
            <button className="relative text-text-secondary hover:text-text-primary transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent-blue border-2 border-surface"></span>
            </button>
            
            <Button variant="outline" size="sm" leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
              Sync Data
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto scrollbar-thin p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
