import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAIProvider, buildAccountContext } from '@/lib/ai'

const ideaSchema = z.object({
  topic: z.string().min(1),
  format: z.string().min(1),
  goal: z.string().min(1),
  audience: z.string().min(1),
  tone: z.string().min(1),
  count: z.number().min(1).max(20),
  accountContext: z.any() // Should ideally be validated against AccountContext schema
})

export async function POST(req: Request) {
  try {
    // Note: Add proper authentication check here in production
    // const session = await auth()
    // if (!session) return new NextResponse('Unauthorized', { status: 401 })

    const body = await req.json()
    const parsed = ideaSchema.parse(body)

    const provider = getAIProvider()
    const result = await provider.generateContentIdeas({
      topic: parsed.topic,
      format: parsed.format,
      goal: parsed.goal,
      audience: parsed.audience,
      tone: parsed.tone,
      count: parsed.count,
      accountContext: parsed.accountContext
    })

    if (!result.success) {
      const statusMap: Record<string, number> = {
        'NOT_CONFIGURED': 503,
        'RATE_LIMIT': 429,
        'API_ERROR': 502,
        'INVALID_RESPONSE': 500,
        'SAFETY_FILTER': 400
      }
      return NextResponse.json(
        { error: result.error.message, code: result.error.code }, 
        { status: statusMap[result.error.code] || 500 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
