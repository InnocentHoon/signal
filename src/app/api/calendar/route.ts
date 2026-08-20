import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';
import { CalendarItemStatus } from '@prisma/client';

const itemSchema = z.object({
  title: z.string().min(1),
  scheduledFor: z.string().optional(), // ISO string
  status: z.enum(['IDEA', 'DRAFT', 'READY', 'SCHEDULED', 'PUBLISHED']).default('IDEA'),
  platform: z.string().optional(),
  format: z.string().optional(),
  topic: z.string().optional(),
  caption: z.string().optional(),
  notes: z.string().optional(),
  contentIdeaId: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month'); // YYYY-MM
    
    const where: Record<string, unknown> = { userId: session.user.id };
    
    if (month) {
      const start = new Date(`${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      where.scheduledFor = { gte: start, lt: end };
    }

    const items = await prisma.calendarItem.findMany({
      where,
      orderBy: { scheduledFor: 'asc' },
    });
    
    return NextResponse.json({ data: items });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const parsed = itemSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid data', issues: parsed.error.issues }, { status: 400 });

    const item = await prisma.calendarItem.create({
      data: {
        userId: session.user.id,
        title: parsed.data.title,
        status: parsed.data.status as CalendarItemStatus,
        scheduledFor: parsed.data.scheduledFor ? new Date(parsed.data.scheduledFor) : null,
        platform: parsed.data.platform ?? null,
        format: parsed.data.format ?? null,
        topic: parsed.data.topic ?? null,
        caption: parsed.data.caption ?? null,
        notes: parsed.data.notes ?? null,
        contentIdeaId: parsed.data.contentIdeaId ?? null,
      },
    });

    return NextResponse.json({ data: item });
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

    // Verify ownership
    const existing = await prisma.calendarItem.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updateSchema = itemSchema.partial();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

    const updated = await prisma.calendarItem.update({
      where: { id },
      data: {
        ...parsed.data,
        scheduledFor: parsed.data.scheduledFor ? new Date(parsed.data.scheduledFor) : undefined,
        status: parsed.data.status as CalendarItemStatus | undefined,
        updatedAt: new Date(),
      },
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

    await prisma.calendarItem.deleteMany({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
