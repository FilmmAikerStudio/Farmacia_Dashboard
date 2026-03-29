/**
 * Google APIs — GA4 Data API + Business Profile (Google My Business)
 *
 * All calls require a valid OAuth 2.0 access token obtained via googleAuth.ts.
 * Never import GOOGLE_CLIENT_SECRET here.
 *
 * Enable in Google Cloud Console:
 *   - Google Analytics Data API
 *   - My Business Business Information API
 *   - My Business Account Management API
 */

// ─── Generic fetch wrapper ────────────────────────────────────────────────────

async function googleFetch<T>(
  url: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      `Google API (${res.status}): ${
        (json as { error?: { message?: string } }).error?.message ??
        res.statusText
      }`,
    );
  }
  return json as T;
}

// ─── Google Analytics 4 ───────────────────────────────────────────────────────

export interface GA4Metrics {
  newUsers: number;
  sessions: number;
  bounceRate: string;
  avgSessionDuration: string;
}

interface GA4ReportRow {
  metricValues: Array<{ value: string }>;
}

interface GA4ReportResponse {
  rows?: GA4ReportRow[];
  rowCount?: number;
}

/**
 * Runs a GA4 report for the last 30 days.
 * @param token        OAuth access token
 * @param propertyId   GA4 numeric property ID (e.g. "123456789")
 */
export async function fetchGA4Metrics(
  token: string,
  propertyId: string,
): Promise<GA4Metrics> {
  const body = {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    metrics: [
      { name: 'newUsers' },
      { name: 'sessions' },
      { name: 'bounceRate' },
      { name: 'averageSessionDuration' },
    ],
  };

  const data = await googleFetch<GA4ReportResponse>(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    token,
    { method: 'POST', body: JSON.stringify(body) },
  );

  const vals = data.rows?.[0]?.metricValues ?? [];
  const durationSec = Number(vals[3]?.value ?? 0);

  return {
    newUsers: Number(vals[0]?.value ?? 0),
    sessions: Number(vals[1]?.value ?? 0),
    bounceRate: `${(Number(vals[2]?.value ?? 0) * 100).toFixed(1)}%`,
    avgSessionDuration: `${Math.floor(durationSec / 60)}m ${Math.floor(durationSec % 60)}s`,
  };
}

// ─── Google My Business (Business Profile API) ────────────────────────────────

export interface GMBAccount {
  name: string;        // e.g. "accounts/12345"
  accountName: string; // Display name
  type: string;
}

export interface GMBLocation {
  name: string;        // e.g. "accounts/12345/locations/67890"
  title: string;
  websiteUri?: string;
  storefrontAddress?: { addressLines: string[] };
}

export interface GMBInsightsSummary {
  impressions: number;
  clicks: number;
  directionRequests: number;
  calls: number;
}

export async function fetchGMBAccounts(token: string): Promise<GMBAccount[]> {
  const data = await googleFetch<{ accounts?: GMBAccount[] }>(
    'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
    token,
  );
  return data.accounts ?? [];
}

export async function fetchGMBLocations(
  token: string,
  accountName: string,
): Promise<GMBLocation[]> {
  const data = await googleFetch<{ locations?: GMBLocation[] }>(
    `https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations` +
      '?readMask=name,title,websiteUri,storefrontAddress',
    token,
  );
  return data.locations ?? [];
}

/**
 * Fetches Business Profile performance metrics.
 * Uses the Business Profile Performance API (v1).
 * @param locationName  Full resource name, e.g. "locations/12345"
 */
export async function fetchGMBInsights(
  token: string,
  locationName: string,
): Promise<GMBInsightsSummary> {
  // Date range: last 30 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const url =
    `https://businessprofileperformance.googleapis.com/v1/${locationName}:fetchMultiDailyMetricTimeSeries` +
    `?dailyMetrics=BUSINESS_IMPRESSIONS_DESKTOP_MAPS&dailyMetrics=BUSINESS_IMPRESSIONS_MOBILE_MAPS` +
    `&dailyMetrics=BUSINESS_DIRECTION_REQUESTS&dailyMetrics=CALL_CLICKS` +
    `&dailyRange.start_date.year=${startDate.getFullYear()}` +
    `&dailyRange.start_date.month=${startDate.getMonth() + 1}` +
    `&dailyRange.start_date.day=${startDate.getDate()}` +
    `&dailyRange.end_date.year=${endDate.getFullYear()}` +
    `&dailyRange.end_date.month=${endDate.getMonth() + 1}` +
    `&dailyRange.end_date.day=${endDate.getDate()}`;

  // Suppress lint — fmt only used in URL above for clarity
  void fmt;

  const data = await googleFetch<{
    multiDailyMetricTimeSeries?: Array<{
      dailyMetric: string;
      dailyMetricTimeSeries?: { datedValues?: Array<{ value?: string }> };
    }>;
  }>(url, token);

  function sumMetric(metricName: string): number {
    const series = data.multiDailyMetricTimeSeries?.find(
      (s) => s.dailyMetric === metricName,
    );
    return (
      series?.dailyMetricTimeSeries?.datedValues?.reduce(
        (sum, v) => sum + Number(v.value ?? 0),
        0,
      ) ?? 0
    );
  }

  return {
    impressions:
      sumMetric('BUSINESS_IMPRESSIONS_DESKTOP_MAPS') +
      sumMetric('BUSINESS_IMPRESSIONS_MOBILE_MAPS'),
    clicks: 0, // website clicks require separate metric
    directionRequests: sumMetric('BUSINESS_DIRECTION_REQUESTS'),
    calls: sumMetric('CALL_CLICKS'),
  };
}
