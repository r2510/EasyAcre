/**
 * Tavily search for chat: fetches recent real-estate-related web results
 * to inject as context when the user asks for "latest" / "today" / "current" info.
 */

const TAVILY_SEARCH_URL = 'https://api.tavily.com/search';

const REAL_ESTATE_DOMAINS = [
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
];

function getStartDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0]!;
}

export interface TavilyChatResult {
  title: string;
  content: string;
  url: string;
  published_date?: string;
}

const MAX_RESULTS = 8;
const MAX_CONTENT_CHARS_PER_ITEM = 400;
const MAX_TOTAL_CONTEXT_CHARS = 2200;

/**
 * Builds a search query from the user message and optional city.
 * Ensures real estate relevance by prefixing when needed.
 */
export function buildSearchQuery(message: string, cityName?: string): string {
  const cleaned = message
    .replace(/\?|\.|!/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 200);
  const prefix = 'real estate ';
  const query = cleaned.toLowerCase().startsWith('real estate')
    ? cleaned
    : `${prefix}${cleaned}`;
  return cityName ? `${query} ${cityName}` : query;
}

/**
 * Fetches recent real estate / market results from Tavily and returns
 * a formatted string suitable for injection into the model context.
 * Returns null on missing API key or API failure.
 */
export async function searchTavilyForChat(
  query: string,
  apiKey: string,
  options?: { cityName?: string; country?: string }
): Promise<string | null> {
  const searchQuery = options?.cityName
    ? buildSearchQuery(query, options.cityName)
    : buildSearchQuery(query);

  try {
    const res = await fetch(TAVILY_SEARCH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: searchQuery,
        search_depth: 'advanced',
        max_results: MAX_RESULTS,
        topic: 'general',
        start_date: getStartDateDaysAgo(7),
        include_answer: false,
        include_raw_content: false,
        include_images: false,
        include_favicon: false,
        include_domains: REAL_ESTATE_DOMAINS,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn('[tavily-chat] Search failed:', res.status, errText.substring(0, 200));
      return null;
    }

    const data = (await res.json()) as { results?: Array<{ title?: string; content?: string; url?: string; published_date?: string }> };
    const results = data.results || [];

    if (results.length === 0) {
      return null;
    }

    const items: TavilyChatResult[] = results.slice(0, MAX_RESULTS).map((r) => ({
      title: r.title || 'Untitled',
      content: (r.content || '').replace(/\s+/g, ' ').trim().substring(0, MAX_CONTENT_CHARS_PER_ITEM),
      url: r.url || '',
      published_date: r.published_date,
    }));

    const lines: string[] = [];
    let totalLen = 0;

    for (const item of items) {
      const block = `[${item.title}] ${item.content}${item.url ? ` (Source: ${item.url})` : ''}`;
      if (totalLen + block.length > MAX_TOTAL_CONTEXT_CHARS) {
        const remaining = MAX_TOTAL_CONTEXT_CHARS - totalLen - 20;
        if (remaining > 50) {
          lines.push(block.substring(0, remaining) + '...');
        }
        break;
      }
      lines.push(block);
      totalLen += block.length;
    }

    return lines.length > 0 ? lines.join('\n\n') : null;
  } catch (err) {
    console.warn('[tavily-chat] Error:', err);
    return null;
  }
}
