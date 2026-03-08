'use client';

import { useEffect, useState, useCallback } from 'react';
import { getCityById } from '@/lib/cities-data';
import { useCityContext } from '@/lib/city-context';
import { ExternalLink, Loader2, Newspaper, RefreshCw, AlertCircle, MessageCircle } from 'lucide-react';

interface DynamicNewsItem {
  id: string;
  title: string;
  url: string;
  domain: string;
  favicon: string;
  summary: string;
  date: string;
}

export function NewsFeed() {
  const { selectedCityId, openChatWithNews } = useCityContext();
  const [news, setNews] = useState<DynamicNewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animate, setAnimate] = useState(false);

  const city = selectedCityId ? getCityById(selectedCityId) : null;

  const fetchNews = useCallback(async (cityName: string, countryName: string) => {
    setLoading(true);
    setError(null);
    setNews([]);
    setAnimate(false);

    try {
      const res = await fetch(
        `/api/news?city=${encodeURIComponent(cityName)}&country=${encodeURIComponent(countryName)}`
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to fetch news (${res.status})`);
      }

      const data = await res.json();
      setNews(data.news || []);
      setAnimate(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong fetching news.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (city) {
      fetchNews(city.name, city.country);
    } else {
      setNews([]);
      setError(null);
      setAnimate(false);
    }
  }, [city?.id]);

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden">
      <div className="p-4 border-b border-white/10 bg-white/5 shrink-0">
        {city ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-lg font-bold text-white">{city.name}</h2>
                <span className="text-sm text-white/50">· {city.country}</span>
              </div>
              <p className="text-xs text-white/40">
                Latest &amp; trending real estate insights
              </p>
            </div>
            {!loading && news.length > 0 && (
              <button
                onClick={() => fetchNews(city.name, city.country)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                title="Refresh news"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-white">Real Estate News</h2>
            <p className="text-xs text-white/40">
              Select a city on the map to view live news
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full p-8 gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white/80 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white">
                Fetching latest news for {city?.name}...
              </p>
              <p className="text-xs text-white/40 mt-1">
                Searching top sources &amp; generating AI summaries
              </p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center h-full p-8 gap-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-red-300">{error}</p>
              {city && (
                <button
                  onClick={() => fetchNews(city.name, city.country)}
                  className="mt-3 px-4 py-2 text-xs font-semibold bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
                >
                  Try again
                </button>
              )}
            </div>
          </div>
        )}

        {!loading && !error && news.length > 0 && (
          <div className="p-4 space-y-4">
            {news.map((item, idx) => (
              <div
                key={item.id}
                className={`group rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg transition-all duration-300 overflow-hidden ${
                  animate ? 'animate-in fade-in slide-in-from-bottom-3' : ''
                }`}
                style={animate ? { animationDelay: `${idx * 80}ms`, animationFillMode: 'both' } : undefined}
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4"
                >
                  <h3 className="font-bold text-white text-sm leading-tight group-hover:text-blue-300 transition-colors mb-2">
                    {item.title}
                    <ExternalLink className="inline-block w-3 h-3 ml-1 opacity-0 group-hover:opacity-60 transition-opacity -translate-y-0.5" />
                  </h3>

                  <p className="text-xs text-white/60 leading-relaxed whitespace-pre-line mb-3">
                    {item.summary}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-white/40">{item.date}</span>
                    <div className="relative group/favicon">
                      <img
                        src={item.favicon}
                        alt={item.domain}
                        width={16}
                        height={16}
                        className="rounded-sm opacity-70 group-hover:opacity-100 transition-opacity invert"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-[10px] font-medium bg-white text-black rounded whitespace-nowrap opacity-0 group-hover/favicon:opacity-100 transition-opacity pointer-events-none z-10">
                        {item.domain}
                      </span>
                    </div>
                  </div>
                </a>

                <div className="px-4 pb-3 pt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openChatWithNews(item.title, item.summary, item.url);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-white/80 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-all"
                  >
                    <MessageCircle className="w-3 h-3" />
                    Ask Wolfre
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && news.length === 0 && !city && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-3">
            <Newspaper className="w-10 h-10 text-white/20" />
            <div>
              <p className="text-white/40 mb-1">No city selected</p>
              <p className="text-xs text-white/30">
                Click on a city on the map to view live real estate news
              </p>
            </div>
          </div>
        )}

        {!loading && !error && news.length === 0 && city && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-3">
            <Newspaper className="w-10 h-10 text-white/20" />
            <div>
              <p className="text-white/40 mb-1">No news found</p>
              <p className="text-xs text-white/30">
                No real estate news found for {city.name}. Try refreshing.
              </p>
              <button
                onClick={() => fetchNews(city.name, city.country)}
                className="mt-3 px-4 py-2 text-xs font-semibold bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>

      {!loading && news.length > 0 && (
        <div className="px-4 py-2 border-t border-white/10 bg-white/5 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-white/40">
            {news.length} results for {city?.name}
          </span>
          <span className="text-[11px] text-white/20">
            Powered by AI
          </span>
        </div>
      )}
    </div>
  );
}
