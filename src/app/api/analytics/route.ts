import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const querySchema = z.object({
  period: z.enum(['7d', '30d', '90d', '6m', '1y']).default('30d'),
});

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parsed = querySchema.safeParse({ period: searchParams.get('period') || '30d' });
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid period' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.id },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Since we need to query ContentPost and ContentMetric, ensure you have these models in Prisma.
    // Returning dummy fallback matching the requested empty-state shape.
    const posts = await prisma.contentPost.findMany({
      where: { userId: user.id },
      include: { metrics: true },
    });

    if (posts.length === 0) {
      return NextResponse.json({ hasData: false });
    }

    // In a real scenario, calculate real growth, engagement, reach
    return NextResponse.json({
      hasData: true,
      followerGrowth: 0,
      engagementRate: 0,
      totalReach: 0,
      postCount: posts.length,
      topPosts: posts.slice(0, 5),
      chartData: []
    });

  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
