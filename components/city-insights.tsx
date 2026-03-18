'use client';

import { useCityContext } from '@/lib/city-context';
import { useCitiesData } from '@/lib/cities-data-provider';
import { formatPrice } from '@/lib/currency';
import { TrendingUp, Home, MapPin } from 'lucide-react';

/** Display price from DB as-is; if value is legacy (starts with $), format with country currency */
function displayPrice(value: string | undefined | null, currencyCode: string | undefined): string {
  if (value == null || value === '') return '—';
  if (!/^\$/.test(value)) return value;
  return formatPrice(value, currencyCode);
}

const DEFAULT_SNAPSHOT = {
  rentalYield: '4.0%',
  pricePerSqft: '250',
  avgPrice: '300K',
  yoyGrowth: '+5.0%',
};

export function CityInsights() {
  const { selectedCityId } = useCityContext();
  const { getCityById, getCountryMarkets } = useCitiesData();
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

  const data = city.snapshot ?? DEFAULT_SNAPSHOT;
  const countryMarkets = getCountryMarkets(city.country);
  const isNegative = data.yoyGrowth.startsWith('-');

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
            <p className="text-xl font-semibold text-white tabular-nums">{data.rentalYield}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/35 uppercase tracking-widest mb-0.5">Price / sqft</p>
            <p className="text-xl font-semibold text-white tabular-nums">{displayPrice(data.pricePerSqft, city.currency_code)}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/35 uppercase tracking-widest mb-0.5">Avg. Price</p>
            <p className="text-xl font-semibold text-white tabular-nums">{displayPrice(data.avgPrice, city.currency_code)}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/35 uppercase tracking-widest mb-0.5">YoY Growth</p>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-semibold tabular-nums ${isNegative ? 'text-red-400/90' : 'text-emerald-400/90'}`}>
                {data.yoyGrowth}
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
        {countryMarkets.length > 0 ? (
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
                {countryMarkets.map((m, i) => (
                  <tr key={m.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors">
                    <td className="py-2.5 pr-4">
                      <span className="text-sm font-semibold text-white/90">{m.name}</span>
                    </td>
                    <td className="text-right py-2.5 px-2 tabular-nums text-emerald-400/90 font-semibold text-sm">
                      {m.snapshot?.rentalYield ?? '—'}
                    </td>
                    <td className="text-right py-2.5 pl-2 tabular-nums text-white/80 text-sm font-medium">
                      {displayPrice(m.snapshot?.pricePerSqft, m.currency_code)}
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
