'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { CityWithSnapshot } from '@/lib/db/types';
import { getStaticCitiesWithSnapshots } from '@/lib/cities-data';
import { getCitiesInCountryWithSnapshot } from '@/lib/db/cities';

interface CitiesDataContextType {
  cities: CityWithSnapshot[];
  premierCities: CityWithSnapshot[];
  loading: boolean;
  error: string | null;
  getCityById: (cityId: string) => CityWithSnapshot | undefined;
  getCountryMarkets: (country: string) => CityWithSnapshot[];
}

const CitiesDataContext = createContext<CitiesDataContextType | undefined>(undefined);

export function CitiesDataProvider({ children }: { children: React.ReactNode }) {
  const [cities, setCities] = useState<CityWithSnapshot[]>([]);
  const [premierCities, setPremierCities] = useState<CityWithSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/cities');
        if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
        const data = await res.json();
        if (!cancelled) {
          setCities(data.cities ?? []);
          setPremierCities(data.premierCities ?? []);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          const fallback = getStaticCitiesWithSnapshots() as CityWithSnapshot[];
          setCities(fallback);
          setPremierCities(fallback.filter((c) => (c as { is_premier?: boolean }).is_premier));
          setError(e instanceof Error ? e.message : 'Failed to load cities');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const getCityById = useCallback(
    (cityId: string) => cities.find((c) => c.id === cityId),
    [cities]
  );

  const getCountryMarkets = useCallback(
    (country: string) => getCitiesInCountryWithSnapshot(cities, country),
    [cities]
  );

  const value: CitiesDataContextType = {
    cities,
    premierCities,
    loading,
    error,
    getCityById,
    getCountryMarkets,
  };

  return (
    <CitiesDataContext.Provider value={value}>
      {children}
    </CitiesDataContext.Provider>
  );
}

export function useCitiesData() {
  const context = useContext(CitiesDataContext);
  if (context === undefined) {
    throw new Error('useCitiesData must be used within a CitiesDataProvider');
  }
  return context;
}
