/**
 * Meta Graph API v21.0
 * Covers: Ad Accounts, Ad Insights, Facebook Pages, Instagram Business Accounts
 *
 * Token used: VITE_META_ACCESS_TOKEN (User Access Token)
 * Token refresh: GET /oauth/access_token?grant_type=fb_exchange_token
 * Expiry: ~60 days for long-lived tokens
 */

const META_VERSION = 'v21.0';
const BASE = `https://graph.facebook.com/${META_VERSION}`;

// ─── In-memory cache (5-minute TTL) ─────────────────────────────────────────
const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { data: unknown; ts: number }>();

function getToken(): string {
  return (import.meta.env.VITE_META_ACCESS_TOKEN as string) ?? '';
}

async function apiFetch<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const cacheKey = path + JSON.stringify(params);
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.data as T;

  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('access_token', getToken());
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString());
  const json: T & { error?: { message: string; code: number } } =
    await res.json();

  if ((json as { error?: { message: string } }).error) {
    throw new Error(
      `Meta API: ${(json as { error: { message: string; code: number } }).error.message} (code ${(json as { error: { message: string; code: number } }).error.code})`,
    );
  }

  cache.set(cacheKey, { data: json, ts: Date.now() });
  return json;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MetaAdAccount {
  id: string;
  name: string;
  account_status: number; // 1 = active
  currency: string;
}

export interface MetaAdInsights {
  spend: string;
  reach: string;
  impressions: string;
  clicks: string;
  ctr: string;
  cpm?: string;
  purchase_roas?: Array<{ action_type: string; value: string }>;
  actions?: Array<{ action_type: string; value: string }>;
  cost_per_action_type?: Array<{ action_type: string; value: string }>;
  date_start: string;
  date_stop: string;
}

export interface MetaPage {
  id: string;
  name: string;
  fan_count: number;
  followers_count: number;
  category?: string;
}

export interface MetaIGAccount {
  id: string;
  name: string;
  followers_count: number;
  media_count: number;
  biography: string;
  website: string;
}

export interface MetaIGMedia {
  id: string;
  caption?: string;
  media_type: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
  media_url?: string;
  permalink?: string;
}

export interface MetaPixelInfo {
  id: string;
  name: string;
  last_fired_time?: number;
  data_use_setting?: string;
  is_created_by_business?: boolean;
}

// ─── Ad Accounts ─────────────────────────────────────────────────────────────

export async function fetchAdAccounts(): Promise<{ data: MetaAdAccount[] }> {
  return apiFetch('/me/adaccounts', {
    fields: 'id,name,account_status,currency',
  });
}

// ─── Ad Insights ─────────────────────────────────────────────────────────────

/**
 * @param adAccountId  Format: "act_XXXXXXXXXX"
 * @param datePreset   e.g. "last_7d", "last_30d", "last_90d", "this_month"
 */
export async function fetchAdInsights(
  adAccountId: string,
  datePreset = 'last_30d',
): Promise<{ data: MetaAdInsights[] }> {
  return apiFetch(`/${adAccountId}/insights`, {
    fields:
      'spend,reach,impressions,clicks,ctr,cpm,purchase_roas,actions,cost_per_action_type',
    date_preset: datePreset,
    level: 'account',
  });
}

// ─── Facebook Pages ───────────────────────────────────────────────────────────

export async function fetchPages(): Promise<{ data: MetaPage[] }> {
  return apiFetch('/me/accounts', {
    fields: 'id,name,fan_count,followers_count,category',
  });
}

// ─── Instagram Business Account ───────────────────────────────────────────────

/** Returns the Instagram Business Account ID linked to a Facebook Page */
export async function fetchIGAccountIdFromPage(
  pageId: string,
): Promise<{ instagram_business_account?: { id: string }; id: string }> {
  return apiFetch(`/${pageId}`, { fields: 'instagram_business_account' });
}

export async function fetchIGAccount(igUserId: string): Promise<MetaIGAccount> {
  return apiFetch(`/${igUserId}`, {
    fields: 'id,name,followers_count,media_count,biography,website',
  });
}

/**
 * Fetches the 10 most recent Instagram media posts.
 * Use like_count + comments_count to compute engagement rate.
 */
export async function fetchIGRecentMedia(
  igUserId: string,
): Promise<{ data: MetaIGMedia[] }> {
  return apiFetch(`/${igUserId}/media`, {
    fields:
      'id,caption,media_type,timestamp,like_count,comments_count,media_url,permalink',
    limit: '10',
  });
}

// ─── Meta Pixel ───────────────────────────────────────────────────────────────

export async function fetchPixelInfo(pixelId: string): Promise<MetaPixelInfo> {
  return apiFetch(`/${pixelId}`, {
    fields:
      'id,name,is_created_by_business,last_fired_time,data_use_setting',
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Clear the in-memory cache (call after token refresh) */
export function clearMetaCache(): void {
  cache.clear();
}

/**
 * Compute engagement rate from recent media.
 * engagement_rate = avg(likes + comments) / followers * 100
 */
export function computeIGEngagementRate(
  media: MetaIGMedia[],
  followersCount: number,
): string {
  if (!media.length || !followersCount) return '0%';
  const totalInteractions = media.reduce(
    (sum, m) => sum + m.like_count + m.comments_count,
    0,
  );
  const rate = (totalInteractions / media.length / followersCount) * 100;
  return `${rate.toFixed(1)}%`;
}

/** Extract action value by type from ad insights actions array */
export function getActionValue(
  actions: MetaAdInsights['actions'],
  actionType: string,
): number {
  return Number(
    actions?.find((a) => a.action_type === actionType)?.value ?? 0,
  );
}
