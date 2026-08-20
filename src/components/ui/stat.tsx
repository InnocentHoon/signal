import React from 'react';
import { DataSourceBadge } from './data-source-badge';

export interface StatProps {
  label: string;
  value: string | number;
  change?: number;
  source?: 'CONNECTED' | 'PUBLIC' | 'IMPORTED' | 'CALCULATED' | 'PREDICTED' | 'UNAVAILABLE';
  className?: string;
}

export function Stat({ label, value, change, source, className = '' }: StatProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="stat-label">{label}</span>
        {source && <DataSourceBadge source={source} />}
      </div>
      <div className="flex items-baseline space-x-2 mt-1">
        <span className="text-2xl font-semibold tracking-tight text-text-primary mono-text">{value}</span>
        {change !== undefined && (
          <span className={`text-xs font-medium flex items-center ${isPositive ? 'text-accent-emerald' : isNegative ? 'text-accent-rose' : 'text-text-muted'}`}>
            {isPositive && '↑'}
            {isNegative && '↓'}
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
    </div>
  );
}
