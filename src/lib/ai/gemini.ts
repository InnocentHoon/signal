import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import type { AIProviderInterface, AccountContext } from './provider'
import type { 
  AIResult, 
  ContentIdeaResult, 
  HookResult, 
  CaptionResult, 
  RepurposedContent, 
  ProfileAnalysisResult, 
  PostAnalysisResult, 
  StrategistResponse, 
  WeeklyStrategyResult,
  AIError
} from './types'

export class GeminiProvider implements AIProviderInterface {
  readonly name = 'gemini'
  
  get isConfigured(): boolean {
    return !!process.env.GEMINI_API_KEY
  }

  private getClient() {
    if (!this.isConfigured) {
      throw new Error('NOT_CONFIGURED')
    }
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  }

  private getModel(instruction?: string) {
    const client = this.getClient()
    return client.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        }
      ],
      systemInstruction: instruction
    })
  }

  private handleError(error: any): AIResult<any> {
    if (error.message === 'NOT_CONFIGURED') {
      return { 
        success: false, 
        error: { 
          code: 'NOT_CONFIGURED', 
          message: 'AI features require a Gemini API key. Configure GEMINI_API_KEY in your environment.' 
        } 
      }
    }
    
    if (error.status === 429 || error.message?.includes('429')) {
      return {
        success: false,
        error: { code: 'RATE_LIMIT', message: 'Rate limit exceeded. Please try again later.' }
      }
    }

    if (error.message?.includes('SAFETY') || error.response?.promptFeedback?.blockReason) {
      return {
        success: false,
        error: { code: 'SAFETY_FILTER', message: 'The request or response was blocked by safety filters.' }
      }
    }

    return {
      success: false,
      error: { code: 'API_ERROR', message: error.message || 'An unexpected error occurred with the AI API.' }
    }
  }

  private buildContextString(ctx: AccountContext): string {
    return `
Account Context:
- Platform: ${ctx.platform}
- Niche: ${ctx.niche}${ctx.subNiche ? ` (${ctx.subNiche})` : ''}
- Target Audience: ${ctx.targetAudience}
- Main Goal: ${ctx.mainGoal}
- Content Style: ${ctx.contentStyle}
${ctx.followerCount ? `- Followers: ${ctx.followerCount}` : ''}
${ctx.engagementRate ? `- Engagement Rate: ${ctx.engagementRate}%` : ''}
${ctx.bestPerformingFormat ? `- Best Format: ${ctx.bestPerformingFormat}` : ''}
${ctx.bestPerformingTopic ? `- Best Topic: ${ctx.bestPerformingTopic}` : ''}
`.trim()
  }

  private async generateJSON<T>(instruction: string, prompt: string): Promise<AIResult<T>> {
    try {
      const model = this.getModel(instruction + "\n\nCRITICAL: Respond ONLY with valid, raw JSON. Do not wrap in markdown tags like ```json. Do not include any other text.")
      const result = await model.generateContent(prompt)
      const text = result.response.text()
      
      try {
        let cleanText = text.trim()
        if (cleanText.startsWith('```json')) cleanText = cleanText.substring(7)
        if (cleanText.startsWith('```')) cleanText = cleanText.substring(3)
        if (cleanText.endsWith('```')) cleanText = cleanText.substring(0, cleanText.length - 3)
        cleanText = cleanText.trim()
        
        const data = JSON.parse(cleanText) as T
        return { success: true, data }
      } catch (parseError) {
        return {
          success: false,
          error: { code: 'INVALID_RESPONSE', message: 'The AI returned invalid JSON structure.' }
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  async generateContentIdeas(params: {
    topic: string
    format: string
    goal: string
    audience: string
    tone: string
    accountContext: AccountContext
    count: number
  }): Promise<AIResult<ContentIdeaResult[]>> {
    const instruction = `You are a senior creative director and content strategy expert for a ${params.accountContext.niche} creator.
${this.buildContextString(params.accountContext)}
Generate ${params.count} specific content ideas.
Each idea must be specific to this creator's niche and audience.
Do NOT use: 'unlock', 'game-changing', 'in today's digital landscape', 'take your content to the next level'.
Write like a human expert, not a generic AI tool.`

    const prompt = `Topic: ${params.topic}
Format: ${params.format}
Goal: ${params.goal}
Tone: ${params.tone}
Audience: ${params.audience}

Return a JSON array of objects with the following schema:
[{
  "title": "string",
  "hook": "string",
  "concept": "string",
  "format": "string",
  "topic": "string",
  "whyItFits": "string",
  "opportunityScore": number (50-95),
  "cta": "string",
  "caption": "string",
  "audioDirection": "string",
  "estimatedEffort": "LOW" | "MEDIUM" | "HIGH"
}]`

    return this.generateJSON<ContentIdeaResult[]>(instruction, prompt)
  }

  async generateHooks(params: {
    topic: string
    audience: string
    tone: string
    types: HookResult['type'][]
    accountContext: AccountContext
  }): Promise<AIResult<HookResult[]>> {
    const instruction = `You are a viral hook writing expert for a ${params.accountContext.niche} creator.
${this.buildContextString(params.accountContext)}
Write like a human expert, direct and punchy.`

    const prompt = `Topic: ${params.topic}
Audience: ${params.audience}
Tone: ${params.tone}
Requested Types: ${params.types.join(', ')}

Return a JSON array of objects with the following schema:
[{
  "type": "CURIOSITY" | "CONTRARIAN" | "QUESTION" | "EDUCATIONAL" | "STORY" | "TRANSFORMATION" | "AUTHORITY" | "FOMO",
  "hook": "string",
  "explanation": "string"
}]`

    return this.generateJSON<HookResult[]>(instruction, prompt)
  }

  async generateCaption(params: {
    topic: string
    platform: string
    audience: string
    tone: string
    goal: string
    length: 'SHORT' | 'MEDIUM' | 'LONG'
    accountContext: AccountContext
  }): Promise<AIResult<CaptionResult>> {
    const instruction = `You are a social media copywriting expert.
${this.buildContextString(params.accountContext)}`

    const prompt = `Topic: ${params.topic}
Platform: ${params.platform}
Length: ${params.length}
Tone: ${params.tone}
Goal: ${params.goal}
Audience: ${params.audience}

Return a JSON object with this schema:
{
  "caption": "string",
  "cta": "string",
  "hashtagSuggestions": ["string"],
  "tone": "string",
  "wordCount": number
}`

    return this.generateJSON<CaptionResult>(instruction, prompt)
  }

  async repurposeContent(params: {
    originalContent: string
    originalFormat: string
    targetPlatforms: string[]
    accountContext: AccountContext
  }): Promise<AIResult<RepurposedContent[]>> {
    const instruction = `You are an expert content repurposer.
${this.buildContextString(params.accountContext)}`

    const prompt = `Original Format: ${params.originalFormat}
Original Content: ${params.originalContent}
Target Platforms: ${params.targetPlatforms.join(', ')}

Return a JSON array with this schema:
[{
  "platform": "string",
  "format": "string",
  "content": "string",
  "adaptationNotes": "string"
}]`

    return this.generateJSON<RepurposedContent[]>(instruction, prompt)
  }

  async analyzeProfile(params: {
    username: string
    bio: string
    website: string
    niche: string
    followerCount: number
    engagementRate: number
    accountContext: AccountContext
  }): Promise<AIResult<ProfileAnalysisResult>> {
    const instruction = `You are a profile optimization specialist.
${this.buildContextString(params.accountContext)}`

    const prompt = `Username: ${params.username}
Bio: ${params.bio}
Website: ${params.website}
Niche: ${params.niche}
Followers: ${params.followerCount}
Engagement Rate: ${params.engagementRate}%

Return a JSON object with this schema:
{
  "currentState": "string",
  "strengths": ["string"],
  "problems": ["string"],
  "recommendations": ["string"],
  "bioRewrite": "string",
  "ctaRewrite": "string"
}`

    return this.generateJSON<ProfileAnalysisResult>(instruction, prompt)
  }

  async analyzePost(params: {
    post: { caption: string; format: string; publishedAt: Date; topic: string }
    metrics: { engagementRate: number; reach: number; saves: number; shares: number; comments: number }
    baseline: { avgEngagementRate: number; avgReach: number }
    accountContext: AccountContext
  }): Promise<AIResult<PostAnalysisResult>> {
    const instruction = `You are a social media data analyst.
${this.buildContextString(params.accountContext)}`

    const prompt = `Post: ${JSON.stringify(params.post)}
Metrics: ${JSON.stringify(params.metrics)}
Baseline: ${JSON.stringify(params.baseline)}

Return a JSON object with this schema:
{
  "likelyReasons": ["string"],
  "evidence": ["string"],
  "whatWentWrong": "string",
  "whatToChange": ["string"],
  "howToRemake": "string"
}`

    return this.generateJSON<PostAnalysisResult>(instruction, prompt)
  }

  async chat(params: {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
    systemContext: string
    accountContext: AccountContext
  }): Promise<AIResult<StrategistResponse>> {
    const instruction = `You are an elite AI social media strategist.
${params.systemContext}
${this.buildContextString(params.accountContext)}`

    const prompt = `Chat History:\n${params.messages.map(m => `${m.role}: ${m.content}`).join('\n')}

Based on the conversation, provide your response.
Return a JSON object with this schema:
{
  "message": "string",
  "actionItems": ["string"],
  "dataUsed": ["string"]
}`

    return this.generateJSON<StrategistResponse>(instruction, prompt)
  }

  async generateWeeklyStrategy(params: {
    accountContext: AccountContext
    recentPerformance: any
    recommendations: any[]
  }): Promise<AIResult<WeeklyStrategyResult>> {
    const instruction = `You are a lead content strategist creating a weekly plan.
${this.buildContextString(params.accountContext)}`

    const prompt = `Recent Performance: ${JSON.stringify(params.recentPerformance)}
Recommendations: ${JSON.stringify(params.recommendations)}

Return a JSON object with this schema:
{
  "accountHealthSummary": "string",
  "whatWorked": ["string"],
  "whatChanged": ["string"],
  "whatFailed": ["string"],
  "biggestOpportunity": "string",
  "recommendedTopics": ["string"],
  "recommendedFormats": ["string"],
  "recommendedSchedule": [
    { "day": "string", "time": "string", "format": "string", "topic": "string" }
  ],
  "nextActions": ["string"]
}`

    return this.generateJSON<WeeklyStrategyResult>(instruction, prompt)
  }

  async explainScore(params: {
    scoreType: 'profile' | 'health' | 'performance' | 'opportunity'
    score: number
    categories: Record<string, number>
    accountContext: AccountContext
    simple: boolean
  }): Promise<AIResult<{ explanation: string; keyInsights: string[] }>> {
    const instruction = `You are a clear, concise data communicator.
${this.buildContextString(params.accountContext)}`

    const prompt = `Score Type: ${params.scoreType}
Score: ${params.score}
Categories: ${JSON.stringify(params.categories)}
Mode: ${params.simple ? 'Simple (for beginners)' : 'Advanced (detailed metrics)'}

Return a JSON object with this schema:
{
  "explanation": "string",
  "keyInsights": ["string"]
}`

    return this.generateJSON<{ explanation: string; keyInsights: string[] }>(instruction, prompt)
  }
}
