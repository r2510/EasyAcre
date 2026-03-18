-- Run in Supabase Dashboard SQL Editor after 001_create_chat_queries.sql
-- Countries (reference table for cities)
CREATE TABLE IF NOT EXISTS countries (
  id text PRIMARY KEY,
  name text NOT NULL
);

-- Cities (geo + premier flag; market data lives in city_snapshots)
CREATE TABLE IF NOT EXISTS cities (
  id text PRIMARY KEY,
  name text NOT NULL,
  country_id text NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  is_premier boolean NOT NULL DEFAULT false
);

CREATE INDEX idx_cities_country ON cities(country_id);
CREATE INDEX idx_cities_premier ON cities(is_premier) WHERE is_premier = true;

-- City market snapshots (one row per city per date; "current" = latest as_of_date)
CREATE TABLE IF NOT EXISTS city_snapshots (
  city_id text NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  as_of_date date NOT NULL,
  rental_yield text,
  price_per_sqft text,
  avg_price text,
  yoy_growth text,
  PRIMARY KEY (city_id, as_of_date)
);

CREATE INDEX idx_city_snapshots_city_date ON city_snapshots(city_id, as_of_date DESC);

-- RLS (allow read for anon; restrict writes to service role / backend)
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "countries_read" ON countries FOR SELECT USING (true);
CREATE POLICY "cities_read" ON cities FOR SELECT USING (true);
CREATE POLICY "city_snapshots_read" ON city_snapshots FOR SELECT USING (true);
