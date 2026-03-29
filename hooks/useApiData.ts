/**
 * useApiData — Unified data hook
 *
 * Priority:
 *   1. Real Meta data (auto-loaded on mount if VITE_META_ACCESS_TOKEN is set)
 *   2. Real Google data (loaded after user clicks "Conectar Google")
 *   3. Mock data fallback (always available)
 *
 * Components receive the same data shape regardless of data source.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchAdAccounts,
  fetchAdInsights,
  fetchPages,
  fetchIGAccountIdFromPage,
  fetchIGAccount,
  fetchIGRecentMedia,
  computeIGEngagementRate,
  getActionValue,
  type MetaAdInsights,
  type MetaIGAccount,
  type MetaPage,
} from '../services/metaApi';
import {
  initGoogleAuth,
  requestGoogleSignIn,
  getGoogleToken,
  clearGoogleToken,
} from '../services/googleAuth';
import { fetchGA4Metrics, fetchGMBAccounts, fetchGMBLocations } from '../services/googleApi';
import {
  getHeroMetrics,
  getCampaignMetrics,
  getSocialDetailedMetrics,
} from '../services/mockData';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface LiveHeroMetrics {
  reach: { value: number | string; trend: number };
  roi: { value: string; trend: number };
  followers: { value: number; trend: number };
  newClients: { value: number; trend: number };
  engagement: { value: string; trend: number };
}

export interface LiveCampaignMetrics {
  spend: { value: string; trend: number };
  ctr: { value: string; trend: number };
  cpc: { value: string; trend: number };
  conversions: { value: number; trend: number };
  roas: { value: string; trend: number };
}

export interface LiveSocialMetric {
  platform: string;
  followers: number;
  growth: number;
  engagement: string;
  topPost: string;
}

export interface ApiDataState {
  heroMetrics: LiveHeroMetrics;
  campaignMetrics: LiveCampaignMetrics;
  socialMetrics: LiveSocialMetric[];
  // Connection state
  isMetaConnected: boolean;
  isGoogleConnected: boolean;
  isMetaLoading: boolean;
  isGoogleLoading: boolean;
  metaError: string | null;
  googleError: string | null;
  // Discovered IDs (useful for Settings tab)
  adAccountId: string | null;
  igAccountId: string | null;
  // Actions
  signInGoogle: () => void;
  signOutGoogle: () => void;
  refreshMeta: () => void;
}

// ─── Data mappers ─────────────────────────────────────────────────────────────

function mapToHeroMetrics(
  insights: MetaAdInsights,
  igFollowers: number,
  fbFollowers: number,
): LiveHeroMetrics {
  const roas = Number(insights.purchase_roas?.[0]?.value ?? 0);
  const purchases = getActionValue(insights.actions, 'purchase');
  const reach = Number(insights.reach);
  const impressions = Number(insights.impressions);
  const clicks = Number(insights.clicks);
  const engagementRate = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';

  return {
    reach: { value: reach, trend: 0 },
    roi: { value: roas > 0 ? `${roas.toFixed(1)}x` : '—', trend: 0 },
    followers: { value: igFollowers + fbFollowers, trend: 0 },
    newClients: { value: purchases, trend: 0 },
    engagement: { value: `${engagementRate}%`, trend: 0 },
  };
}

function mapToCampaignMetrics(insights: MetaAdInsights): LiveCampaignMetrics {
  const spend = Number(insights.spend);
  const clicks = Number(insights.clicks);
  const roas = Number(insights.purchase_roas?.[0]?.value ?? 0);
  const purchases = getActionValue(insights.actions, 'purchase');
  const cpc = clicks > 0 ? spend / clicks : 0;

  return {
    spend: { value: `${spend.toFixed(2)}€`, trend: 0 },
    ctr: { value: `${Number(insights.ctr).toFixed(2)}%`, trend: 0 },
    cpc: { value: `${cpc.toFixed(2)}€`, trend: 0 },
    conversions: { value: purchases, trend: 0 },
    roas: { value: roas > 0 ? `${roas.toFixed(1)}x` : '—', trend: 0 },
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useApiData(): ApiDataState {
  // Seed with mock data so the UI is never empty
  const mockHero = getHeroMetrics('30d') as unknown as LiveHeroMetrics;
  const mockCampaign = getCampaignMetrics() as unknown as LiveCampaignMetrics;
  const mockSocial = getSocialDetailedMetrics() as LiveSocialMetric[];

  const [heroMetrics, setHeroMetrics] = useState<LiveHeroMetrics>(mockHero);
  const [campaignMetrics, setCampaignMetrics] = useState<LiveCampaignMetrics>(mockCampaign);
  const [socialMetrics, setSocialMetrics] = useState<LiveSocialMetric[]>(mockSocial);

  const [isMetaConnected, setIsMetaConnected] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(!!getGoogleToken());
  const [isMetaLoading, setIsMetaLoading] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [adAccountId, setAdAccountId] = useState<string | null>(null);
  const [igAccountId, setIgAccountId] = useState<string | null>(null);

  // Prevent double-loading on StrictMode double-mount
  const metaLoadedRef = useRef(false);

  // ── Meta data loader ────────────────────────────────────────────────────────
  const loadMetaData = useCallback(async () => {
    const token = import.meta.env.VITE_META_ACCESS_TOKEN as string;
    if (!token) {
      setIsMetaLoading(false);
      setMetaError('Token de Meta no configurado en .env.local');
      return;
    }

    setIsMetaLoading(true);
    setMetaError(null);

    try {
      // 1. Discover ad account
      const accountsRes = await fetchAdAccounts();
      const firstAccount = accountsRes.data?.[0];
      if (!firstAccount) {
        throw new Error('No se encontraron cuentas publicitarias vinculadas al token');
      }
      setAdAccountId(firstAccount.id);

      // 2. Fetch insights + pages in parallel
      const [insightsRes, pagesRes] = await Promise.all([
        fetchAdInsights(firstAccount.id, 'last_30d'),
        fetchPages(),
      ]);

      const insights = insightsRes.data?.[0];
      const page: MetaPage | undefined = pagesRes.data?.[0];

      // 3. Fetch Instagram account (linked through the FB Page)
      let igAccount: MetaIGAccount | null = null;
      let igId: string | null = null;

      if (page) {
        const pageData = await fetchIGAccountIdFromPage(page.id);
        igId = pageData.instagram_business_account?.id ?? null;
        if (igId) {
          setIgAccountId(igId);
          const [igData, mediaData] = await Promise.all([
            fetchIGAccount(igId),
            fetchIGRecentMedia(igId),
          ]);
          igAccount = igData;

          // Top post by total interactions
          const topPost = mediaData.data?.reduce(
            (best, m) =>
              m.like_count + m.comments_count > best.like_count + best.comments_count
                ? m
                : best,
            mediaData.data[0],
          );

          const engagementRate = computeIGEngagementRate(
            mediaData.data ?? [],
            igData.followers_count,
          );

          const igSocialEntry: LiveSocialMetric = {
            platform: 'Instagram',
            followers: igData.followers_count,
            growth: 0,
            engagement: engagementRate,
            topPost:
              topPost?.caption?.slice(0, 80) ??
              igData.biography?.slice(0, 80) ??
              'Ver perfil',
          };

          // Replace mock Instagram entry, keep TikTok and others
          setSocialMetrics((prev) => [
            igSocialEntry,
            ...prev.filter((m) => m.platform !== 'Instagram'),
          ]);
        }
      }

      // 4. Add Facebook Page social entry
      if (page) {
        const fbEntry: LiveSocialMetric = {
          platform: 'Facebook',
          followers: page.followers_count,
          growth: 0,
          engagement: '—',
          topPost: page.name,
        };
        setSocialMetrics((prev) => [
          ...prev.filter((m) => m.platform !== 'Facebook'),
          fbEntry,
        ]);
      }

      // 5. Map ad insights to dashboard metrics
      if (insights) {
        setHeroMetrics(
          mapToHeroMetrics(
            insights,
            igAccount?.followers_count ?? 0,
            page?.followers_count ?? 0,
          ),
        );
        setCampaignMetrics(mapToCampaignMetrics(insights));
      }

      setIsMetaConnected(true);
    } catch (err) {
      console.error('[Meta API]', err);
      setMetaError(err instanceof Error ? err.message : String(err));
      setIsMetaConnected(false);
    } finally {
      setIsMetaLoading(false);
    }
  }, []);

  // ── Google data loader ──────────────────────────────────────────────────────
  const loadGoogleData = useCallback(async (token: string) => {
    setIsGoogleLoading(true);
    setGoogleError(null);
    try {
      const ga4PropertyId = import.meta.env.VITE_GA4_PROPERTY_ID as string | undefined;

      if (ga4PropertyId) {
        const ga4 = await fetchGA4Metrics(token, ga4PropertyId);
        setHeroMetrics((prev) => ({
          ...prev,
          newClients: { value: ga4.newUsers, trend: 0 },
        }));
      } else {
        // Discover GMB accounts so the user can note their IDs
        const accounts = await fetchGMBAccounts(token);
        if (accounts.length > 0) {
          const locations = await fetchGMBLocations(token, accounts[0].name);
          console.info(
            '[Google] GMB accounts & locations discovered. Set in .env.local:',
            { accounts: accounts.map((a) => a.name), locations: locations.map((l) => l.name) },
          );
        }
      }

      setIsGoogleConnected(true);
    } catch (err) {
      console.error('[Google API]', err);
      setGoogleError(err instanceof Error ? err.message : String(err));
      clearGoogleToken();
      setIsGoogleConnected(false);
    } finally {
      setIsGoogleLoading(false);
    }
  }, []);

  // ── Effects ─────────────────────────────────────────────────────────────────

  // Load Meta on mount
  useEffect(() => {
    if (metaLoadedRef.current) return;
    metaLoadedRef.current = true;
    loadMetaData();
  }, [loadMetaData]);

  // Initialise Google Identity Services; if token already stored, reload data
  useEffect(() => {
    initGoogleAuth((token) => {
      setIsGoogleConnected(true);
      loadGoogleData(token);
    }).then(() => {
      const stored = getGoogleToken();
      if (stored) {
        setIsGoogleConnected(true);
        loadGoogleData(stored);
      }
    });
  }, [loadGoogleData]);

  // ── Actions ─────────────────────────────────────────────────────────────────

  const signInGoogle = useCallback(() => {
    requestGoogleSignIn();
  }, []);

  const signOutGoogle = useCallback(() => {
    clearGoogleToken();
    setIsGoogleConnected(false);
  }, []);

  const refreshMeta = useCallback(() => {
    metaLoadedRef.current = false;
    loadMetaData();
  }, [loadMetaData]);

  return {
    heroMetrics,
    campaignMetrics,
    socialMetrics,
    isMetaConnected,
    isGoogleConnected,
    isMetaLoading,
    isGoogleLoading,
    metaError,
    googleError,
    adAccountId,
    igAccountId,
    signInGoogle,
    signOutGoogle,
    refreshMeta,
  };
}
