import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;
    const body = await req.json();
    const { platformConnectionId } = body;

    if (!platformConnectionId) {
      return NextResponse.json({ error: 'Missing platformConnectionId' }, { status: 400 });
    }

    const connection = await prisma.platformConnection.findUnique({
      where: { id: platformConnectionId }
    });

    if (!connection || connection.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.oAuthCredential.deleteMany({
      where: { platformConnectionId }
    });

    await prisma.platformConnection.update({
      where: { id: platformConnectionId },
      data: { isActive: false },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DISCONNECT_INSTAGRAM',
        resource: 'PlatformConnection',
        resourceId: platformConnectionId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
