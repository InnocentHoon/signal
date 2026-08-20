import React from 'react';

export interface ScoreRingProps {
  score: number;
  max?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ScoreRing({ score, max = 10, label, size = 'md', className = '' }: ScoreRingProps) {
  const radiusMap = {
    sm: 30,
    md: 45,
    lg: 60
  };
  const strokeMap = {
    sm: 4,
    md: 6,
    lg: 8
  };
  
  const r = radiusMap[size];
  const strokeWidth = strokeMap[size];
  const cx = r + strokeWidth;
  const cy = r + strokeWidth;
  const circumference = 2 * Math.PI * r;
  const percent = score / max;
  const dashoffset = circumference * (1 - percent);
  
  // Determine color based on score ratio
  const ratio = score / max;
  let colorClass = 'text-accent-rose'; // < 0.4
  if (ratio >= 0.8) colorClass = 'text-accent-emerald';
  else if (ratio >= 0.6) colorClass = 'text-accent-blue';
  else if (ratio >= 0.4) colorClass = 'text-accent-amber';

  const svgSize = (r + strokeWidth) * 2;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        {/* Background circle */}
        <svg width={svgSize} height={svgSize} className="transform -rotate-90">
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-elevated"
          />
          {/* Foreground animated circle */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            className={`${colorClass} score-ring-circle`}
            style={{ '--stroke-percent': dashoffset } as React.CSSProperties}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl md:text-2xl font-bold mono-text">{score.toFixed(1)}</span>
        </div>
      </div>
      {label && <span className="mt-4 stat-label">{label}</span>}
    </div>
  );
}
