'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface EngagementChartProps {
  data: any[];
}

export function EngagementChart({ data }: EngagementChartProps) {
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
          <p className="text-text-primary font-mono font-medium flex items-center gap-2">
            Engagement: <span className="text-accent-violet">{payload[0].value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container flex flex-col">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="text-sm font-medium text-text-primary">Engagement Rate</h3>
      </div>
      
      <div className="flex-1 min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-violet)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent-violet)" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
              tickFormatter={(val) => `${val}%`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-accent)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
              type="monotone" 
              dataKey="rate" 
              stroke="var(--accent-violet)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorEngagement)" 
              activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--accent-violet)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
