import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

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

// --- System prompt ---

const SYSTEM_PROMPT = `You are Wolfre, a professional real estate agent and investment advisor. You ONLY discuss topics related to real estate. Your areas of expertise are:
- Property buying, selling, and investment strategies
- Mortgage, financing, and loan guidance
- Zoning laws, permits, and regulations
- Rental yield and ROI calculations
- Neighborhood analysis and city comparisons
- Real estate market trends and forecasts
- Property valuation and pricing
- Tax implications of real estate transactions
- Legal aspects of property ownership
- Construction, renovation, and development

STRICT BOUNDARY: You must NEVER answer questions unrelated to real estate, property, or housing. If a user asks about cooking, sports, programming, entertainment, health, or ANY non-real-estate topic, politely decline and redirect them back to real estate. Example: "I appreciate the question, but I'm Wolfre — your dedicated real estate assistant! I can help with property investment, mortgages, market trends, and more. What would you like to know about real estate?"

Rules:
- Keep responses concise (3-5 sentences) unless the user asks for detail.
- Use real estate terminology but explain it simply.
- When discussing specific cities, reference local market dynamics.
- If you don't know current data, say so and suggest where to find it.
- Be friendly, professional, and confident like a seasoned real estate agent.
- When relevant, proactively suggest related real estate topics the user might find useful.

IMPORTANT: At the very end of every response, on a new line, append a JSON classification block in exactly this format:
|||{"topic":"<ONE_WORD>","sentiment":"<WORD>"}|||

- "topic" must be exactly one word from: Mortgage, Zoning, Investment, Rental, Pricing, Tax, Legal, Insurance, Market, Neighborhood, Construction, General
- "sentiment" must be one of: positive, negative, neutral, frustrated, curious

This classification block describes the USER's question, not your answer. Always include it. Never omit it.`;

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
  history: { role: string; content: string }[]
): Promise<ChatResult> {
  const systemContent = cityName
    ? `${SYSTEM_PROMPT}\n\nThe user is currently exploring ${cityName}. Tailor your answers to this city's real estate market when relevant.`
    : SYSTEM_PROMPT;

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

async function logToSupabase(payload: LogPayload) {
  try {
    const supabase = getServiceClient();
    await supabase.from('chat_queries').insert(payload);
  } catch (err) {
    console.error('Supabase logging failed:', err);
  }
}

// --- API handler ---

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, userName, cityName, sessionId, history = [] } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const startTime = Date.now();
    const { response, topic, sentiment, model } = await getAIResponse(message, cityName, history);
    const responseTimeMs = Date.now() - startTime;

    logToSupabase({
      session_id: sessionId,
      name: userName || 'Anonymous',
      city: cityName || null,
      topic,
      user_query: message,
      ai_response: response,
      sentiment,
      response_time_ms: responseTimeMs,
    });

    return NextResponse.json({ response, topic, sentiment, model, responseTimeMs });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Chat request failed' },
      { status: 500 }
    );
  }
}
