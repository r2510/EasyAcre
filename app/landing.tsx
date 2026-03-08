'use client';

import { useState } from 'react';
import { useCityContext } from '@/lib/city-context';
import { PREMIER_CITIES } from '@/lib/cities-data';
import { Globe2, TrendingUp, MessageSquare, Zap, ChevronDown } from 'lucide-react';

interface LandingProps {
  onExplore: () => void;
}

export function Landing({ onExplore }: LandingProps) {
  const [selectedCity, setSelectedCity] = useState('');
  const { setSelectedCityId } = useCityContext();

  const handleExplore = () => {
    if (selectedCity) {
      setSelectedCityId(selectedCity);
      onExplore();
    }
  };

  const features = [
    {
      icon: Globe2,
      title: 'Explore Premier Markets',
      description: 'Navigate the world\'s top property markets with real-time data — no noise, just clarity.',
    },
    {
      icon: MessageSquare,
      title: 'Ask Real Estate Questions',
      description: 'From capital hurdles to market fears—tackle what\'s holding you back from your real estate goals with AI.',
    },
    {
      icon: TrendingUp,
      title: 'Interact with City News',
      description: 'Critically analyze specific news narratives through AI lenses.',
    },
    {
      icon: Zap,
      title: 'News, Distilled',
      description: 'Skip the overload. Get concise summaries of what actually matters in real estate today.',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.4)' }}
      >
        <source src="/wolfre-bg.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="px-8 lg:px-16 py-6 flex items-center">
          <div className="text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase">
              Wolfre
            </h2>
            <p className="text-xs text-white/50 tracking-[0.25em] uppercase">
              Real Estate Intelligence
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center px-8 lg:px-16 py-12">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-5">
                <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                  Real estate,<br />reimagined for you.
                </h1>
                <p className="text-lg lg:text-xl text-white/70 font-light leading-relaxed max-w-lg">
                  The real estate market is cluttered, complex, and often intimidating for retail investors. We&apos;ve stripped away the confusion to build a simple, beautiful experience designed for your growth.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all group"
                    >
                      <div className="p-2 bg-white/10 rounded-md shrink-0 group-hover:bg-white/15 transition">
                        <Icon className="w-4 h-4 text-white/70" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm mb-0.5">
                          {feature.title}
                        </h3>
                        <p className="text-white/40 text-xs leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-end">
              <div className="w-full max-w-md space-y-6 bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 lg:p-10">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-white">Begin Your Journey</h3>
                  <p className="text-sm text-white/50">Choose a premier market to start exploring real estate insights.</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-5 py-4 bg-white/90 backdrop-blur-sm border border-white/10 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40 text-base font-medium shadow-xl transition appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select a Premier Market</option>
                      {PREMIER_CITIES.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}, {city.country}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  <button
                    onClick={handleExplore}
                    disabled={!selectedCity}
                    className="w-full py-4 px-6 bg-white text-gray-900 font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all text-base shadow-xl hover:bg-white/90 transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider"
                  >
                    Explore Now
                  </button>
                </div>

                <div className="pt-2 space-y-3">
                  <div className="flex items-center gap-3 text-white/50">
                    <div className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="text-xs">Real-time market insights &amp; trends</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/50">
                    <div className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="text-xs">AI-powered real estate assistant</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/50">
                    <div className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="text-xs">Curated news from premier global markets</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 lg:px-16 py-5">
          <p className="text-white/30 text-xs tracking-wide">
            &copy; {new Date().getFullYear()} Wolfre &mdash; World of Realty. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
