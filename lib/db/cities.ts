import { supabase } from '@/lib/supabase';
import type { City, CitySnapshot, CityWithSnapshot } from './types';

const DEFAULT_SNAPSHOT: CitySnapshot = {
  rentalYield: '4.0%',
  pricePerSqft: '250',
  avgPrice: '300K',
  yoyGrowth: '+5.0%',
};

function rowToSnapshot(row: {
  rental_yield: string | null;
  price_per_sqft: string | null;
  avg_price: string | null;
  yoy_growth: string | null;
}): CitySnapshot {
  return {
    rentalYield: row.rental_yield ?? DEFAULT_SNAPSHOT.rentalYield,
    pricePerSqft: row.price_per_sqft ?? DEFAULT_SNAPSHOT.pricePerSqft,
    avgPrice: row.avg_price ?? DEFAULT_SNAPSHOT.avgPrice,
    yoyGrowth: row.yoy_growth ?? DEFAULT_SNAPSHOT.yoyGrowth,
  };
}

/** Fetch all cities with country name and currency */
export async function fetchCities(): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('id, name, country_id, lat, lng, is_premier, countries(name, currency_code)')
    .order('name');

  if (error) throw error;
  if (!data?.length) return [];

  return data.map(
    (
      row: {
        id: string;
        name: string;
        country_id: string;
        lat: number;
        lng: number;
        is_premier: boolean;
        // Supabase can return join results as an object or as an array (depending on relationship cardinality).
        // We support both shapes to avoid TS build failures.
        countries:
          | { name: string; currency_code?: string | null }[]
          | { name: string; currency_code?: string | null }
          | null;
      }
    ) => {
      const countryJoined = Array.isArray(row.countries)
        ? row.countries[0] ?? null
        : row.countries;

      return {
        id: row.id,
        name: row.name,
        country: countryJoined?.name ?? row.country_id,
        lat: row.lat,
        lng: row.lng,
        is_premier: row.is_premier,
        currency_code: countryJoined?.currency_code ?? undefined,
      };
    }
  );
}

/** Fetch latest snapshot per city (one row per city, most recent as_of_date) */
export async function fetchLatestSnapshots(): Promise<Map<string, CitySnapshot>> {
  const { data, error } = await supabase
    .from('city_snapshots')
    .select('city_id, as_of_date, rental_yield, price_per_sqft, avg_price, yoy_growth')
    .order('as_of_date', { ascending: false });

  if (error) throw error;
  const map = new Map<string, CitySnapshot>();
  for (const row of data ?? []) {
    if (!map.has(row.city_id))
      map.set(row.city_id, rowToSnapshot(row));
  }
  return map;
}

/** Fetch cities with latest snapshot merged (for API and provider) */
export async function fetchCitiesWithSnapshots(): Promise<CityWithSnapshot[]> {
  const [cities, snapshots] = await Promise.all([fetchCities(), fetchLatestSnapshots()]);
  return cities.map((c) => ({
    ...c,
    snapshot: snapshots.get(c.id) ?? null,
  }));
}

/** Fetch only premier cities with latest snapshot */
export async function fetchPremierCitiesWithSnapshots(): Promise<CityWithSnapshot[]> {
  const all = await fetchCitiesWithSnapshots();
  return all.filter((c) => c.is_premier);
}

/** Get cities in a country with their latest snapshot (for Premier Markets panel) */
export function getCitiesInCountryWithSnapshot(
  citiesWithSnapshots: CityWithSnapshot[],
  country: string
): CityWithSnapshot[] {
  return citiesWithSnapshots
    .filter((c) => c.country === country && c.snapshot != null)
    .sort((a, b) => {
      const aYield = parseFloat((a.snapshot?.rentalYield ?? '0').replace('%', ''));
      const bYield = parseFloat((b.snapshot?.rentalYield ?? '0').replace('%', ''));
      return bYield - aYield;
    })
    .slice(0, 6);
}
