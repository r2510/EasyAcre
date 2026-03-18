import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { buildSystemPrompt } from '@/lib/prompts';
import { getClientIdentifier, checkRateLimit, CHAT_RATE_LIMIT } from '@/lib/rate-limit';
import { searchTavilyForChat } from '@/lib/tavily-chat-search';

// --- Provider configs ---

interface ProviderConfig {
  name: string;
  baseUrl: string;
  apiKey: string;
  models: string[];
  headers?: Record<string, string>;
}

function buildProviders(): ProviderConfig[] {
  const providers: ProviderConfig[] = [];

  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    const primary = process.env.GROQ_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct';
    const fallbacks = (process.env.GROQ_FALLBACK_MODELS || '')
      .split(',').map((m) => m.trim()).filter(Boolean);
    providers.push({
      name: 'Groq',
      baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
      apiKey: groqKey,
      models: [primary, ...fallbacks],
    });
  }

  const orKey = process.env.OPENROUTER_API_KEY;
  if (orKey) {
    const primary = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free';
    const fallbacks = (process.env.OPENROUTER_FALLBACK_MODELS || '')
      .split(',').map((m) => m.trim()).filter(Boolean);
    providers.push({
      name: 'OpenRouter',
      baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: orKey,
      headers: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Wolfre',
      },
      models: [primary, ...fallbacks],
    });
  }

  return providers;
}

// --- Latest-info detection (Option A: keyword-based) ---

/** Message from "Ask Wolfre" on a news item — we already have article context, skip Tavily. */
const ASK_WOLFRE_NEWS_PREFIX = 'Regarding this news:';

const LATEST_INFO_KEYWORDS = [
  'today',
  'latest',
  'current',
  'recent',
  'this week',
  'this month',
  'right now',
  'breaking',
  'just happened',
  'new developments',
  "what's happening",
  'what is happening',
  'market drop',
  'market crash',
  'market news',
  'recent news',
  'current news',
  'latest news',
  'any updates',
  'any recent',
];

function isAskWolfreNewsMessage(message: string): boolean {
  return message.trim().startsWith(ASK_WOLFRE_NEWS_PREFIX);
}

function needsLatestInfo(message: string): boolean {
  if (isAskWolfreNewsMessage(message)) return false;
  const lower = message.toLowerCase().trim();
  return LATEST_INFO_KEYWORDS.some((kw) => lower.includes(kw));
}

// --- Types ---

interface ChatRequest {
  message: string;
  userName: string;
  cityName?: string;
  sessionId: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

interface ChatResult {
  response: string;
  topic: string;
  sentiment: string;
  model: string;
}

type ParsedResponse = Omit<ChatResult, 'model'>;

// --- Response parsing ---

const MODEL_TIMEOUT_MS = 15_000;
const CLASSIFICATION_REGEX = /\|\|\|\s*(\{[\s\S]*?\})\s*\|\|\|\s*$/;

function parseResponse(raw: string): ParsedResponse {
  const match = raw.match(CLASSIFICATION_REGEX);

  let topic = 'General';
  let sentiment = 'neutral';
  let response = raw;

  if (match) {
    response = raw.replace(CLASSIFICATION_REGEX, '').trim();
    try {
      const parsed = JSON.parse(match[1]);
      if (typeof parsed.topic === 'string') topic = parsed.topic;
      if (typeof parsed.sentiment === 'string') sentiment = parsed.sentiment;
    } catch {
      // classification parse failed, keep defaults
    }
  }

  return { response, topic, sentiment };
}

// --- Model invocation ---

type TryResult =
  | { ok: true; raw: string; ms: number }
  | { ok: false; status: number; body: string; ms: number };

async function tryModel(
  provider: ProviderConfig,
  model: string,
  messages: { role: string; content: string }[]
): Promise<TryResult> {
  const start = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MODEL_TIMEOUT_MS);

