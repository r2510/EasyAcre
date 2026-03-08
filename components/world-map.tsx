'use client';

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/map-view').then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex-1 min-h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
      <p className="text-sm text-muted-foreground">Loading map…</p>
    </div>
  ),
});

interface WorldMapProps {
  onCitySelect?: (cityId: string) => void;
}

export function WorldMap({ onCitySelect }: WorldMapProps) {
  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-transparent overflow-hidden">
      <div className="flex-1 min-h-[300px] relative overflow-hidden">
        <MapView onCitySelect={onCitySelect} />
      </div>
    </div>
  );
}
