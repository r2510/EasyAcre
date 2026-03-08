'use client';

import { useCityContext } from '@/lib/city-context';
import { getCityById, CITIES } from '@/lib/cities-data';
import { TrendingUp, Home, MapPin } from 'lucide-react';

interface MarketData {
  rentalYield: string;
  pricePerSqft: string;
  avgPrice: string;
  yoyGrowth: string;
}

interface CountryTopMarket {
  city: string;
  rentalYield: string;
  pricePerSqft: string;
}

const CITY_MARKET_DATA: Record<string, MarketData> = {
  'dubai': { rentalYield: '6.2%', pricePerSqft: '$350', avgPrice: '$450K', yoyGrowth: '+12.4%' },
  'london': { rentalYield: '3.8%', pricePerSqft: '$1,200', avgPrice: '$820K', yoyGrowth: '+4.1%' },
  'new-york': { rentalYield: '4.2%', pricePerSqft: '$1,100', avgPrice: '$950K', yoyGrowth: '+5.3%' },
  'singapore': { rentalYield: '3.5%', pricePerSqft: '$1,400', avgPrice: '$1.1M', yoyGrowth: '+3.8%' },
  'tokyo': { rentalYield: '3.9%', pricePerSqft: '$800', avgPrice: '$520K', yoyGrowth: '+6.2%' },
  'hong-kong': { rentalYield: '2.8%', pricePerSqft: '$2,100', avgPrice: '$1.4M', yoyGrowth: '-1.2%' },
  'paris': { rentalYield: '3.2%', pricePerSqft: '$950', avgPrice: '$680K', yoyGrowth: '+2.9%' },
  'mumbai': { rentalYield: '3.1%', pricePerSqft: '$280', avgPrice: '$320K', yoyGrowth: '+8.5%' },
  'delhi': { rentalYield: '2.8%', pricePerSqft: '$220', avgPrice: '$250K', yoyGrowth: '+7.2%' },
  'bengaluru': { rentalYield: '3.6%', pricePerSqft: '$120', avgPrice: '$180K', yoyGrowth: '+9.1%' },
  'sydney': { rentalYield: '3.4%', pricePerSqft: '$750', avgPrice: '$780K', yoyGrowth: '+5.6%' },
  'toronto': { rentalYield: '3.9%', pricePerSqft: '$680', avgPrice: '$620K', yoyGrowth: '+3.2%' },
  'abu-dhabi': { rentalYield: '5.8%', pricePerSqft: '$300', avgPrice: '$380K', yoyGrowth: '+10.1%' },
  'riyadh': { rentalYield: '5.5%', pricePerSqft: '$180', avgPrice: '$280K', yoyGrowth: '+14.2%' },
  'istanbul': { rentalYield: '5.2%', pricePerSqft: '$150', avgPrice: '$200K', yoyGrowth: '+18.5%' },
  'shanghai': { rentalYield: '2.1%', pricePerSqft: '$900', avgPrice: '$650K', yoyGrowth: '-0.5%' },
  'bangkok': { rentalYield: '4.8%', pricePerSqft: '$180', avgPrice: '$220K', yoyGrowth: '+6.8%' },
  'kuala-lumpur': { rentalYield: '4.5%', pricePerSqft: '$160', avgPrice: '$190K', yoyGrowth: '+5.4%' },
};

