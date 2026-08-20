import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { getTrendProvider } from '@/lib/providers';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.id },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const provider = getTrendProvider();
    const trends = await provider.fetchTrends({ niche: user.profile?.niche || 'General', maxResults: 5 });

    // Deterministic opportunity generation
    const opportunities = (trends || []).map((trend, i) => ({
      id: `opp_${i}`,
      title: `Capitalize on ${trend.topic}`,
      description: trend.recommendedAction,
      score: trend.trendScore,
      category: trend.category,
      tags: [trend.platform, trend.dataSource],
    })).sort((a, b) => b.score - a.score);

    return NextResponse.json({
      data: opportunities,
    });

  } catch (error) {
    console.error('Radar API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
