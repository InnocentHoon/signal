import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const pillarSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  targetPercentage: z.number().min(0).max(100),
});

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;
    const { pathname } = new URL(req.url);
    
    // Return analysis if hitting /api/content/pillars/analysis
    if (pathname.includes('/analysis')) {
      const pillars = await prisma.contentPillar.findMany({ where: { userId } });
      const posts = await prisma.contentPost.findMany({ where: { userId } });
      
      const analysis = pillars.map(pillar => {
        const matchingPosts = posts.filter(p => p.contentPillarId === pillar.id);
        const actualPercentage = posts.length > 0 ? (matchingPosts.length / posts.length) * 100 : 0;
        return {
          id: pillar.id,
          name: pillar.name,
          target: pillar.targetPercentage,
          actual: actualPercentage,
          variance: actualPercentage - pillar.targetPercentage,
        };
      });
      
      return NextResponse.json({ data: analysis });
    }

    const pillars = await prisma.contentPillar.findMany({ where: { userId } });
    return NextResponse.json({ data: pillars });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.id } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json();
    const parsed = pillarSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

    const pillar = await prisma.contentPillar.create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        description: parsed.data.description || '',
        targetPercentage: parsed.data.targetPercentage,
      }
    });

    return NextResponse.json({ data: pillar });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const body = await req.json();
    const existing = await prisma.contentPillar.findFirst({
      where: { id, user: { email: session.user.id } }
    });

    if (!existing) return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });

    const updated = await prisma.contentPillar.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ data: updated });
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

    await prisma.contentPillar.deleteMany({
      where: {
        id,
        user: { email: session.user.id }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
