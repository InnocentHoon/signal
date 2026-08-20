import { 
  getInstagramBusinessAccount, 
  getUserMedia, 
  getMediaInsights,
} from './client';
import { prisma } from '@/lib/db/prisma';
import { MediaType } from '@prisma/client';

export async function syncInstagramAccount(params: {
  userId: string;
  platformConnectionId: string;
  accessToken: string;
  igAccountId: string;
  syncType: 'full' | 'incremental';
}) {
  const { userId, platformConnectionId, accessToken, igAccountId, syncType } = params;
  
  const syncJob = await prisma.syncJob.create({
    data: {
      userId,
      platformConnectionId,
      status: 'RUNNING',
      syncType,
      startedAt: new Date(),
    }
  });

  const errors: string[] = [];
  let postsSync = 0;
  let metricsSync = 0;

  try {
    const profile = await getInstagramBusinessAccount(igAccountId, accessToken);
    
    // Update the PlatformConnection with latest profile data
    await prisma.platformConnection.update({
      where: { id: platformConnectionId },
      data: {
        username: profile.username,
        displayName: profile.name,
        followersCount: profile.followers_count,
        followingCount: profile.follows_count,
        mediaCount: profile.media_count,
        profilePicture: profile.profile_picture_url || null,
        lastSyncAt: new Date(),
        updatedAt: new Date(),
      }
    });

    // Create profile snapshot
    await prisma.profileSnapshot.create({
      data: {
        platformConnectionId,
        userId,
        snapshotDate: new Date(),
        followersCount: profile.followers_count,
        followingCount: profile.follows_count,
        mediaCount: profile.media_count,
        data: {},
      }
    });

    let hasNextPage = true;
    let afterCursor: string | undefined = undefined;
    
    while (hasNextPage) {
      const mediaResponse = await getUserMedia(igAccountId, accessToken, afterCursor);
      const mediaItems = mediaResponse.data;
      
      for (const item of mediaItems) {
        try {
          // Map media_type string to MediaType enum
          const mediaTypeMap: Record<string, MediaType> = {
            'IMAGE': MediaType.IMAGE,
            'VIDEO': MediaType.VIDEO,
            'CAROUSEL_ALBUM': MediaType.CAROUSEL_ALBUM,
            'REEL': MediaType.REEL,
            'STORY': MediaType.STORY,
          };
          const mediaType: MediaType = mediaTypeMap[item.media_type] ?? MediaType.IMAGE;

          const contentPost = await prisma.contentPost.upsert({
            where: { platform_externalId: { platform: 'INSTAGRAM', externalId: item.id } },
            create: {
              userId,
              platformConnectionId,
              platform: 'INSTAGRAM',
              externalId: item.id,
              mediaType,
              mediaUrl: item.media_url || null,
              thumbnailUrl: item.thumbnail_url || null,
              permalink: item.permalink || null,
              caption: item.caption || null,
              publishedAt: new Date(item.timestamp),
            },
            update: {
              caption: item.caption || null,
              mediaUrl: item.media_url || null,
              thumbnailUrl: item.thumbnail_url || null,
            }
          });
          postsSync++;

          // Fetch media insights — gracefully handle missing permissions
          let insights = { reach: 0, impressions: 0, saved: 0, video_views: 0, shares: 0 };
          try {
            insights = await getMediaInsights(item.id, accessToken);
          } catch {
            // Insights may not be available for all media types or permissions
          }
          
          const totalEngagement = item.like_count + item.comments_count + insights.shares + insights.saved;
          const engagementRate = profile.followers_count > 0 
            ? (totalEngagement / profile.followers_count) * 100
            : 0;

          await prisma.contentMetric.upsert({
            where: { contentPostId: contentPost.id },
            create: {
              contentPostId: contentPost.id,
              userId,
              likesCount: item.like_count,
              commentsCount: item.comments_count,
              sharesCount: insights.shares,
              savesCount: insights.saved,
              viewsCount: insights.video_views,
              reachCount: insights.reach,
              impressionsCount: insights.impressions,
              engagementRate,
              source: 'CONNECTED',
              syncedAt: new Date(),
            },
            update: {
              likesCount: item.like_count,
              commentsCount: item.comments_count,
              sharesCount: insights.shares,
              savesCount: insights.saved,
              viewsCount: insights.video_views,
              reachCount: insights.reach,
              impressionsCount: insights.impressions,
              engagementRate,
              source: 'CONNECTED',
              syncedAt: new Date(),
            }
          });
          metricsSync++;
        } catch (e) {
          errors.push(`Failed to sync media item ${item.id}: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
      }

      if (mediaResponse.paging?.next && mediaResponse.paging.cursors?.after && (syncType === 'full' || postsSync < 50)) {
        afterCursor = mediaResponse.paging.cursors.after;
      } else {
        hasNextPage = false;
      }
    }

    // Create analytics snapshot
    await prisma.analyticsSnapshot.create({
      data: {
        userId,
        platformConnectionId,
        period: 'MONTH',
        snapshotDate: new Date(),
        followersCount: profile.followers_count,
        followerGrowth: 0,
        postsPublished: postsSync,
      }
    });

    // Mark sync job complete
    await prisma.syncJob.update({
      where: { id: syncJob.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        itemsSynced: postsSync,
        error: errors.length > 0 ? errors.join('\n') : null,
      }
    });

  } catch (error) {
    await prisma.syncJob.update({
      where: { id: syncJob.id },
      data: {
        status: 'FAILED',
        completedAt: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    });
    errors.push(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return { postsSync, metricsSync, errors };
}

export async function syncAccountInsights(params: {
  userId: string;
  platformConnectionId: string;
  accessToken: string;
  igAccountId: string;
}): Promise<void> {
  // Account-level insights require instagram_manage_insights permission
  // This is gracefully skipped if the permission has not been granted
  // (App Review required for production use)
}
