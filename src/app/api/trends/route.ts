import { NextResponse } from 'next/server';
import { getTrendProvider } from '@/lib/providers';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';

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

    const niche = user?.profile?.niche || 'Digital Marketing';

    const provider = getTrendProvider();
    const data = await provider.fetchTrends({ niche, maxResults: 20 });

    if (!data) {
      return NextResponse.json({
        data: null,
        unavailable: true,
        message: 'Configure YOUTUBE_API_KEY to enable trend intelligence.',
      });
    }

    return NextResponse.json({
      data,
      source: provider.name,
    });
  } catch (error) {
    console.error('Trends API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
