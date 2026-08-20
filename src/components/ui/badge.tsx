import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'connected' | 'public' | 'imported' | 'calculated' | 'predicted' | 'unavailable' | 'success' | 'warning' | 'error' | 'info';
}

export function Badge({ className = '', variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-elevated text-text-secondary border-border',
    connected: 'bg-blue-500/10 text-accent-blue border-blue-500/20',
    public: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    imported: 'bg-amber-500/10 text-accent-amber border-amber-500/20',
    calculated: 'bg-violet-500/10 text-accent-violet border-violet-500/20',
    predicted: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    unavailable: 'bg-rose-500/10 text-accent-rose border-rose-500/20',
    success: 'bg-emerald-500/10 text-accent-emerald border-emerald-500/20',
    warning: 'bg-amber-500/10 text-accent-amber border-amber-500/20',
    error: 'bg-rose-500/10 text-accent-rose border-rose-500/20',
    info: 'bg-blue-500/10 text-accent-blue border-blue-500/20',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-medium uppercase tracking-wider border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
