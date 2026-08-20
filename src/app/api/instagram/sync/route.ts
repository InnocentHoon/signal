import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { decryptToken, encryptToken } from '@/lib/instagram/encryption';
import { syncInstagramAccount } from '@/lib/instagram/sync';
import { refreshToken } from '@/lib/instagram/client';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const connection = await prisma.platformConnection.findFirst({
      where: { userId, platform: 'INSTAGRAM', isActive: true },
      include: { oauthCredential: true },
    });

    if (!connection || !connection.oauthCredential) {
      return NextResponse.json({ error: 'No active Instagram connection found' }, { status: 404 });
    }

    const runningJob = await prisma.syncJob.findFirst({
      where: { platformConnectionId: connection.id, status: 'RUNNING' },
    });

    if (runningJob) {
      return NextResponse.json({ error: 'Sync already in progress' }, { status: 409 });
    }

    let accessToken = decryptToken(connection.oauthCredential.accessToken);
    const expiresAt = connection.oauthCredential.expiresAt;

    // Refresh token if expiring within 7 days
    if (expiresAt && expiresAt < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) {
      try {
        const refreshed = await refreshToken(accessToken);
        accessToken = refreshed.access_token;
        await prisma.oAuthCredential.update({
          where: { id: connection.oauthCredential.id },
          data: {
            accessToken: encryptToken(accessToken),
            expiresAt: new Date(Date.now() + refreshed.expires_in * 1000),
          },
        });
      } catch {
        // Continue with existing token if refresh fails
      }
    }

    const result = await syncInstagramAccount({
      userId,
      platformConnectionId: connection.id,
      accessToken,
      igAccountId: connection.accountId,
      syncType: 'incremental',
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
