import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAIProvider } from '@/lib/ai'

const hookSchema = z.object({
  topic: z.string().min(1),
  audience: z.string().min(1),
  tone: z.string().min(1),
  types: z.array(z.enum(['CURIOSITY', 'CONTRARIAN', 'QUESTION', 'EDUCATIONAL', 'STORY', 'TRANSFORMATION', 'AUTHORITY', 'FOMO'])).min(1),
  accountContext: z.any()
})

export async function POST(req: Request) {
  try {
    // Auth check here
    
    const body = await req.json()
    const parsed = hookSchema.parse(body)

    const provider = getAIProvider()
    const result = await provider.generateHooks(parsed)

    if (!result.success) {
      const statusMap: Record<string, number> = {
        'NOT_CONFIGURED': 503, 'RATE_LIMIT': 429, 'API_ERROR': 502,
        'INVALID_RESPONSE': 500, 'SAFETY_FILTER': 400
      }
      return NextResponse.json({ error: result.error.message }, { status: statusMap[result.error.code] || 500 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
