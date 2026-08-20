import React from 'react';
import { Badge } from './badge';

type DataSource = 'CONNECTED' | 'PUBLIC' | 'IMPORTED' | 'CALCULATED' | 'PREDICTED' | 'UNAVAILABLE';

export interface DataSourceBadgeProps {
  source: DataSource;
  className?: string;
}

export function DataSourceBadge({ source, className = '' }: DataSourceBadgeProps) {
  const variantMap: Record<DataSource, any> = {
    CONNECTED: 'connected',
    PUBLIC: 'public',
    IMPORTED: 'imported',
    CALCULATED: 'calculated',
    PREDICTED: 'predicted',
    UNAVAILABLE: 'unavailable',
  };

  return (
    <Badge variant={variantMap[source]} className={className}>
      {source}
    </Badge>
  );
}
