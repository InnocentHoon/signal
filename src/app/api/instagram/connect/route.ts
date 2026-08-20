import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { generateOAuthState, buildAuthorizationUrl } from '@/lib/instagram/oauth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const state = generateOAuthState(userId);
    const authUrl = buildAuthorizationUrl(state);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
