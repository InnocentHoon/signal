export interface TrendItem {
  topic: string
  category: 'RISING' | 'TRENDING' | 'DECLINING' | 'NICHE_SPECIFIC' | 'EMERGING'
  trendScore: number // 0-100
  growth: number | null
  competition: number | null
  nicheRelevance: number | null
  recommendedAction: string
  platform: string
  dataSource: string
  lastUpdatedAt: Date
}

export interface TrendProvider {
  readonly name: string
  readonly isConfigured: boolean
  fetchTrends(params: { niche: string; region?: string; maxResults?: number }): Promise<TrendItem[] | null>
}
