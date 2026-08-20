import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import Papa from 'papaparse';
import { z } from 'zod';
import { MediaType, Platform } from '@prisma/client';

const csvRowSchema = z.object({
  id: z.string().optional(),
  caption: z.string().optional(),
  type: z.enum(['REEL', 'IMAGE', 'CAROUSEL_ALBUM', 'VIDEO']),
  publishedAt: z.string(),
  likes: z.coerce.number().default(0),
  comments: z.coerce.number().default(0),
  shares: z.coerce.number().default(0),
  saves: z.coerce.number().default(0),
});

// Map CSV type strings to MediaType enum
const typeMap: Record<string, MediaType> = {
  REEL: MediaType.REEL,
  IMAGE: MediaType.IMAGE,
  CAROUSEL_ALBUM: MediaType.CAROUSEL_ALBUM,
  VIDEO: MediaType.VIDEO,
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as Array<{ row: number; error: string }>,
    };

    const importJob = await prisma.importJob.create({
      data: {
        userId,
        status: 'PROCESSING',
        filename: file.name,
        totalRows: parsed.data.length,
      },
    });

    for (let i = 0; i < parsed.data.length; i++) {
      const row = parsed.data[i];
      const validation = csvRowSchema.safeParse(row);
      
      if (!validation.success) {
        results.failed++;
        results.errors.push({ row: i + 2, error: validation.error.issues[0].message });
        continue;
      }

      try {
        const { id, caption, type, publishedAt, likes, comments, shares, saves } = validation.data;
        const externalId = id || `import_${importJob.id}_${i}`;
        const mediaType = typeMap[type];

        // Upsert by platform + externalId (the actual unique constraint in schema)
        const post = await prisma.contentPost.upsert({
          where: { platform_externalId: { platform: Platform.INSTAGRAM, externalId } },
          update: {
            caption: caption ?? null,
            publishedAt: new Date(publishedAt),
          },
          create: {
            userId,
            platform: Platform.INSTAGRAM,
            externalId,
            mediaType,
            caption: caption ?? null,
            publishedAt: new Date(publishedAt),
            isImported: true,
            importJobId: importJob.id,
          },
        });

        // Upsert content metric (unique by contentPostId)
        await prisma.contentMetric.upsert({
          where: { contentPostId: post.id },
          update: {
            likesCount: likes,
            commentsCount: comments,
            sharesCount: shares,
            savesCount: saves,
            source: 'IMPORTED',
            syncedAt: new Date(),
          },
          create: {
            contentPostId: post.id,
            userId,
            likesCount: likes,
            commentsCount: comments,
            sharesCount: shares,
            savesCount: saves,
            source: 'IMPORTED',
            syncedAt: new Date(),
          },
        });

        results.successful++;
      } catch (err: unknown) {
        results.failed++;
        results.errors.push({ row: i + 2, error: err instanceof Error ? err.message : 'Database error' });
      }
    }

    // Update import job with results
    await prisma.importJob.update({
      where: { id: importJob.id },
      data: {
        status: results.failed === parsed.data.length ? 'FAILED' : 'COMPLETED',
        successRows: results.successful,
        failedRows: results.failed,
        errors: results.errors.length > 0 ? results.errors : undefined,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error('Import API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
