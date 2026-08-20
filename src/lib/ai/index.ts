import { GeminiProvider } from './gemini'
import type { AIProviderInterface, AccountContext } from './provider'

let _provider: AIProviderInterface | null = null

export function getAIProvider(): AIProviderInterface {
  if (!_provider) {
    _provider = new GeminiProvider()
  }
  return _provider
}

export function buildAccountContext(profile: any, connection: any, analytics: any): AccountContext {
  return {
    niche: profile?.niche || 'General',
    subNiche: profile?.subNiche,
    targetAudience: profile?.targetAudience || 'General Audience',
    mainGoal: profile?.mainGoal || 'Growth',
    contentStyle: profile?.contentStyle || 'Authentic',
    platform: connection?.platform || 'Instagram',
    profileScore: analytics?.profileScore,
    healthScore: analytics?.healthScore,
    followerCount: connection?.followerCount,
    engagementRate: analytics?.engagementRate,
    bestPerformingFormat: analytics?.bestPerformingFormat,
    bestPerformingTopic: analytics?.bestPerformingTopic,
    contentPillars: profile?.contentPillars || [],
    recentTopics: analytics?.recentTopics || []
  }
}
