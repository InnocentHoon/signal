'use client';

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface FollowerChartProps {
  data: any[];
  period?: '7d' | '30d' | '90d';
  onPeriodChange?: (period: '7d' | '30d' | '90d') => void;
}

export function FollowerChart({ data, period = '30d', onPeriodChange }: FollowerChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container flex items-center justify-center">
        <p className="text-text-muted text-sm">No data available for this period.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-elevated border border-border p-3 shadow-lg rounded-sm text-sm">
          <p className="text-text-secondary mb-1">{label}</p>
          <p className="text-text-primary font-mono font-medium">
            {payload[0].value.toLocaleString()} followers
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container flex flex-col">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="text-sm font-medium text-text-primary">Follower Growth</h3>
        {onPeriodChange && (
          <div className="flex space-x-1 bg-elevated border border-border p-0.5 rounded-sm">
            {(['7d', '30d', '90d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={`px-2 py-1 text-xs font-medium rounded-sm transition-colors ${
                  period === p 
                    ? 'bg-surface text-text-primary shadow-sm border border-border' 
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="var(--text-muted)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="var(--text-muted)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-accent)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Line 
              type="monotone" 
              dataKey="followers" 
              stroke="var(--accent-blue)" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--accent-blue)' }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
