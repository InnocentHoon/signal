import { TrendItem, TrendProvider } from './trend-provider';
import { google } from 'googleapis';

interface CacheEntry {
  data: TrendItem[];
  timestamp: number;
}

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export class YouTubeTrendProvider implements TrendProvider {
  public readonly name = 'YouTube';
  private cache: Map<string, CacheEntry> = new Map();

  get isConfigured(): boolean {
    return !!process.env.YOUTUBE_API_KEY;
  }

  async fetchTrends(params: { niche: string; region?: string; maxResults?: number }): Promise<TrendItem[] | null> {
    if (!this.isConfigured) return null;

    const cacheKey = `${params.niche}-${params.region || 'global'}-${params.maxResults || 20}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      const youtube = google.youtube({
        version: 'v3',
        auth: process.env.YOUTUBE_API_KEY,
      });

      const publishedAfter = new Date();
      publishedAfter.setDate(publishedAfter.getDate() - 30);

      const searchResponse = await youtube.search.list({
        part: ['snippet'],
        q: `${params.niche} trending`,
        type: ['video'],
        order: 'relevance',
        publishedAfter: publishedAfter.toISOString(),
        maxResults: Math.min(params.maxResults || 20, 50),
      });

      const videoIds = searchResponse.data.items?.map(item => item.id?.videoId).filter(Boolean) as string[];
      if (!videoIds || videoIds.length === 0) return [];

      const statsResponse = await youtube.videos.list({
        part: ['statistics', 'snippet'],
        id: videoIds,
      });

      const trends: TrendItem[] = (statsResponse.data.items || []).map(video => {
        const views = parseInt(video.statistics?.viewCount || '0', 10);
        const title = video.snippet?.title || '';
        
        let category: TrendItem['category'] = 'RISING';
        let score = 50;
        if (views > 1000000) {
          category = 'TRENDING';
          score = 90;
        } else if (views < 10000) {
          category = 'NICHE_SPECIFIC';
          score = 40;
        }

        return {
          topic: title.split('|')[0].trim() || title,
          category,
          trendScore: score,
          growth: null,
          competition: null,
          nicheRelevance: 80,
          recommendedAction: `Create content around "${title.substring(0, 30)}..." format`,
          platform: 'YouTube',
          dataSource: 'YouTube Data API v3',
          lastUpdatedAt: new Date(),
        };
      });

      this.cache.set(cacheKey, { data: trends, timestamp: Date.now() });
      return trends;
    } catch (error) {
      console.error('YouTube API Error:', error);
      return null;
    }
  }
}