const COUNTRY_TOP_MARKETS: Record<string, CountryTopMarket[]> = {
  'India': [
    { city: 'Mumbai', rentalYield: '3.1%', pricePerSqft: '$280' },
    { city: 'Bengaluru', rentalYield: '3.6%', pricePerSqft: '$120' },
    { city: 'New Delhi', rentalYield: '2.8%', pricePerSqft: '$220' },
    { city: 'Hyderabad', rentalYield: '3.4%', pricePerSqft: '$100' },
  ],
  'UAE': [
    { city: 'Dubai', rentalYield: '6.2%', pricePerSqft: '$350' },
    { city: 'Abu Dhabi', rentalYield: '5.8%', pricePerSqft: '$300' },
    { city: 'Sharjah', rentalYield: '7.1%', pricePerSqft: '$120' },
  ],
  'USA': [
    { city: 'New York', rentalYield: '4.2%', pricePerSqft: '$1,100' },
    { city: 'Miami', rentalYield: '5.1%', pricePerSqft: '$480' },
    { city: 'Los Angeles', rentalYield: '3.8%', pricePerSqft: '$750' },
    { city: 'Austin', rentalYield: '4.5%', pricePerSqft: '$320' },
  ],
  'UK': [
    { city: 'London', rentalYield: '3.8%', pricePerSqft: '$1,200' },
    { city: 'Manchester', rentalYield: '5.2%', pricePerSqft: '$350' },
    { city: 'Birmingham', rentalYield: '4.9%', pricePerSqft: '$280' },
  ],
  'Japan': [
    { city: 'Tokyo', rentalYield: '3.9%', pricePerSqft: '$800' },
    { city: 'Osaka', rentalYield: '4.5%', pricePerSqft: '$450' },
    { city: 'Yokohama', rentalYield: '4.1%', pricePerSqft: '$520' },
  ],
  'Singapore': [
    { city: 'Singapore', rentalYield: '3.5%', pricePerSqft: '$1,400' },
  ],
  'China': [
    { city: 'Hong Kong', rentalYield: '2.8%', pricePerSqft: '$2,100' },
    { city: 'Shanghai', rentalYield: '2.1%', pricePerSqft: '$900' },
    { city: 'Shenzhen', rentalYield: '1.8%', pricePerSqft: '$850' },
    { city: 'Beijing', rentalYield: '1.9%', pricePerSqft: '$780' },
  ],
  'France': [
    { city: 'Paris', rentalYield: '3.2%', pricePerSqft: '$950' },
    { city: 'Lyon', rentalYield: '4.1%', pricePerSqft: '$380' },
    { city: 'Marseille', rentalYield: '4.8%', pricePerSqft: '$280' },
  ],
  'Saudi Arabia': [
    { city: 'Riyadh', rentalYield: '5.5%', pricePerSqft: '$180' },
    { city: 'Jeddah', rentalYield: '5.0%', pricePerSqft: '$160' },
  ],
  'Turkey': [
    { city: 'Istanbul', rentalYield: '5.2%', pricePerSqft: '$150' },
    { city: 'Ankara', rentalYield: '4.8%', pricePerSqft: '$80' },
    { city: 'Antalya', rentalYield: '5.8%', pricePerSqft: '$100' },
  ],
  'Australia': [
    { city: 'Sydney', rentalYield: '3.4%', pricePerSqft: '$750' },
    { city: 'Melbourne', rentalYield: '3.8%', pricePerSqft: '$520' },
    { city: 'Brisbane', rentalYield: '4.2%', pricePerSqft: '$380' },
  ],
  'Canada': [
    { city: 'Toronto', rentalYield: '3.9%', pricePerSqft: '$680' },
    { city: 'Vancouver', rentalYield: '3.5%', pricePerSqft: '$820' },
    { city: 'Montreal', rentalYield: '4.3%', pricePerSqft: '$350' },
  ],
  'Thailand': [
    { city: 'Bangkok', rentalYield: '4.8%', pricePerSqft: '$180' },
    { city: 'Phuket', rentalYield: '5.5%', pricePerSqft: '$220' },
    { city: 'Chiang Mai', rentalYield: '5.2%', pricePerSqft: '$80' },
  ],
  'Malaysia': [
    { city: 'Kuala Lumpur', rentalYield: '4.5%', pricePerSqft: '$160' },
    { city: 'Penang', rentalYield: '4.2%', pricePerSqft: '$120' },
    { city: 'Johor Bahru', rentalYield: '4.8%', pricePerSqft: '$90' },
  ],
  'Qatar': [
    { city: 'Doha', rentalYield: '5.0%', pricePerSqft: '$280' },
  ],
};

