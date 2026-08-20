import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { validateOAuthState } from '@/lib/instagram/oauth';
import { exchangeCodeForToken, getLongLivedToken, getUserPages, getInstagramBusinessAccount } from '@/lib/instagram/client';
import { encryptToken } from '@/lib/instagram/encryption';
import { prisma } from '@/lib/db/prisma';
import { syncInstagramAccount } from '@/lib/instagram/sync';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL('/login?error=unauthorized', req.url));
    }
    const userId = session.user.id;

    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const errorParam = url.searchParams.get('error');

    if (errorParam) {
      return NextResponse.redirect(new URL(`/settings?error=${errorParam}`, req.url));
    }

    if (!code || !state || !validateOAuthState(state, userId)) {
      return NextResponse.redirect(new URL('/settings?error=invalid_state', req.url));
    }

    const tokenRes = await exchangeCodeForToken(code);
    const longLived = await getLongLivedToken(tokenRes.access_token);
    
    // Get the Instagram Business Account via user pages
    const pages = await getUserPages(longLived.access_token);
    const connectedPage = pages.find(p => p.instagram_business_account);
    
    if (!connectedPage || !connectedPage.instagram_business_account) {
      return NextResponse.redirect(new URL('/onboarding/connect?error=no_instagram_account', req.url));
    }

    const igAccountId = connectedPage.instagram_business_account.id;
    const encryptedToken = encryptToken(longLived.access_token);

    // Get full profile info
    let profile: { username: string; name: string; followers_count: number; follows_count: number; media_count: number; profile_picture_url: string } | null = null;
    try {
      profile = await getInstagramBusinessAccount(igAccountId, longLived.access_token);
    } catch {
      // Continue without full profile — will be populated on first sync
    }

    // Upsert PlatformConnection using the correct unique constraint: [userId, platform, accountId]
    const existingConnection = await prisma.platformConnection.findFirst({
      where: { userId, platform: 'INSTAGRAM', accountId: igAccountId },
    });

    let platformConnection;
    if (existingConnection) {
      platformConnection = await prisma.platformConnection.update({
        where: { id: existingConnection.id },
        data: {
          isActive: true,
          username: profile?.username ?? existingConnection.username,
          displayName: profile?.name ?? existingConnection.displayName,
          followersCount: profile?.followers_count ?? existingConnection.followersCount,
          followingCount: profile?.follows_count ?? existingConnection.followingCount,
          mediaCount: profile?.media_count ?? existingConnection.mediaCount,
          profilePicture: profile?.profile_picture_url ?? existingConnection.profilePicture,
          updatedAt: new Date(),
        },
      });
    } else {
      platformConnection = await prisma.platformConnection.create({
        data: {
          userId,
          platform: 'INSTAGRAM',
          accountId: igAccountId,
          username: profile?.username ?? igAccountId,
          displayName: profile?.name ?? null,
          followersCount: profile?.followers_count ?? 0,
          followingCount: profile?.follows_count ?? 0,
          mediaCount: profile?.media_count ?? 0,
          profilePicture: profile?.profile_picture_url ?? null,
          isActive: true,
          connectedAt: new Date(),
        },
      });
    }

    // Store OAuth credential
    await prisma.oAuthCredential.upsert({
      where: { platformConnectionId: platformConnection.id },
      create: {
        platformConnectionId: platformConnection.id,
        accessToken: encryptedToken,
        scopes: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_insights', 'pages_read_engagement', 'pages_show_list'],
        expiresAt: longLived.expires_in ? new Date(Date.now() + longLived.expires_in * 1000) : null,
      },
      update: {
        accessToken: encryptedToken,
        expiresAt: longLived.expires_in ? new Date(Date.now() + longLived.expires_in * 1000) : null,
        updatedAt: new Date(),
      },
    });

    // Log connection
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'INSTAGRAM_CONNECT',
        resource: 'PlatformConnection',
        resourceId: platformConnection.id,
        metadata: { igAccountId, username: profile?.username },
      },
    });

    // Trigger initial full sync in background (non-blocking)
    syncInstagramAccount({
      userId,
      platformConnectionId: platformConnection.id,
      accessToken: longLived.access_token,
      igAccountId,
      syncType: 'full',
    }).catch(() => {
      // Sync failure is non-fatal — user can manually sync from settings
    });

    return NextResponse.redirect(new URL('/dashboard?connected=true', req.url));
  } catch (error) {
    console.error('Instagram callback error:', error);
    return NextResponse.redirect(new URL('/settings?error=internal_error', req.url));
  }
}
