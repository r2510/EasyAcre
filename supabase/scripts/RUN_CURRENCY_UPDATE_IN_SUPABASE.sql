-- =============================================================================
-- RUN THIS IN SUPABASE SQL EDITOR (Dashboard → SQL Editor → New query)
-- =============================================================================
-- 1. Adds currency_code to countries (if not already done).
-- 2. Converts city_snapshots price_per_sqft and avg_price from USD to each
--    country's local currency using approximate current rates, so values are
--    correct (e.g. Bengaluru ~₹10K/sqft, not ₹120).
-- Prerequisites: 002 and 003 must be run (countries, cities, city_snapshots exist).
-- =============================================================================

-- Part 1: Add and set country currency codes
ALTER TABLE countries ADD COLUMN IF NOT EXISTS currency_code text NOT NULL DEFAULT 'USD';

UPDATE countries SET currency_code = 'GBP' WHERE id = 'UK';
UPDATE countries SET currency_code = 'USD' WHERE id = 'USA';
UPDATE countries SET currency_code = 'JPY' WHERE id = 'Japan';
UPDATE countries SET currency_code = 'SGD' WHERE id = 'Singapore';
UPDATE countries SET currency_code = 'AED' WHERE id = 'UAE';
UPDATE countries SET currency_code = 'EUR' WHERE id = 'France';
UPDATE countries SET currency_code = 'CNY' WHERE id = 'China';
UPDATE countries SET currency_code = 'INR' WHERE id = 'India';
UPDATE countries SET currency_code = 'AUD' WHERE id = 'Australia';
UPDATE countries SET currency_code = 'CAD' WHERE id = 'Canada';
UPDATE countries SET currency_code = 'EUR' WHERE id = 'Germany';
UPDATE countries SET currency_code = 'EUR' WHERE id = 'Spain';
UPDATE countries SET currency_code = 'EUR' WHERE id = 'Italy';
UPDATE countries SET currency_code = 'EUR' WHERE id = 'Netherlands';
UPDATE countries SET currency_code = 'CHF' WHERE id = 'Switzerland';
UPDATE countries SET currency_code = 'EUR' WHERE id = 'Austria';
UPDATE countries SET currency_code = 'SEK' WHERE id = 'Sweden';
UPDATE countries SET currency_code = 'DKK' WHERE id = 'Denmark';
UPDATE countries SET currency_code = 'NOK' WHERE id = 'Norway';
UPDATE countries SET currency_code = 'EUR' WHERE id = 'Finland';
UPDATE countries SET currency_code = 'EUR' WHERE id = 'Ireland';
UPDATE countries SET currency_code = 'EUR' WHERE id = 'Portugal';
UPDATE countries SET currency_code = 'CZK' WHERE id = 'Czech Republic';
UPDATE countries SET currency_code = 'PLN' WHERE id = 'Poland';
UPDATE countries SET currency_code = 'EUR' WHERE id = 'Belgium';
UPDATE countries SET currency_code = 'TRY' WHERE id = 'Turkey';
UPDATE countries SET currency_code = 'RUB' WHERE id = 'Russia';
UPDATE countries SET currency_code = 'EUR' WHERE id = 'Greece';
UPDATE countries SET currency_code = 'HUF' WHERE id = 'Hungary';
UPDATE countries SET currency_code = 'KRW' WHERE id = 'South Korea';
UPDATE countries SET currency_code = 'TWD' WHERE id = 'Taiwan';
UPDATE countries SET currency_code = 'IDR' WHERE id = 'Indonesia';
UPDATE countries SET currency_code = 'PHP' WHERE id = 'Philippines';
UPDATE countries SET currency_code = 'VND' WHERE id = 'Vietnam';
UPDATE countries SET currency_code = 'SAR' WHERE id = 'Saudi Arabia';
UPDATE countries SET currency_code = 'QAR' WHERE id = 'Qatar';
UPDATE countries SET currency_code = 'ILS' WHERE id = 'Israel';
UPDATE countries SET currency_code = 'MXN' WHERE id = 'Mexico';
UPDATE countries SET currency_code = 'BRL' WHERE id = 'Brazil';
UPDATE countries SET currency_code = 'ARS' WHERE id = 'Argentina';
UPDATE countries SET currency_code = 'COP' WHERE id = 'Colombia';
UPDATE countries SET currency_code = 'PEN' WHERE id = 'Peru';
UPDATE countries SET currency_code = 'CLP' WHERE id = 'Chile';
UPDATE countries SET currency_code = 'ZAR' WHERE id = 'South Africa';
UPDATE countries SET currency_code = 'NGN' WHERE id = 'Nigeria';
UPDATE countries SET currency_code = 'KES' WHERE id = 'Kenya';
UPDATE countries SET currency_code = 'EGP' WHERE id = 'Egypt';
UPDATE countries SET currency_code = 'MAD' WHERE id = 'Morocco';
UPDATE countries SET currency_code = 'ETB' WHERE id = 'Ethiopia';
UPDATE countries SET currency_code = 'NZD' WHERE id = 'New Zealand';
UPDATE countries SET currency_code = 'THB' WHERE id = 'Thailand';
UPDATE countries SET currency_code = 'MYR' WHERE id = 'Malaysia';