function getDefaultMarketData(): MarketData {
  return { rentalYield: '4.0%', pricePerSqft: '$250', avgPrice: '$300K', yoyGrowth: '+5.0%' };
}

export function CityInsights() {
  const { selectedCityId } = useCityContext();
  const city = selectedCityId ? getCityById(selectedCityId) : null;

  if (!city) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Home className="w-5 h-5 text-white/20 mb-2" />
          <p className="text-sm text-white/30 font-medium">Select a city to view market snapshot</p>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MapPin className="w-5 h-5 text-white/20 mb-2" />
          <p className="text-sm text-white/30 font-medium">Select a city to view premier markets</p>
        </div>
      </div>
    );
  }

  const data = CITY_MARKET_DATA[city.id] || getDefaultMarketData();
  const countryMarkets = COUNTRY_TOP_MARKETS[city.country] || [];
  const isNegative = data?.yoyGrowth?.startsWith('-');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {/* Market Snapshot — no card */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Home className="w-4 h-4 text-white/40 shrink-0" />
          <span className="text-[11px] font-medium text-white/40 uppercase tracking-[0.2em]">Market Snapshot</span>
          <span className="text-white/20">·</span>
          <span className="text-sm font-semibold text-white/90">{city.name}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <p className="text-[10px] text-white/35 uppercase tracking-widest mb-0.5">Rental Yield</p>
            <p className="text-xl font-semibold text-white tabular-nums">{data?.rentalYield ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/35 uppercase tracking-widest mb-0.5">Price / sqft</p>
            <p className="text-xl font-semibold text-white tabular-nums">{data?.pricePerSqft ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/35 uppercase tracking-widest mb-0.5">Avg. Price</p>
            <p className="text-xl font-semibold text-white tabular-nums">{data?.avgPrice ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/35 uppercase tracking-widest mb-0.5">YoY Growth</p>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-semibold tabular-nums ${isNegative ? 'text-red-400/90' : 'text-emerald-400/90'}`}>
                {data?.yoyGrowth ?? 'N/A'}
              </span>
              <span className={`text-[9px] font-medium uppercase tracking-wider ${isNegative ? 'text-red-400/70' : 'text-emerald-400/70'}`}>
                {isNegative ? 'Down' : 'Up'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Premier Markets — no card, table like snapshot */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-white/40 shrink-0" />
          <span className="text-[11px] font-medium text-white/40 uppercase tracking-[0.2em]">Premier Markets</span>
          <span className="text-white/20">·</span>
          <span className="text-sm font-semibold text-white/90">{city.country}</span>
        </div>
        {countryMarkets?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[200px] border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left py-2 pr-4">
                    <p className="text-[10px] text-white/35 uppercase tracking-widest font-medium">City</p>
                  </th>
                  <th className="text-right py-2 px-2">
                    <p className="text-[10px] text-white/35 uppercase tracking-widest font-medium">Rental Yield</p>
                  </th>
                  <th className="text-right py-2 pl-2">
                    <p className="text-[10px] text-white/35 uppercase tracking-widest font-medium">Price / sqft</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {countryMarkets.slice(0, 6).map((m, i) => (
                  <tr key={i} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors">
                    <td className="py-2.5 pr-4">
                      <span className="text-sm font-semibold text-white/90">{m.city}</span>
                    </td>
                    <td className="text-right py-2.5 px-2 tabular-nums text-emerald-400/90 font-semibold text-sm">
                      {m.rentalYield}
                    </td>
                    <td className="text-right py-2.5 pl-2 tabular-nums text-white/80 text-sm font-medium">
                      {m.pricePerSqft}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-white/25">Market data coming soon for {city.country}</p>
        )}
      </div>
    </div>
  );
}
