/**
 * In-memory rate limiter. Use per-IP to limit abuse of paid APIs (chat, news).
 * Note: In serverless/multi-instance deployments this is per-instance; for strict
 * limits across instances consider Upstash Redis or your host's rate limiting.
 */

const store = new Map<
  string,
  { count: number; resetAt: number }
>();

const WINDOW_MS = 60 * 1000; // 1 minute

export interface RateLimitOptions {
  /** Max requests per window (default 25 for chat, 30 for news). */
  max: number;
  /** Window in ms (default 60_000). */
  windowMs?: number;
}

export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
  return ip;
}

/**
 * Check rate limit for a key. Returns { allowed: true } or { allowed: false, retryAfterMs }.
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions
): { allowed: true } | { allowed: false; retryAfterMs: number } {
  const now = Date.now();
  const windowMs = options.windowMs ?? WINDOW_MS;
  const entry = store.get(key);

  if (!entry) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= options.max) {
    return { allowed: false, retryAfterMs: Math.ceil((entry.resetAt - now) / 1000) * 1000 };
  }

  entry.count += 1;
  return { allowed: true };
}

/** Limit for chat API (AI + DB write). */
export const CHAT_RATE_LIMIT = { max: 25, windowMs: WINDOW_MS };

/** Limit for news API (Tavily + AI summaries). */
export const NEWS_RATE_LIMIT = { max: 30, windowMs: WINDOW_MS };
