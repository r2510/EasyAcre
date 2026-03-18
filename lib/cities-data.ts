export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export const CITIES: City[] = [
  /* --- GLOBAL HUBS --- */
  { id: "london", name: "London", country: "UK", lat: 51.5074, lng: -0.1278 },
  { id: "new-york", name: "New York", country: "USA", lat: 40.7128, lng: -74.0060 },
  { id: "tokyo", name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { id: "singapore", name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
  { id: "dubai", name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
  { id: "paris", name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { id: "hong-kong", name: "Hong Kong", country: "China", lat: 22.3193, lng: 114.1694 },

  /* --- INDIA --- */
  { id: "mumbai", name: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777 },
  { id: "delhi", name: "New Delhi", country: "India", lat: 28.6139, lng: 77.2090 },
  { id: "bengaluru", name: "Bengaluru", country: "India", lat: 12.9716, lng: 77.5946 },
  { id: "chennai", name: "Chennai", country: "India", lat: 13.0827, lng: 80.2707 },
  { id: "hyderabad", name: "Hyderabad", country: "India", lat: 17.3850, lng: 78.4867 },
  { id: "kolkata", name: "Kolkata", country: "India", lat: 22.5726, lng: 88.3639 },
  { id: "pune", name: "Pune", country: "India", lat: 18.5204, lng: 73.8567 },
  { id: "ahmedabad", name: "Ahmedabad", country: "India", lat: 23.0225, lng: 72.5714 },
  { id: "surat", name: "Surat", country: "India", lat: 21.1702, lng: 72.8311 },
  { id: "lucknow", name: "Lucknow", country: "India", lat: 26.8467, lng: 80.9462 },
  { id: "jaipur", name: "Jaipur", country: "India", lat: 26.9124, lng: 75.7873 },
  { id: "chandigarh", name: "Chandigarh", country: "India", lat: 30.7333, lng: 76.7794 },
  { id: "kochi", name: "Kochi", country: "India", lat: 9.9312, lng: 76.2673 },
  { id: "goa", name: "Goa", country: "India", lat: 15.2993, lng: 74.1240 },
  { id: "indore", name: "Indore", country: "India", lat: 22.7196, lng: 75.8577 },
  { id: "nagpur", name: "Nagpur", country: "India", lat: 21.1458, lng: 79.0882 },
  { id: "visakhapatnam", name: "Visakhapatnam", country: "India", lat: 17.6868, lng: 83.2185 },
  { id: "coimbatore", name: "Coimbatore", country: "India", lat: 11.0168, lng: 76.9558 },
  { id: "thiruvananthapuram", name: "Thiruvananthapuram", country: "India", lat: 8.5241, lng: 76.9366 },
  { id: "bhopal", name: "Bhopal", country: "India", lat: 23.2599, lng: 77.4126 },
  { id: "patna", name: "Patna", country: "India", lat: 25.6093, lng: 85.1376 },
  { id: "vadodara", name: "Vadodara", country: "India", lat: 22.3072, lng: 73.1812 },
  { id: "guwahati", name: "Guwahati", country: "India", lat: 26.1445, lng: 91.7362 },
  { id: "dehradun", name: "Dehradun", country: "India", lat: 30.3165, lng: 78.0322 },
  { id: "mysuru", name: "Mysuru", country: "India", lat: 12.2958, lng: 76.6394 },

  /* --- CHINA --- */
  { id: "shanghai", name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737 },
  { id: "beijing", name: "Beijing", country: "China", lat: 39.9042, lng: 116.4074 },
  { id: "guangzhou", name: "Guangzhou", country: "China", lat: 23.1291, lng: 113.2644 },
  { id: "shenzhen", name: "Shenzhen", country: "China", lat: 22.5431, lng: 114.0579 },
  { id: "chengdu", name: "Chengdu", country: "China", lat: 30.5728, lng: 104.0668 },
  { id: "hangzhou", name: "Hangzhou", country: "China", lat: 30.2741, lng: 120.1551 },
  { id: "wuhan", name: "Wuhan", country: "China", lat: 30.5928, lng: 114.3055 },
  { id: "nanjing", name: "Nanjing", country: "China", lat: 32.0603, lng: 118.7969 },
  { id: "chongqing", name: "Chongqing", country: "China", lat: 29.4316, lng: 106.9123 },
  { id: "tianjin", name: "Tianjin", country: "China", lat: 39.3434, lng: 117.3616 },
  { id: "xian", name: "Xi'an", country: "China", lat: 34.3416, lng: 108.9398 },

  /* --- USA --- */
  { id: "los-angeles", name: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437 },
  { id: "chicago", name: "Chicago", country: "USA", lat: 41.8781, lng: -87.6298 },
  { id: "san-francisco", name: "San Francisco", country: "USA", lat: 37.7749, lng: -122.4194 },
  { id: "miami", name: "Miami", country: "USA", lat: 25.7617, lng: -80.1918 },
  { id: "houston", name: "Houston", country: "USA", lat: 29.7604, lng: -95.3698 },
  { id: "boston", name: "Boston", country: "USA", lat: 42.3601, lng: -71.0589 },
  { id: "washington-dc", name: "Washington D.C.", country: "USA", lat: 38.9072, lng: -77.0369 },
  { id: "dallas", name: "Dallas", country: "USA", lat: 32.7767, lng: -96.7970 },
  { id: "austin", name: "Austin", country: "USA", lat: 30.2672, lng: -97.7431 },
  { id: "seattle", name: "Seattle", country: "USA", lat: 47.6062, lng: -122.3321 },
  { id: "denver", name: "Denver", country: "USA", lat: 39.7392, lng: -104.9903 },
  { id: "atlanta", name: "Atlanta", country: "USA", lat: 33.7490, lng: -84.3880 },
  { id: "nashville", name: "Nashville", country: "USA", lat: 36.1627, lng: -86.7816 },
  { id: "phoenix", name: "Phoenix", country: "USA", lat: 33.4484, lng: -112.0740 },
  { id: "philadelphia", name: "Philadelphia", country: "USA", lat: 39.9526, lng: -75.1652 },
  { id: "san-diego", name: "San Diego", country: "USA", lat: 32.7157, lng: -117.1611 },
  { id: "portland", name: "Portland", country: "USA", lat: 45.5152, lng: -122.6784 },

  /* --- EUROPE --- */
  { id: "berlin", name: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050 },
  { id: "madrid", name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038 },
  { id: "barcelona", name: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734 },
  { id: "milan", name: "Milan", country: "Italy", lat: 45.4642, lng: 9.1900 },
  { id: "rome", name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
  { id: "amsterdam", name: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041 },
  { id: "zurich", name: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417 },
  { id: "munich", name: "Munich", country: "Germany", lat: 48.1351, lng: 11.5820 },
  { id: "frankfurt", name: "Frankfurt", country: "Germany", lat: 50.1109, lng: 8.6821 },
  { id: "vienna", name: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738 },
  { id: "stockholm", name: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686 },
  { id: "copenhagen", name: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683 },
  { id: "oslo", name: "Oslo", country: "Norway", lat: 59.9139, lng: 10.7522 },
  { id: "helsinki", name: "Helsinki", country: "Finland", lat: 60.1699, lng: 24.9384 },
  { id: "dublin", name: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603 },
  { id: "lisbon", name: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393 },
  { id: "prague", name: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378 },
  { id: "warsaw", name: "Warsaw", country: "Poland", lat: 52.2297, lng: 21.0122 },
  { id: "brussels", name: "Brussels", country: "Belgium", lat: 50.8503, lng: 4.3517 },
  { id: "istanbul", name: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784 },
  { id: "moscow", name: "Moscow", country: "Russia", lat: 55.7558, lng: 37.6173 },
  { id: "athens", name: "Athens", country: "Greece", lat: 37.9838, lng: 23.7275 },
  { id: "edinburgh", name: "Edinburgh", country: "UK", lat: 55.9533, lng: -3.1883 },
  { id: "budapest", name: "Budapest", country: "Hungary", lat: 47.4979, lng: 19.0402 },

  /* --- ASIA-PACIFIC --- */
  { id: "sydney", name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
  { id: "melbourne", name: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631 },
  { id: "brisbane", name: "Brisbane", country: "Australia", lat: -27.4698, lng: 153.0251 },
  { id: "perth", name: "Perth", country: "Australia", lat: -31.9505, lng: 115.8605 },
  { id: "auckland", name: "Auckland", country: "New Zealand", lat: -36.8485, lng: 174.7633 },
  { id: "seoul", name: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.9780 },
  { id: "taipei", name: "Taipei", country: "Taiwan", lat: 25.0330, lng: 121.5654 },
  { id: "osaka", name: "Osaka", country: "Japan", lat: 34.6937, lng: 135.5023 },
  { id: "bangkok", name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018 },
  { id: "jakarta", name: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456 },
  { id: "kuala-lumpur", name: "Kuala Lumpur", country: "Malaysia", lat: 3.1390, lng: 101.6869 },
  { id: "manila", name: "Manila", country: "Philippines", lat: 14.5995, lng: 120.9842 },
  { id: "ho-chi-minh", name: "Ho Chi Minh City", country: "Vietnam", lat: 10.8231, lng: 106.6297 },

  /* --- MIDDLE EAST --- */
  { id: "abu-dhabi", name: "Abu Dhabi", country: "UAE", lat: 24.4539, lng: 54.3773 },
  { id: "riyadh", name: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753 },
  { id: "doha", name: "Doha", country: "Qatar", lat: 25.2854, lng: 51.5310 },
  { id: "tel-aviv", name: "Tel Aviv", country: "Israel", lat: 32.0853, lng: 34.7818 },

  /* --- AMERICAS (non-US) --- */
  { id: "toronto", name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832 },
  { id: "vancouver", name: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207 },
  { id: "montreal", name: "Montreal", country: "Canada", lat: 45.5017, lng: -73.5673 },
  { id: "mexico-city", name: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332 },
  { id: "sao-paulo", name: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333 },
  { id: "rio-de-janeiro", name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729 },
  { id: "buenos-aires", name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816 },
  { id: "bogota", name: "Bogotá", country: "Colombia", lat: 4.7110, lng: -74.0721 },
  { id: "lima", name: "Lima", country: "Peru", lat: -12.0464, lng: -77.0428 },
  { id: "santiago", name: "Santiago", country: "Chile", lat: -33.4489, lng: -70.6693 },

  /* --- AFRICA --- */
  { id: "johannesburg", name: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473 },
  { id: "cape-town", name: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241 },
  { id: "lagos", name: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792 },
  { id: "nairobi", name: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219 },
  { id: "cairo", name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357 },
  { id: "casablanca", name: "Casablanca", country: "Morocco", lat: 33.5731, lng: -7.5898 },
  { id: "addis-ababa", name: "Addis Ababa", country: "Ethiopia", lat: 9.0250, lng: 38.7469 },
];

export const getCityById = (cityId: string): City | undefined => {
  return CITIES.find((city) => city.id === cityId);
};

export const PREMIER_CITY_IDS = [
  'dubai', 'london', 'new-york', 'singapore', 'tokyo',
  'hong-kong', 'paris', 'mumbai', 'sydney', 'toronto',
  'berlin', 'shanghai', 'abu-dhabi', 'riyadh', 'doha',
  'bengaluru', 'bangkok', 'kuala-lumpur', 'istanbul', 'miami',
];

export const PREMIER_CITIES = CITIES.filter((c) => PREMIER_CITY_IDS.includes(c.id));

/** Country name -> ISO 4217 currency code for static fallback (matches DB countries.currency_code) */
const COUNTRY_CURRENCY: Record<string, string> = {
  UK: 'GBP', USA: 'USD', Japan: 'JPY', Singapore: 'SGD', UAE: 'AED', France: 'EUR', China: 'CNY',
  India: 'INR', Australia: 'AUD', Canada: 'CAD', Germany: 'EUR', Spain: 'EUR', Italy: 'EUR',
  Netherlands: 'EUR', Switzerland: 'CHF', Austria: 'EUR', Sweden: 'SEK', Denmark: 'DKK', Norway: 'NOK',
  Finland: 'EUR', Ireland: 'EUR', Portugal: 'EUR', 'Czech Republic': 'CZK', Poland: 'PLN', Belgium: 'EUR',
  Turkey: 'TRY', Russia: 'RUB', Greece: 'EUR', Hungary: 'HUF', 'South Korea': 'KRW', Taiwan: 'TWD',
  Indonesia: 'IDR', Philippines: 'PHP', Vietnam: 'VND', 'Saudi Arabia': 'SAR', Qatar: 'QAR', Israel: 'ILS',
  Mexico: 'MXN', Brazil: 'BRL', Argentina: 'ARS', Colombia: 'COP', Peru: 'PEN', Chile: 'CLP',
  'South Africa': 'ZAR', Nigeria: 'NGN', Kenya: 'KES', Egypt: 'EGP', Morocco: 'MAD', Ethiopia: 'ETB',
  'New Zealand': 'NZD', Thailand: 'THB', Malaysia: 'MYR',
};

/** Fallback market snapshot when Supabase is unavailable. Values in local currency (same as DB script). */
const FALLBACK_SNAPSHOTS: Record<string, { rentalYield: string; pricePerSqft: string; avgPrice: string; yoyGrowth: string }> = {
  'dubai': { rentalYield: '6.2%', pricePerSqft: 'AED 1,285', avgPrice: 'AED 1.65M', yoyGrowth: '+12.4%' },
  'london': { rentalYield: '3.8%', pricePerSqft: '£948', avgPrice: '£648K', yoyGrowth: '+4.1%' },
  'new-york': { rentalYield: '4.2%', pricePerSqft: '$1,100', avgPrice: '$950K', yoyGrowth: '+5.3%' },
  'singapore': { rentalYield: '3.5%', pricePerSqft: 'S$1,876', avgPrice: 'S$1.47M', yoyGrowth: '+3.8%' },
  'tokyo': { rentalYield: '3.9%', pricePerSqft: '¥120,000', avgPrice: '¥78M', yoyGrowth: '+6.2%' },
  'hong-kong': { rentalYield: '2.8%', pricePerSqft: '¥15,225', avgPrice: '¥10.15M', yoyGrowth: '-1.2%' },
  'paris': { rentalYield: '3.2%', pricePerSqft: '€874', avgPrice: '€626K', yoyGrowth: '+2.9%' },
  'mumbai': { rentalYield: '3.1%', pricePerSqft: '₹23,800', avgPrice: '₹27.2L', yoyGrowth: '+8.5%' },
  'delhi': { rentalYield: '2.8%', pricePerSqft: '₹18,700', avgPrice: '₹21.25L', yoyGrowth: '+7.2%' },
  'bengaluru': { rentalYield: '3.6%', pricePerSqft: '₹10,200', avgPrice: '₹15.3L', yoyGrowth: '+9.1%' },
  'sydney': { rentalYield: '3.4%', pricePerSqft: 'A$1,148', avgPrice: 'A$1.19M', yoyGrowth: '+5.6%' },
  'toronto': { rentalYield: '3.9%', pricePerSqft: 'C$925', avgPrice: 'C$843K', yoyGrowth: '+3.2%' },
  'abu-dhabi': { rentalYield: '5.8%', pricePerSqft: 'AED 1,101', avgPrice: 'AED 1.39M', yoyGrowth: '+10.1%' },
  'riyadh': { rentalYield: '5.5%', pricePerSqft: 'SAR 675', avgPrice: 'SAR 1.05M', yoyGrowth: '+14.2%' },
  'istanbul': { rentalYield: '5.2%', pricePerSqft: '₺4,800', avgPrice: '₺6.4M', yoyGrowth: '+18.5%' },
  'shanghai': { rentalYield: '2.1%', pricePerSqft: '¥6,525', avgPrice: '¥4.71M', yoyGrowth: '-0.5%' },
  'bangkok': { rentalYield: '4.8%', pricePerSqft: '฿6,300', avgPrice: '฿7.7M', yoyGrowth: '+6.8%' },
  'kuala-lumpur': { rentalYield: '4.5%', pricePerSqft: 'RM752', avgPrice: 'RM893K', yoyGrowth: '+5.4%' },
};

const DEFAULT_SNAPSHOT = { rentalYield: '4.0%', pricePerSqft: '—', avgPrice: '—', yoyGrowth: '+5.0%' };

/** Static cities with snapshot for fallback when API fails. Uses CityWithSnapshot shape from lib/db/types. */
export function getStaticCitiesWithSnapshots(): Array<City & { is_premier?: boolean; snapshot: { rentalYield: string; pricePerSqft: string; avgPrice: string; yoyGrowth: string } | null }> {
  return CITIES.map((c) => ({
    ...c,
    currency_code: COUNTRY_CURRENCY[c.country] ?? 'USD',
    is_premier: PREMIER_CITY_IDS.includes(c.id),
    snapshot: FALLBACK_SNAPSHOTS[c.id] ?? null,
  }));
}
