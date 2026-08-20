import type { 
  ContentIdeaResult, 
  HookResult, 
  CaptionResult, 
  RepurposedContent, 
  ProfileAnalysisResult, 
  PostAnalysisResult, 
  StrategistResponse, 
  WeeklyStrategyResult, 
  AIResult 
} from './types'

export interface AIProviderInterface {
  readonly name: string
  readonly isConfigured: boolean
  
  generateContentIdeas(params: {
    topic: string
    format: string
    goal: string
    audience: string
    tone: string
    accountContext: AccountContext
    count: number
  }): Promise<AIResult<ContentIdeaResult[]>>
  
  generateHooks(params: {
    topic: string
    audience: string
    tone: string
    types: HookResult['type'][]
    accountContext: AccountContext
  }): Promise<AIResult<HookResult[]>>
  
  generateCaption(params: {
    topic: string
    platform: string
    audience: string
    tone: string
    goal: string
    length: 'SHORT' | 'MEDIUM' | 'LONG'
    accountContext: AccountContext
  }): Promise<AIResult<CaptionResult>>
  
  repurposeContent(params: {
    originalContent: string
    originalFormat: string
    targetPlatforms: string[]
    accountContext: AccountContext
  }): Promise<AIResult<RepurposedContent[]>>
  
  analyzeProfile(params: {
    username: string
    bio: string
    website: string
    niche: string
    followerCount: number
    engagementRate: number
    accountContext: AccountContext
  }): Promise<AIResult<ProfileAnalysisResult>>
  
  analyzePost(params: {
    post: { caption: string; format: string; publishedAt: Date; topic: string }
    metrics: { engagementRate: number; reach: number; saves: number; shares: number; comments: number }
    baseline: { avgEngagementRate: number; avgReach: number }
    accountContext: AccountContext
  }): Promise<AIResult<PostAnalysisResult>>
  
  chat(params: {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
    systemContext: string
    accountContext: AccountContext
  }): Promise<AIResult<StrategistResponse>>
  
  generateWeeklyStrategy(params: {
    accountContext: AccountContext
    recentPerformance: any
    recommendations: any[]
  }): Promise<AIResult<WeeklyStrategyResult>>
  
  explainScore(params: {
    scoreType: 'profile' | 'health' | 'performance' | 'opportunity'
    score: number
    categories: Record<string, number>
    accountContext: AccountContext
    simple: boolean
  }): Promise<AIResult<{ explanation: string; keyInsights: string[] }>>
}

export interface AccountContext {
  niche: string
  subNiche?: string
  targetAudience: string
  mainGoal: string
  contentStyle: string
  platform: string
  profileScore?: number
  healthScore?: number
  followerCount?: number
  engagementRate?: number
  bestPerformingFormat?: string
  bestPerformingTopic?: string
  contentPillars?: Array<{ name: string; targetPercentage: number }>
  recentTopics?: string[]
}
