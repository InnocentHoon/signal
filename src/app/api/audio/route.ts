import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      data: null,
      unavailable: true,
      message: 'Audio trend data is not currently available. No free commercial API exists for Instagram audio trends. This will be enabled when a suitable provider is integrated.',
    });
  } catch (error) {
    console.error('Audio API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
