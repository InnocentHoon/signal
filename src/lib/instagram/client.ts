import { z } from 'zod';

const GRAPH_API_BASE = 'https://graph.facebook.com/v19.0';

export class InstagramApiError extends Error {
  constructor(public code: string, message: string, public status: number) {
    super(message);
    this.name = 'InstagramApiError';
  }
}

async function fetchWithRetry(url: string, options: RequestInit = {}): Promise<Response> {
  const maxRetries = 3;
  for (let i = 0; i < maxRetries; i++) {
    const res = await fetch(url, options);
    if (res.status === 429) {
      const retryAfter = res.headers.get('retry-after');
      const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 2000 * Math.pow(2, i);
      await new Promise(r => setTimeout(r, waitTime));
      continue;
    }
    return res;
  }
  throw new InstagramApiError('RATE_LIMIT', 'Rate limit exceeded', 429);
}

async function handleResponse<T>(response: Response, schema: z.ZodType<T>): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    const errorCode = data.error?.code;
    const errorMessage = data.error?.message || 'Unknown API Error';
    const status = response.status;
    
    if (errorCode === 190) throw new InstagramApiError('EXPIRED_TOKEN', errorMessage, status);
    if (errorCode === 10 || status === 403) throw new InstagramApiError('PERMISSION_DENIED', errorMessage, status);
    if (status === 404) throw new InstagramApiError('NOT_FOUND', errorMessage, status);
    
    throw new InstagramApiError('API_ERROR', errorMessage, status);
  }
  
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new InstagramApiError('VALIDATION_ERROR', 'Failed to validate API response', 500);
  }
  return parsed.data;
}

// Schemas
const TokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number().optional()
});

const PagesResponseSchema = z.object({
  data: z.array(z.object({
    id: z.string(),
    name: z.string(),
    access_token: z.string(),
    instagram_business_account: z.object({
      id: z.string()
    }).optional()
  }))
});

const InstagramBusinessAccountSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string().optional().default(''),
  biography: z.string().optional().default(''),
  followers_count: z.number().optional().default(0),
  follows_count: z.number().optional().default(0),
  media_count: z.number().optional().default(0),
  profile_picture_url: z.string().optional().default(''),
  website: z.string().optional().default(''),
  account_type: z.string().optional().default('')
});

const MediaItemSchema = z.object({
  id: z.string(),
  caption: z.string().optional(),
  media_type: z.string(),
  media_url: z.string().optional(),
  thumbnail_url: z.string().optional(),
  permalink: z.string(),
  timestamp: z.string(),
  like_count: z.number().optional().default(0),
  comments_count: z.number().optional().default(0),
  is_comment_enabled: z.boolean().optional().default(true)
});

const MediaResponseSchema = z.object({
  data: z.array(MediaItemSchema),
  paging: z.object({
    cursors: z.object({
      after: z.string().optional(),
      before: z.string().optional()
    }).optional(),
    next: z.string().optional()
  }).optional()
});

const MediaInsightsSchema = z.object({
  data: z.array(z.object({
    name: z.string(),
    period: z.string(),
    values: z.array(z.object({
      value: z.number()
    }))
  }))
});

const AccountInsightsSchema = z.object({
  data: z.array(z.object({
    name: z.string(),
    period: z.string(),
    values: z.array(z.object({
      value: z.number(),
      end_time: z.string()
    }))
  }))
});

// Functions

export async function exchangeCodeForToken(code: string) {
  const clientId = process.env.INSTAGRAM_CLIENT_ID || '';
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET || '';
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || '';
  
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code
  });
  
  const res = await fetchWithRetry(`${GRAPH_API_BASE}/oauth/access_token`, {
    method: 'POST',
    body: params
  });
  
  return handleResponse(res, TokenResponseSchema);
}

export async function getLongLivedToken(shortLivedToken: string) {
  const clientId = process.env.INSTAGRAM_CLIENT_ID || '';
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET || '';
  
  const params = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: clientId,
    client_secret: clientSecret,
    fb_exchange_token: shortLivedToken
  });
  
  const res = await fetchWithRetry(`${GRAPH_API_BASE}/oauth/access_token?${params.toString()}`);
  return handleResponse(res, TokenResponseSchema.extend({ expires_in: z.number() }));
}

