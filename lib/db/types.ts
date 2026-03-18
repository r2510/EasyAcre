/** DB/code shared types for countries, cities, and snapshots */

export interface CountryRow {
  id: string;
  name: string;
}

export interface CityRow {
  id: string;
  name: string;
  country_id: string;
  lat: number;
  lng: number;
  is_premier: boolean;
}

export interface CitySnapshotRow {
  city_id: string;
  as_of_date: string;
  rental_yield: string | null;
  price_per_sqft: string | null;
  avg_price: string | null;
  yoy_growth: string | null;
}

/** City with country name and currency for display (from join or merge) */
export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  is_premier?: boolean;
  /** ISO 4217 currency code (e.g. USD, INR) for formatting price_per_sqft and avg_price */
  currency_code?: string;
}

/** Latest snapshot for a city */
export interface CitySnapshot {
  rentalYield: string;
  pricePerSqft: string;
  avgPrice: string;
  yoyGrowth: string;
}

/** City + latest snapshot (for market snapshot panel and country table) */
export interface CityWithSnapshot extends City {
  snapshot: CitySnapshot | null;
}
