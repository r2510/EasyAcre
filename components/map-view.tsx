'use client';

import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CITIES, City } from '@/lib/cities-data';
import { useCityContext } from '@/lib/city-context';
import { useEffect, useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

import 'leaflet/dist/leaflet.css';

const PADDING = 25;
const cityLats = CITIES.map((c) => c.lat);
const cityLngs = CITIES.map((c) => c.lng);
const MAP_BOUNDS: [[number, number], [number, number]] = [
  [Math.min(...cityLats) - PADDING, Math.min(...cityLngs) - PADDING],
  [Math.max(...cityLats) + PADDING, Math.max(...cityLngs) + PADDING],
];

const MARKER_SIZE = 20;
const ICON_COLOR = { default: '#475569', selected: '#0f766e' };

const createHomeLocationIcon = (selected: boolean) => {
  const size = selected ? MARKER_SIZE + 6 : MARKER_SIZE;
  const color = selected ? ICON_COLOR.selected : ICON_COLOR.default;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size * 1.3}" style="display:block;">
    <path d="M12 0C7.6 0 4 3.6 4 8c0 6 8 16 8 16s8-10 8-16c0-4.4-3.6-8-8-8z" fill="${color}" opacity="0.9"/>
    <path d="M12 4.5L8 8v4.5h2.5V10h3v2.5H16V8z" fill="white"/>
  </svg>`;
  return L.divIcon({
    className: '!bg-transparent !border-0',
    html: `<div style="line-height:0;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.3));">${svg}</div>`,
    iconSize: [size, size * 1.3],
    iconAnchor: [size / 2, size * 1.3],
  });
};

function MapController({ selectedId }: { selectedId: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const city = CITIES.find((c) => c.id === selectedId);
    if (city) map.flyTo([city.lat, city.lng], 5, { duration: 0.5 });
  }, [selectedId, map]);
  return null;
}

function CitySearch() {
  const [query, setQuery] = useState('');
  const { setSelectedCityId } = useCityContext();
  const map = useMap();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? CITIES.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.country.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleSelect = (city: City) => {
    setSelectedCityId(city.id);
    map.flyTo([city.lat, city.lng], 5, { duration: 0.5 });
    setQuery('');
  };

  return (
    <div
      className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] w-[min(90%,22rem)]"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 min-h-[2.75rem]">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city..."
            className="flex-1 min-w-0 text-sm text-gray-900 bg-transparent outline-none placeholder-gray-400 py-1.5"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-0.5 hover:bg-gray-100 rounded"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>
        {query.trim() && (
          <div className="px-2 py-2 max-h-52 overflow-y-auto border-t border-gray-100">
            {filtered.length > 0 ? (
              <div className="space-y-0.5">
                {filtered.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => handleSelect(city)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg transition flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-800">{city.name}</span>
                    <span className="text-xs text-gray-400">{city.country}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-3 text-xs text-gray-400 text-center">No cities found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface MapViewProps {
  onCitySelect?: (cityId: string) => void;
}

export function MapView({ onCitySelect }: MapViewProps) {
  const { selectedCityId, setSelectedCityId } = useCityContext();

  const handleCitySelect = (cityId: string) => {
    setSelectedCityId(cityId);
    onCitySelect?.(cityId);
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[28, 48]}
        zoom={4}
        minZoom={2}
        maxZoom={14}
        maxBounds={MAP_BOUNDS}
        maxBoundsViscosity={1}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        scrollWheelZoom
        attributionControl={false}
        className="z-0"
      >
        <TileLayer
          attribution="Leaflet · © OpenStreetMap · © CARTO"
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapController selectedId={selectedCityId} />
        <CitySearch />
        {CITIES.map((city: City) => (
          <Marker
            key={city.id}
            position={[city.lat, city.lng]}
            icon={createHomeLocationIcon(city.id === selectedCityId)}
            eventHandlers={{
              click: () => handleCitySelect(city.id),
            }}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={0.95}>
              <span className="text-xs font-medium">
                {city.name}, {city.country}
              </span>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
      <div className="pointer-events-none absolute bottom-2 right-3 text-[10px] text-white/60 bg-black/40 rounded px-2 py-0.5">
        Leaflet · © OpenStreetMap · © CARTO
      </div>
    </div>
  );
}
