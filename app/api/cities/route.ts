import { NextResponse } from 'next/server';
import { fetchCitiesWithSnapshots, fetchPremierCitiesWithSnapshots } from '@/lib/db/cities';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [cities, premierCities] = await Promise.all([
      fetchCitiesWithSnapshots(),
      fetchPremierCitiesWithSnapshots(),
    ]);
    return NextResponse.json({ cities, premierCities });
  } catch (e) {
    console.error('[api/cities]', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}
