'use client';

import React, { useState, useEffect } from 'react';
import { Search, Command, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CommandItem {
  id: string;
  name: string;
  shortcut?: string;
  action: () => void;
  group: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const commands: CommandItem[] = [
    { id: '1', name: 'Analyze account', group: 'Actions', action: () => router.push('/analyze') },
    { id: '2', name: 'Sync Instagram', group: 'Actions', action: () => console.log('Syncing...') },
    { id: '3', name: 'Open Content Radar', group: 'Navigation', action: () => router.push('/radar') },
    { id: '4', name: 'Generate ideas', group: 'Actions', action: () => router.push('/ideas/new') },
    { id: '5', name: 'Create weekly strategy', group: 'Actions', action: () => router.push('/strategist/new') },
    { id: '6', name: 'Ask SIGNAL Strategist', group: 'Intelligence', action: () => router.push('/strategist') },
    { id: '7', name: 'Settings', group: 'Account', action: () => router.push('/settings') },
  ];

  const filteredCommands = query === '' 
    ? commands 
    : commands.filter((command) => command.name.toLowerCase().includes(query.toLowerCase()));

  const groups = Array.from(new Set(filteredCommands.map(c => c.group)));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[20vh]">
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={() => setIsOpen(false)}
      />
      
      <div className="relative w-full max-w-lg overflow-hidden border border-border bg-surface shadow-2xl rounded-md animate-fade-in">
        <div className="flex items-center border-b border-border px-3 py-2">
          <Search className="h-4 w-4 text-text-muted mr-2" />
          <input
            className="flex h-10 w-full bg-transparent text-sm outline-none placeholder:text-text-muted text-text-primary"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div className="flex items-center gap-1 text-[10px] text-text-muted font-medium bg-elevated px-1.5 py-0.5 rounded border border-border">
            ESC
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-sm text-text-muted">No results found.</div>
          ) : (
            groups.map(group => (
              <div key={group} className="mb-4 last:mb-0">
                <div className="px-2 py-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  {group}
                </div>
                {filteredCommands.filter(c => c.group === group).map(command => (
                  <button
                    key={command.id}
                    className="flex w-full items-center justify-between rounded px-2 py-2 text-sm text-text-secondary hover:bg-elevated hover:text-text-primary focus:bg-elevated focus:text-text-primary focus:outline-none text-left"
                    onClick={() => {
                      command.action();
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <Command className="mr-2 h-4 w-4 opacity-50" />
                      {command.name}
                    </div>
                    {command.shortcut && (
                      <span className="text-xs text-text-muted bg-base px-1 border border-border rounded">
                        {command.shortcut}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
        <div className="border-t border-border bg-elevated px-4 py-2 text-xs text-text-muted flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Use</span>
            <kbd className="bg-base border border-border px-1.5 rounded">↑</kbd>
            <kbd className="bg-base border border-border px-1.5 rounded">↓</kbd>
            <span>to navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="bg-base border border-border px-1.5 rounded">Enter</kbd>
            <span>to select</span>
          </div>
        </div>
      </div>
    </div>
  );
}
