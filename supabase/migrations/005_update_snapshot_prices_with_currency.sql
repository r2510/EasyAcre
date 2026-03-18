-- Run after 004. Store correct LOCAL CURRENCY values (converted from original USD)
-- so price_per_sqft and avg_price reflect actual magnitude in that currency
-- (e.g. Bengaluru ₹10,200/sqft not ₹120). Approx rates: INR 85, GBP 0.79, EUR 0.92, etc.

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