-- Part 2: Store correct LOCAL CURRENCY values (converted from original USD)
-- Approx rates used: INR 85, GBP 0.79, EUR 0.92, AED 3.67, SAR 3.75, QAR 3.64,
-- SGD 1.34, CNY 7.25, JPY 150, AUD 1.53, CAD 1.36, TRY 32, THB 35, MYR 4.7
-- Original USD values are converted so the number reflects actual local magnitude.

UPDATE city_snapshots SET price_per_sqft = 'AED 1,285',  avg_price = 'AED 1.65M'   WHERE city_id = 'dubai'     AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = '£948',       avg_price = '£648K'      WHERE city_id = 'london'    AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = '$1,100',      avg_price = '$950K'      WHERE city_id = 'new-york'  AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = 'S$1,876',    avg_price = 'S$1.47M'    WHERE city_id = 'singapore' AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = '¥120,000',   avg_price = '¥78M'       WHERE city_id = 'tokyo'     AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = '¥15,225',    avg_price = '¥10.15M'    WHERE city_id = 'hong-kong' AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = '€874',        avg_price = '€626K'      WHERE city_id = 'paris'     AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = '₹23,800',    avg_price = '₹27.2L'     WHERE city_id = 'mumbai'    AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = '₹18,700',    avg_price = '₹21.25L'    WHERE city_id = 'delhi'     AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = '₹10,200',    avg_price = '₹15.3L'     WHERE city_id = 'bengaluru' AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = 'A$1,148',   avg_price = 'A$1.19M'    WHERE city_id = 'sydney'    AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = 'C$925',      avg_price = 'C$843K'     WHERE city_id = 'toronto'   AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = 'AED 1,101',  avg_price = 'AED 1.39M'   WHERE city_id = 'abu-dhabi' AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = 'SAR 675',    avg_price = 'SAR 1.05M'   WHERE city_id = 'riyadh'   AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = '₺4,800',     avg_price = '₺6.4M'      WHERE city_id = 'istanbul'  AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = '¥6,525',     avg_price = '¥4.71M'     WHERE city_id = 'shanghai'  AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = '฿6,300',     avg_price = '฿7.7M'      WHERE city_id = 'bangkok'   AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = 'RM752',      avg_price = 'RM893K'     WHERE city_id = 'kuala-lumpur' AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = '₹8,500',     avg_price = '₹15.3L'     WHERE city_id = 'hyderabad' AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = '$480',       avg_price = '$520K'      WHERE city_id = 'miami'     AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = '$750',       avg_price = '$850K'      WHERE city_id = 'los-angeles' AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = '$320',       avg_price = '$420K'      WHERE city_id = 'austin'    AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = 'C$1,115',    avg_price = 'C$1.33M'    WHERE city_id = 'vancouver' AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = 'C$476',      avg_price = 'C$517K'     WHERE city_id = 'montreal'  AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = 'A$796',      avg_price = 'A$995K'     WHERE city_id = 'melbourne' AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = 'A$581',      avg_price = 'A$796K'     WHERE city_id = 'brisbane'  AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = '¥6,163',     avg_price = '¥4.49M'     WHERE city_id = 'shenzhen'  AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = '¥5,655',     avg_price = '¥4.2M'      WHERE city_id = 'beijing'   AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = '¥67,500',   avg_price = '¥57M'       WHERE city_id = 'osaka'     AND as_of_date = '2025-01-01';
UPDATE city_snapshots SET price_per_sqft = 'QAR 1,019', avg_price = 'QAR 1.27M'   WHERE city_id = 'doha'      AND as_of_date = '2025-01-01';