  try {
    const res = await fetch(provider.baseUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${provider.apiKey}`,
        ...(provider.headers || {}),
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 450,
        temperature: 0.5,
      }),
    });

    const ms = Date.now() - start;

    if (!res.ok) {
      const body = await res.text();
      return { ok: false, status: res.status, body, ms };
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || '';
    return { ok: true, raw, ms };
  } catch (err) {
    const ms = Date.now() - start;
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, status: 408, body: `Timeout after ${MODEL_TIMEOUT_MS}ms`, ms };
    }
    return { ok: false, status: 0, body: String(err), ms };
  } finally {
    clearTimeout(timeout);
  }
}

// --- Main orchestrator ---

async function getAIResponse(
  message: string,
  cityName: string | undefined,
  history: { role: string; content: string }[],
  latestContext: string | null = null
): Promise<ChatResult> {
  const systemContent = buildSystemPrompt(cityName, latestContext);

  const cleanHistory = history.slice(-8).map((h) => ({
    role: h.role,
    content: h.content.replace(CLASSIFICATION_REGEX, '').trim(),
  }));

  const messages = [
    { role: 'system', content: systemContent },
    ...cleanHistory,
    { role: 'user', content: message },
  ];

  const providers = buildProviders();
  if (providers.length === 0) {
    throw new Error('No AI providers configured. Set GROQ_API_KEY or OPENROUTER_API_KEY.');
  }

  let lastError = '';

  for (const provider of providers) {
    for (const model of provider.models) {
      const label = `${provider.name}/${model}`;

      const result = await tryModel(provider, model, messages);

      if (result.ok) {
        const parsed = parseResponse(result.raw);
        return { ...parsed, model: label };
      }

      lastError = result.body;
      console.warn(`[chat] ✗ ${label} failed (${result.status}) in ${result.ms}ms`);

      if (result.status === 401 || result.status === 403) {
        console.error(`[chat] Auth failed for ${provider.name}, skipping provider`);
        break;
      }
    }
  }

  throw new Error(`All providers failed. Last error: ${lastError.substring(0, 300)}`);
}

// --- Supabase logging ---

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function ensureValidSessionId(sessionId: string | undefined): string {
  if (sessionId && UUID_REGEX.test(sessionId)) return sessionId;
  return crypto.randomUUID();
}

interface LogPayload {
  session_id: string;
  name: string;
  city: string | null;
  topic: string;
  user_query: string;
  ai_response: string;
  sentiment: string;
  response_time_ms: number;
}

async function logToSupabase(payload: LogPayload): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('[chat] SUPABASE_SERVICE_ROLE_KEY not set — chat will not be stored in DB');
    return { ok: false, error: 'Service role key not configured' };
  }
  try {
    const supabase = getServiceClient();
    const { error } = await supabase.from('chat_queries').insert(payload);
    if (error) {
      console.error('[chat] Supabase insert failed:', error.message, error.details);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[chat] Supabase logging failed:', msg);
    return { ok: false, error: msg };
  }
}

// --- API handler ---

export async function POST(request: NextRequest) {
  const clientId = getClientIdentifier(request);
  const limitKey = `chat:${clientId}`;
  const limit = checkRateLimit(limitKey, CHAT_RATE_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)),
        },
      }
    );
  }

  try {
    const body: ChatRequest = await request.json();
    const { message, userName, cityName, sessionId, history = [] } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let latestContext: string | null = null;
    if (needsLatestInfo(message)) {
      const tavilyKey = process.env.TAVILY_API_KEY;
      if (tavilyKey) {
        latestContext = await searchTavilyForChat(message, tavilyKey, {
          cityName: cityName || undefined,
        });
      }
    }

    const startTime = Date.now();
    const { response, topic, sentiment, model } = await getAIResponse(
      message,
      cityName,
      history,
      latestContext
    );
    const responseTimeMs = Date.now() - startTime;

    const logResult = await logToSupabase({
      session_id: ensureValidSessionId(sessionId),
      name: userName || 'Anonymous',
      city: cityName ?? 'General',
      topic,
      user_query: message,
      ai_response: response,
      sentiment,
      response_time_ms: responseTimeMs,
    });
    if (!logResult.ok) {
      console.warn('[chat] Chat not persisted to DB:', logResult.error);
    }

    return NextResponse.json({ response, topic, sentiment, model, responseTimeMs });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Chat request failed' },
      { status: 500 }
    );
  }
}
