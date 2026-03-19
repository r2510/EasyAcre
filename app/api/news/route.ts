import { NextRequest, NextResponse } from 'next/server';
import { getClientIdentifier, checkRateLimit, NEWS_RATE_LIMIT } from '@/lib/rate-limit';

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL =
  process.env.GROQ_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct';
const GROQ_FALLBACK_MODELS = (process.env.GROQ_FALLBACK_MODELS || '')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free';
const OPENROUTER_FALLBACK_MODELS = (process.env.OPENROUTER_FALLBACK_MODELS || '')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

interface SummaryProvider {
  name: string;
  baseUrl: string;
  apiKey: string;
  models: string[];
  headers?: Record<string, string>;
}

function buildSummaryProviders(): SummaryProvider[] {
  const providers: SummaryProvider[] = [];
  if (GROQ_API_KEY) {
    providers.push({
      name: 'Groq',
      baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
      apiKey: GROQ_API_KEY,
      models: [GROQ_MODEL, ...GROQ_FALLBACK_MODELS],
    });
  }
  if (OPENROUTER_API_KEY) {
    providers.push({
      name: 'OpenRouter',
      baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: OPENROUTER_API_KEY,
      models: [OPENROUTER_MODEL, ...OPENROUTER_FALLBACK_MODELS],
      headers: {
        'HTTP-Referer':
          process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'EasyAcre',
      },
    });
  }
  return providers;
}

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
  favicon?: string;
}

interface TavilyResponse {
  results: TavilyResult[];
}

function getStartDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0]!;
}

async function searchTavily(
  cityName: string,
  country: string
): Promise<TavilyResponse> {
  const query = `Latest real estate property market news and trends in ${cityName}, ${country}`;

  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TAVILY_API_KEY}`,
    },
    body: JSON.stringify({
      query,
      search_depth: 'advanced',
      max_results: 15,
      topic: 'general',
      start_date: getStartDateDaysAgo(3),
      include_answer: false,
      include_raw_content: false,
      include_images: false,
      include_favicon: true,
      include_domains: [
        'reuters.com',
        'bloomberg.com',
        'cnbc.com',
        'wsj.com',
        'ft.com',
        'economictimes.indiatimes.com',
        'moneycontrol.com',
        'livemint.com',
        'housing.com',
        '99acres.com',
        'magicbricks.com',
        'therealdeal.com',
        'bisnow.com',
        'globest.com',
        'realtor.com',
        'zillow.com',
        'propertywire.com',
        'mingtiandi.com',
        'arabianbusiness.com',
        'gulfnews.com',
        'scmp.com',
        'straitstimes.com',
        'japantimes.co.jp',
        'bbc.com',
        'theguardian.com',
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Tavily search failed (${res.status}): ${errorText}`);
  }

  return res.json();
}

const CITY_ALIASES: Record<string, string[]> = {
  'new york': ['nyc', 'manhattan', 'brooklyn', 'queens', 'bronx'],
  'new delhi': ['delhi', 'ncr', 'gurgaon', 'noida'],
  'mumbai': ['bombay'],
  'bengaluru': ['bangalore'],
  'chennai': ['madras'],
  'kolkata': ['calcutta'],
  'ho chi minh city': ['saigon', 'hcmc'],
  'washington d.c.': ['washington dc', 'washington d.c'],
  'são paulo': ['sao paulo'],
  'bogotá': ['bogota'],
  "xi'an": ['xian'],
};

function cityRelevanceScore(
  result: TavilyResult,
  cityName: string,
  country: string
): number {
  const titleLower = result.title.toLowerCase();
  const contentLower = (result.content || '').toLowerCase();
  const cityLower = cityName.toLowerCase();
  const countryLower = country.toLowerCase();

  const names = [cityLower, ...(CITY_ALIASES[cityLower] || [])];

  let score = result.score || 0;

  for (const name of names) {
    if (titleLower.includes(name)) { score += 3; break; }
  }
  for (const name of names) {
    if (contentLower.includes(name)) { score += 2; break; }
  }
  if (countryLower && (titleLower.includes(countryLower) || contentLower.includes(countryLower))) {
    score += 1;
  }

  return score;
}

const SUMMARY_TIMEOUT_MS = 15_000;

async function trySummarizeWithProvider(
  provider: SummaryProvider,
  model: string,
  messages: { role: string; content: string }[]
): Promise<{ ok: true; summary: string } | { ok: false }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUMMARY_TIMEOUT_MS);
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
        max_tokens: 250,
        temperature: 0.3,
      }),
    });
    if (!res.ok) {
      const errBody = await res.text();
      console.warn(
        `[news] ${provider.name}/${model} failed (${res.status}):`,
        errBody.substring(0, 200)
      );
      return { ok: false };
    }
    const data = await res.json();
    const summary = data.choices?.[0]?.message?.content?.trim();
    if (!summary) {
      console.warn(`[news] ${provider.name}/${model} returned empty summary`);
      return { ok: false };
    }
    return { ok: true, summary };
  } catch (err) {
    console.warn(`[news] ${provider.name}/${model} error:`, err);
    return { ok: false };
  } finally {
    clearTimeout(timeout);
  }
}

