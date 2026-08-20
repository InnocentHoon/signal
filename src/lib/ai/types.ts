export type AIProvider = 'gemini' | 'openai'

export interface ContentIdeaResult {
  title: string
  hook: string
  concept: string
  format: string
  topic: string
  whyItFits: string
  opportunityScore: number
  cta: string
  caption: string
  audioDirection: string
  estimatedEffort: 'LOW' | 'MEDIUM' | 'HIGH'
}

export interface HookResult {
  type: 'CURIOSITY' | 'CONTRARIAN' | 'QUESTION' | 'EDUCATIONAL' | 'STORY' | 'TRANSFORMATION' | 'AUTHORITY' | 'FOMO'
  hook: string
  explanation: string
}

export interface CaptionResult {
  caption: string
  cta: string
  hashtagSuggestions: string[]
  tone: string
  wordCount: number
}

export interface RepurposedContent {
  platform: string
  format: string
  content: string
  adaptationNotes: string
}

export interface ProfileAnalysisResult {
  currentState: string
  strengths: string[]
  problems: string[]
  recommendations: string[]
  bioRewrite?: string
  ctaRewrite?: string
}

export interface PostAnalysisResult {
  likelyReasons: string[]
  evidence: string[]
  whatWentWrong: string
  whatToChange: string[]
  howToRemake: string
}

export interface StrategistResponse {
  message: string
  actionItems: string[]
  dataUsed: string[]
}

export interface WeeklyStrategyResult {
  accountHealthSummary: string
  whatWorked: string[]
  whatChanged: string[]
  whatFailed: string[]
  biggestOpportunity: string
  recommendedTopics: string[]
  recommendedFormats: string[]
  recommendedSchedule: Array<{ day: string; time: string; format: string; topic: string }>
  nextActions: string[]
}

export interface AIError {
  code: 'NOT_CONFIGURED' | 'RATE_LIMIT' | 'API_ERROR' | 'INVALID_RESPONSE' | 'SAFETY_FILTER'
  message: string
  retryAfter?: number
}

export type AIResult<T> = 
  | { success: true; data: T }
  | { success: false; error: AIError }
