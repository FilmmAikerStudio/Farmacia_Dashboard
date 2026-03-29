/**
 * Google Identity Services (GIS) — OAuth 2.0 Token Client
 *
 * Uses the implicit / token model (no client_secret needed in browser).
 * The client_secret is for server-side code only — never put it here.
 *
 * Required Google Cloud Console setup:
 *   1. Add http://localhost:3000 to "Authorised JavaScript origins"
 *   2. Ensure the OAuth consent screen is configured (test users if needed)
 *   3. Enable APIs: Analytics Data API, Business Profile API
 *
 * Scopes requested:
 *   - analytics.readonly  → GA4 Data API
 *   - business.manage     → Google My Business (Business Profile API)
 */

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/business.manage',
].join(' ');

const TOKEN_KEY = 'goog_access_token';
const TOKEN_EXPIRY_KEY = 'goog_token_expiry';

type TokenCallback = (accessToken: string) => void;

// GIS TokenClient handle
let tokenClient: { requestAccessToken: (opts?: { prompt?: string }) => void } | null = null;

// ─── GIS initialisation ───────────────────────────────────────────────────────

/**
 * Loads the Google Identity Services script and initialises the token client.
 * Safe to call multiple times — idempotent.
 *
 * @param onToken  Called every time a fresh access token is obtained.
 */
export function initGoogleAuth(onToken: TokenCallback): Promise<void> {
  return new Promise((resolve) => {
    // Already loaded
    if (typeof window !== 'undefined' && (window as { google?: unknown }).google) {
      initTokenClient(onToken);
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existing) {
      existing.addEventListener('load', () => { initTokenClient(onToken); resolve(); });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => { initTokenClient(onToken); resolve(); };
    script.onerror = () => {
      console.error('Failed to load Google Identity Services script');
      resolve(); // resolve anyway so the app doesn't hang
    };
    document.head.appendChild(script);
  });
}

function initTokenClient(onToken: TokenCallback): void {
  if (!CLIENT_ID) {
    console.warn('VITE_GOOGLE_CLIENT_ID not set — Google integration disabled');
    return;
  }
  type GISWindow = {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (cfg: object) => { requestAccessToken: (opts?: object) => void };
        };
      };
    };
  };
  try {
    tokenClient = (window as unknown as GISWindow).google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: GOOGLE_SCOPES,
      callback: (response: {
        access_token?: string;
        expires_in?: number;
        error?: string;
      }) => {
        if (response.error) {
          console.error('Google OAuth error:', response.error);
          return;
        }
        if (response.access_token) {
          const expiry = Date.now() + (response.expires_in ?? 3600) * 1000;
          localStorage.setItem(TOKEN_KEY, response.access_token);
          localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiry));
          onToken(response.access_token);
        }
      },
    });
  } catch (err) {
    console.error('Google token client init failed:', err);
  }
}

// ─── Public helpers ───────────────────────────────────────────────────────────

/** Triggers the Google sign-in popup. Calls the onToken callback on success. */
export function requestGoogleSignIn(): void {
  if (!tokenClient) {
    console.warn('Google Identity Services not yet initialised');
    return;
  }
  // Use 'consent' prompt only on first sign-in; subsequent calls are silent
  const hasToken = !!localStorage.getItem(TOKEN_KEY);
  tokenClient.requestAccessToken({ prompt: hasToken ? '' : 'consent' });
}

/** Returns a valid stored access token, or null if expired / not present. */
export function getGoogleToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = Number(localStorage.getItem(TOKEN_EXPIRY_KEY) ?? 0);
  if (!token || Date.now() > expiry - 60_000) {
    // Clear expired tokens
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    return null;
  }
  return token;
}

/** Signs the user out and clears stored tokens. */
export function clearGoogleToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  try {
    (window as { google?: { accounts?: { oauth2?: { revoke: (t: string, cb: () => void) => void } } } })
      .google?.accounts?.oauth2?.revoke(
        localStorage.getItem(TOKEN_KEY) ?? '',
        () => {},
      );
  } catch {
    // ignore
  }
}