async function summarizeWithAI(
  title: string,
  content: string,
  cityName: string,
  country: string
): Promise<string | null> {
  const providers = buildSummaryProviders();
  if (providers.length === 0) {
    console.warn(
      'No AI provider for news summary. Set GROQ_API_KEY or OPENROUTER_API_KEY.'
    );
    return null;
  }

  const cleanContent = content
    .replace(/Advertisement/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 1500);

  const systemContent = `You are a concise real estate news summarizer. The user is reading news about the real estate market in ${cityName}, ${country}. Given a news article title and content, write a 4-5 line summary that highlights how the article relates to the ${cityName} real estate market. Focus on key facts, numbers, locations, and market implications specific to ${cityName}. Output ONLY the plain text summary — no headings, no bullet points, no markdown, no asterisks, no ads.`;
  const userContent = `Summarize this real estate news about ${cityName} in 4-5 lines:\n\nTitle: ${title}\n\nContent: ${cleanContent}`;
  const messages = [
    { role: 'system', content: systemContent },
    { role: 'user', content: userContent },
  ];

  for (const provider of providers) {
    for (const model of provider.models) {
      const result = await trySummarizeWithProvider(provider, model, messages);
      if (result.ok) return result.summary;
      if (provider.name === 'Groq') {
        // On auth failure, skip rest of Groq models
        // (could check status if we exposed it; for now we try next provider)
      }
    }
  }
  return null;
}

function cleanContentForFallback(raw: string): string {
  return raw
    .replace(/Advertisement/gi, '')
    .replace(/Sign\s*up|Subscribe|Newsletter|Log\s*in|Register/gi, '')
    .replace(/\[.*?\]/g, '')
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*{1,2}/g, '')
    .replace(/\n{2,}/g, '\n')
    .replace(/\s{2,}/g, ' ')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 30)
    .slice(0, 5)
    .join('\n')
    .substring(0, 500)
    .trim();
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}

function formatDate(dateStr?: string): string {
  if (!dateStr) {
    return new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export async function GET(request: NextRequest) {
  const clientId = getClientIdentifier(request);
  const limitKey = `news:${clientId}`;
  const limit = checkRateLimit(limitKey, NEWS_RATE_LIMIT);
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

  const city = request.nextUrl.searchParams.get('city');
  const country = request.nextUrl.searchParams.get('country') || '';

  if (!city) {
    return NextResponse.json(
      { error: 'Missing "city" query parameter' },
      { status: 400 }
    );
  }

  if (!TAVILY_API_KEY) {
    return NextResponse.json(
      { error: 'TAVILY_API_KEY not configured' },
      { status: 500 }
    );
  }

  try {
    const tavilyData = await searchTavily(city, country);
    const allResults = tavilyData.results || [];

    if (allResults.length === 0) {
      const payload: { news: unknown[]; debug?: { raw_titles: string[] } } = { news: [] };
      if (process.env.NODE_ENV !== 'production') payload.debug = { raw_titles: [] };
      return NextResponse.json(payload);
    }

    const scored = allResults
      .map((r) => ({ result: r, relevance: cityRelevanceScore(r, city, country) }))
      .sort((a, b) => b.relevance - a.relevance);

    const top = scored.slice(0, 10).map((s) => s.result);

    const batchSize = 5;
    const newsItems: Array<{
      id: string;
      title: string;
      url: string;
      domain: string;
      favicon: string;
      summary: string;
      date: string;
    }> = [];

    for (let i = 0; i < top.length; i += batchSize) {
      const batch = top.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (result, batchIndex) => {
          const index = i + batchIndex;
          const domain = extractDomain(result.url);
          const summary = await summarizeWithAI(
            result.title,
            result.content,
            city,
            country
          );

          const fallback = cleanContentForFallback(result.content || '');

          return {
            id: `news-${index}`,
            title: result.title,
            url: result.url,
            domain,
            favicon: result.favicon || `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
            summary: summary || fallback || 'Click to read the full article.',
            date: formatDate(result.published_date),
          };
        })
      );
      newsItems.push(...batchResults);
    }

    const payload: { news: typeof newsItems; debug?: { raw_titles: string[] } } = {
      news: newsItems,
    };
    if (process.env.NODE_ENV !== 'production') {
      payload.debug = { raw_titles: allResults.map((r) => r.title) };
    }
    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to fetch news',
      },
      { status: 500 }
    );
  }
}
