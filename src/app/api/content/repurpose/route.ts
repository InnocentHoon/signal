import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAIProvider } from '@/lib/ai'

const repurposeSchema = z.object({
  originalContent: z.string().min(1),
  originalFormat: z.string().min(1),
  targetPlatforms: z.array(z.string()).min(1),
  accountContext: z.any()
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = repurposeSchema.parse(body)

    const provider = getAIProvider()
    const result = await provider.repurposeContent(parsed)

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
