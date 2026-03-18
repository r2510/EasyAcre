import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url?.trim()) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL is not set. Add it to .env.local or your deployment environment.'
    );
  }
  if (!anonKey?.trim()) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Add it to .env.local or your deployment environment.'
    );
  }
  return { url, anonKey };
}

let _supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!_supabase) {
    const { url, anonKey } = getSupabaseEnv();
    _supabase = createClient(url, anonKey);
  }
  return _supabase;
}

/** Lazy-initialized client; use getSupabaseClient() in new code. */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    // The Supabase client type isn't structural, so we safely cast via `unknown` for Proxy indexing.
    const client = getSupabaseClient() as unknown as Record<string, unknown>;
    const value = client[prop as string];
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(client) : value;
  },
});

export function getServiceClient(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey?.trim()) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Required for server-side operations (e.g. chat logging). Add it to .env.local or your deployment environment.'
    );
  }
  const { url } = getSupabaseEnv();
  return createClient(url, serviceKey);
}
