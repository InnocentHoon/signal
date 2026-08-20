import crypto from 'crypto';

export function generateOAuthState(userId: string): string {
  const secret = process.env.NEXTAUTH_SECRET || '';
  if (!secret) throw new Error('NEXTAUTH_SECRET is not set');
  
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = Buffer.from(`${userId}:${nonce}`).toString('base64');
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('base64');
  
  return `${payload}.${hmac}`;
}

export function validateOAuthState(state: string, expectedUserId: string): boolean {
  try {
    const secret = process.env.NEXTAUTH_SECRET || '';
    if (!secret) return false;
    
    const [payload, signature] = state.split('.');
    if (!payload || !signature) return false;
    
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('base64');
    if (signature !== expectedSignature) return false;
    
    const decoded = Buffer.from(payload, 'base64').toString('utf8');
    const [userId] = decoded.split(':');
    
    return userId === expectedUserId;
  } catch (error) {
    return false;
  }
}

export function buildAuthorizationUrl(state: string): string {
  const clientId = process.env.INSTAGRAM_CLIENT_ID || '';
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || '';
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'instagram_basic,instagram_content_publish,instagram_manage_insights,pages_read_engagement,pages_show_list',
    state
  });
  
  return `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
}

export function buildBasicAuthorizationUrl(state: string): string {
  const clientId = process.env.INSTAGRAM_CLIENT_ID || '';
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || '';
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'instagram_basic',
    state
  });
  
  return `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
}
