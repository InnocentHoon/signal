import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const profileUpdateSchema = z.object({
  displayName: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().optional(),
  niche: z.string().optional(),
  subNiche: z.string().optional(),
  targetAudience: z.string().optional(),
  mainGoal: z.string().optional(),
  contentStyle: z.string().optional(),
  primaryPlatform: z.string().optional(),
  postingFrequency: z.string().optional(),
});

const settingsUpdateSchema = z.object({
  emailNotifications: z.boolean().optional(),
  weeklyReport: z.boolean().optional(),
  theme: z.string().optional(),
  simpleMode: z.boolean().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true, settings: true, platformConnections: { where: { isActive: true } } },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({
      data: {
        user: { id: user.id, name: user.name, email: user.email, username: user.username, image: user.image },
        profile: user.profile,
        settings: user.settings,
        connections: user.platformConnections,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;
    const body = await req.json();

    // Handle profile updates
    if (body.profile) {
      const parsed = profileUpdateSchema.safeParse(body.profile);
      if (!parsed.success) return NextResponse.json({ error: 'Invalid profile data', issues: parsed.error.issues }, { status: 400 });

      const existingProfile = await prisma.profile.findUnique({ where: { userId } });
      if (existingProfile) {
        await prisma.profile.update({
          where: { userId },
          data: { ...parsed.data, updatedAt: new Date() },
        });
      }
      // Don't create profile here — onboarding handles creation with all required fields
    }

    // Handle settings updates
    if (body.settings) {
      const parsed = settingsUpdateSchema.safeParse(body.settings);
      if (!parsed.success) return NextResponse.json({ error: 'Invalid settings data', issues: parsed.error.issues }, { status: 400 });

      await prisma.userSettings.upsert({
        where: { userId },
        update: { ...parsed.data, updatedAt: new Date() },
        create: {
          userId,
          emailNotifications: parsed.data.emailNotifications ?? true,
          weeklyReport: parsed.data.weeklyReport ?? true,
          theme: parsed.data.theme ?? 'dark',
          simpleMode: parsed.data.simpleMode ?? true,
        },
      });
    }

    // Handle user name/username updates
    if (body.user) {
      const userParsed = z.object({
        name: z.string().optional(),
        username: z.string().optional(),
      }).safeParse(body.user);
      if (userParsed.success) {
        await prisma.user.update({
          where: { id: userId },
          data: userParsed.data,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