export async function getUserPages(accessToken: string) {
  const params = new URLSearchParams({
    fields: 'id,name,access_token,instagram_business_account',
    access_token: accessToken
  });
  
  const res = await fetchWithRetry(`${GRAPH_API_BASE}/me/accounts?${params.toString()}`);
  const parsed = await handleResponse(res, PagesResponseSchema);
  return parsed.data;
}

export async function getInstagramBusinessAccount(igAccountId: string, accessToken: string) {
  const params = new URLSearchParams({
    fields: 'id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url,website,account_type',
    access_token: accessToken
  });
  
  const res = await fetchWithRetry(`${GRAPH_API_BASE}/${igAccountId}?${params.toString()}`);
  return handleResponse(res, InstagramBusinessAccountSchema);
}

export async function getUserMedia(igAccountId: string, accessToken: string, after?: string) {
  const params = new URLSearchParams({
    fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,is_comment_enabled',
    limit: '50',
    access_token: accessToken
  });
  
  if (after) params.append('after', after);
  
  const res = await fetchWithRetry(`${GRAPH_API_BASE}/${igAccountId}/media?${params.toString()}`);
  const parsed = await handleResponse(res, MediaResponseSchema);
  return {
    data: parsed.data,
    paging: parsed.paging || { cursors: { after: '', before: '' } }
  };
}

export async function getMediaInsights(mediaId: string, accessToken: string) {
  const params = new URLSearchParams({
    metric: 'reach,impressions,saved,video_views,shares',
    access_token: accessToken
  });
  
  try {
    const res = await fetchWithRetry(`${GRAPH_API_BASE}/${mediaId}/insights?${params.toString()}`);
    const parsed = await handleResponse(res, MediaInsightsSchema);
    
    const result = { reach: 0, impressions: 0, saved: 0, video_views: 0, shares: 0 };
    for (const item of parsed.data) {
      if (item.name in result && item.values.length > 0) {
        result[item.name as keyof typeof result] = item.values[0].value;
      }
    }
    return result;
  } catch (error) {
    return { reach: 0, impressions: 0, saved: 0, video_views: 0, shares: 0 };
  }
}

export async function getAccountInsights(igAccountId: string, accessToken: string, metric: string, period: string, since: number, until: number) {
  const params = new URLSearchParams({
    metric,
    period,
    since: since.toString(),
    until: until.toString(),
    access_token: accessToken
  });
  
  try {
    const res = await fetchWithRetry(`${GRAPH_API_BASE}/${igAccountId}/insights?${params.toString()}`);
    const parsed = await handleResponse(res, AccountInsightsSchema);
    
    if (parsed.data.length > 0) {
      return parsed.data[0].values;
    }
    return [];
  } catch (error) {
    if (error instanceof InstagramApiError && error.code === 'PERMISSION_DENIED') {
      return [];
    }
    throw error;
  }
}

export async function getPublicProfile(username: string) {
  const accessToken = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN || '';
  const igAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '';
  
  if (!accessToken || !igAccountId) return null;
  
  const params = new URLSearchParams({
    fields: `business_discovery.username(${username}){username,followers_count,media_count,biography}`,
    access_token: accessToken
  });
  
  try {
    const res = await fetchWithRetry(`${GRAPH_API_BASE}/${igAccountId}?${params.toString()}`);
    const data = await res.json();
    
    if (!res.ok) return null;
    
    const info = data.business_discovery;
    if (!info) return null;
    
    return {
      username: info.username,
      followersCount: info.followers_count,
      mediaCount: info.media_count,
      biography: info.biography
    };
  } catch {
    return null;
  }
}

export async function refreshToken(currentToken: string) {
  const params = new URLSearchParams({
    grant_type: 'ig_refresh_token',
    access_token: currentToken
  });
  
  const res = await fetchWithRetry(`${GRAPH_API_BASE}/oauth/access_token?${params.toString()}`);
  return handleResponse(res, z.object({ access_token: z.string(), expires_in: z.number() }));
}
