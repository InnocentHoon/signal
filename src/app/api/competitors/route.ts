import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';
import { Platform } from '@prisma/client';

const addCompetitorSchema = z.object({
  username: z.string().min(1),
  platform: z.enum(['INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'LINKEDIN', 'TWITTER']).default('INSTAGRAM'),
});

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const competitors = await prisma.competitor.findMany({ where: { userId: session.user.id } });
    return NextResponse.json({ data: competitors });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;
    const count = await prisma.competitor.count({ where: { userId } });
    if (count >= 10) return NextResponse.json({ error: 'Maximum 10 competitors allowed' }, { status: 400 });

    const body = await req.json();
    const parsed = addCompetitorSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

    const competitor = await prisma.competitor.create({
      data: {
        userId,
        username: parsed.data.username,
        platform: parsed.data.platform as Platform,
        topTopics: [],
        contentFormats: [],
      },
    });

    return NextResponse.json({ data: competitor });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.competitor.deleteMany({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
