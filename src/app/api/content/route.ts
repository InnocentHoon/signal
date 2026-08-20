import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const querySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  sort: z.enum(['engagementRate', 'publishedAt', 'performanceScore', 'savesCount']).default('publishedAt'),
  filter: z.enum(['REEL', 'IMAGE', 'CAROUSEL_ALBUM', 'VIDEO', 'ALL']).default('ALL'),
  search: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams));
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const { page, limit, sort, filter, search } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.id },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const whereClause: any = { userId: user.id };
    if (filter !== 'ALL') {
      whereClause.type = filter;
    }
    if (search) {
      whereClause.caption = { contains: search, mode: 'insensitive' };
    }

    const posts = await prisma.contentPost.findMany({
      where: whereClause,
      take: limit,
      skip: (page - 1) * limit,
      include: { metrics: true },
      // Note: Actual dynamic sorting would be applied here based on 'sort'
      orderBy: sort === 'publishedAt' ? { publishedAt: 'desc' } : undefined,
    });

    const total = await prisma.contentPost.count({ where: whereClause });

    return NextResponse.json({
      data: posts,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });

  } catch (error) {
    console.error('Content API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
