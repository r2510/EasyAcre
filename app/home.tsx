'use client';

import { useState, useEffect } from 'react';
import { WorldMap } from '@/components/world-map';
import { NewsFeed } from '@/components/news-feed';
import { EasyAcreChatPanel } from '@/components/easyacre-chat-panel';
import { EasyAcreLogo } from '@/components/easyacre-logo';
import { CityInsights } from '@/components/city-insights';
import { useCityContext } from '@/lib/city-context';
import { useCitiesData } from '@/lib/cities-data-provider';
import { MessageCircle, MapPin, Newspaper, Bot } from 'lucide-react';

interface HomeProps {
  onLogout: () => void;
}

type TabId = 'chat' | 'news';

export function Home({ onLogout }: HomeProps) {
  const { selectedCityId, chatOpen, setChatOpen } = useCityContext();
  const { getCityById } = useCitiesData();
  const city = selectedCityId ? getCityById(selectedCityId) : null;

  // Chat is the primary tab
  const [activeTab, setActiveTab] = useState<TabId>('chat');

  // When something requests the chat (e.g. clicking "Ask EasyAcre" on a news card),
  // switch to the chat tab and reset the one-shot signal.
  useEffect(() => {
    if (chatOpen) {
      setActiveTab('chat');
      setChatOpen(false);
    }
  }, [chatOpen, setChatOpen]);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col overflow-hidden">
      {/* Sticky Header */}
      <header className="shrink-0 z-50 flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-10 py-3 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 hover:opacity-70 transition-opacity shrink-0"
        >
          <EasyAcreLogo size={36} showText />
        </button>

        {/* Tab switcher */}
        <div
          role="tablist"
          aria-label="Main sections"
          className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl"
        >
          <button
            role="tab"
            aria-selected={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold tracking-wide rounded-lg transition-all ${
              activeTab === 'chat'
                ? 'bg-white text-black shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Ask EasyAcre</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'news'}
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold tracking-wide rounded-lg transition-all ${
              activeTab === 'news'
                ? 'bg-white text-black shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>City News</span>
          </button>
        </div>

        <button
          onClick={onLogout}
          className="px-3 py-1.5 text-[11px] font-bold tracking-wide text-white/40 hover:text-white/70 transition-all shrink-0"
        >
          Exit
        </button>
      </header>

      {/* Tab content — both panels stay mounted (with real layout dimensions, not display:none)
          so their state is preserved AND children like the Leaflet map always have a valid size. */}
      <main className="flex-1 min-h-0 relative">
        {/* Tab 1: Chat (primary) */}
        <div
          role="tabpanel"
          aria-hidden={activeTab !== 'chat'}
          inert={activeTab !== 'chat'}
          className={`absolute inset-0 flex transition-opacity duration-150 ${
            activeTab === 'chat'
              ? 'opacity-100 z-10'
              : 'opacity-0 pointer-events-none -z-10'
          }`}
        >
          <EasyAcreChatPanel />
        </div>

        {/* Tab 2: City News (existing main page content, unchanged) */}
        <div
          role="tabpanel"
          aria-hidden={activeTab !== 'news'}
          inert={activeTab !== 'news'}
          className={`absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-hide transition-opacity duration-150 ${
            activeTab === 'news'
              ? 'opacity-100 z-10'
              : 'opacity-0 pointer-events-none -z-10'
          }`}
        >
          {/* Section 1: Context / Welcome */}
          <section className="px-6 lg:px-10 py-10 lg:py-14">
            <div className="max-w-4xl">
              <h2 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
                {city ? (
                  <>
                    Exploring{' '}
                    <span className="text-white/60">
                      {city.name}, {city.country}
                    </span>
                  </>
                ) : (
                  <>
                    Explore <br />
                    real estate markets.
                  </>
                )}
              </h2>
              <p className="text-base lg:text-lg text-white/50 leading-relaxed max-w-2xl mb-6">
                {city
                  ? `Live market intelligence, curated news, and AI-powered insights for ${city.name}. Click any city on the map to switch markets.`
                  : 'Navigate the premier property markets. Select a city on the map below to get started with real-time news, market data, and AI analysis.'}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/30 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> 145+ Cities
                </span>
                <span className="text-white/10">|</span>
                <span className="flex items-center gap-1.5">
                  <Newspaper className="w-3 h-3" /> Live News
                </span>
                <span className="text-white/10">|</span>
                <span className="flex items-center gap-1.5">
                  <Bot className="w-3 h-3" /> AI Assistant
                </span>
              </div>
            </div>
          </section>

          {/* Section 2: Insight Cards */}
          <section className="px-6 lg:px-10 pb-8">
            <CityInsights />
          </section>

          {/* Section 3: Map + News side by side */}
          <section className="px-6 lg:px-10 pb-10">
            <div className="flex flex-col lg:flex-row gap-5">
              {/* Map */}
              <div className="h-[500px] lg:h-[600px] lg:w-[45%] xl:w-[42%] shrink-0 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden shadow-2xl">
                <WorldMap />
              </div>
              {/* News Feed */}
              <div className="h-[550px] lg:h-[600px] flex-1 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden shadow-2xl">
                <NewsFeed />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
