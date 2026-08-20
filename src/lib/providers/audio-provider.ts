export interface AudioTrendItem {
  trackName: string
  artistName: string
  trendScore: number // 0-100
  usageCount: number | null
  category: 'VIRAL' | 'RISING' | 'BACKGROUND' | 'STORY_SPECIFIC'
  recommendedAction: string
  platform: string
  lastUpdatedAt: Date
}

export interface AudioProvider {
  readonly name: string
  readonly isConfigured: boolean
  fetchAudioTrends(params: { niche: string; region?: string; maxResults?: number }): Promise<AudioTrendItem[] | null>
}
