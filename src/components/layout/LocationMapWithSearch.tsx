'use client';

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const createMarkerIcon = () =>
  new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl:
      'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl:
      'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

interface LocationMapWithSearchProps {
  onLocationChange: (lat: number, lng: number, address: string) => void;
  initialPosition?: [number, number];
  initialAddress?: string;
}

export default function LocationMapWithSearch({
  onLocationChange,
  initialPosition = [20.5937, 78.9629],
  initialAddress = '',
}: LocationMapWithSearchProps) {
  const [position, setPosition] = useState<[number, number]>(initialPosition);
  const [address, setAddress] = useState(initialAddress);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
        setAddress('');
        return;
      }

      try {
        const res = await fetch(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${process.env.MOBEEN_NEXT_PUBLIC_GEOAPIFY_API_KEY}`
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }

        const data = await res.json();
        const addr = data?.features?.[0]?.properties?.formatted || '';

        setAddress(addr);
        onLocationChange(lat, lng, addr);
      } catch (err) {
        console.error('Reverse Geocoding Error:', err);
        setAddress('');
        onLocationChange(lat, lng, '');
      }
    },
    [onLocationChange]
  );

  const handleSearch = useCallback(async () => {
    if (!address.trim()) {
      setError('Please enter an address');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          address
        )}&apiKey=${process.env.MOBEEN_NEXT_PUBLIC_GEOAPIFY_API_KEY}`
      );

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      const data = await res.json();

      if (data.features && data.features.length > 0) {
        const { lat, lon } = data.features[0].properties;
        const newPosition: [number, number] = [lat, lon];
        setPosition(newPosition);
        onLocationChange(lat, lon, address);
        mapRef.current?.flyTo(newPosition, 16);
      } else {
        setError('Address not found');
      }
    } catch (err) {
      console.error('Search Error:', err);
      setError('Failed to search location');
    } finally {
      setIsSearching(false);
    }
  }, [address, onLocationChange]);

  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        await reverseGeocode(lat, lng);
      },
    });
    return null;
  };

  const DraggableMarker = () => {
    const markerRef = useRef<L.Marker>(null);
    const map = useMap();
    mapRef.current = map;

    return (
      <Marker
        draggable
        position={position}
        icon={createMarkerIcon()}
        ref={markerRef}
        eventHandlers={{
          dragend: async () => {
            const marker = markerRef.current;
            if (!marker) return;
            const { lat, lng } = marker.getLatLng();
            setPosition([lat, lng]);
            await reverseGeocode(lat, lng);
          },
        }}
      />
    );
  };

  useEffect(() => {
    if (
      initialPosition &&
      initialPosition[0] !== position[0] &&
      initialPosition[1] !== position[1]
    ) {
      setPosition(initialPosition);

      if (initialAddress) {
        setAddress(initialAddress);
        onLocationChange(
          initialPosition[0],
          initialPosition[1],
          initialAddress
        );
      } else {
        reverseGeocode(initialPosition[0], initialPosition[1]);
      }
    }
  }, [initialPosition, initialAddress, position, reverseGeocode, onLocationChange]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          className="border p-2 rounded w-full mb-1 pr-10"
          type="text"
          placeholder="Search address"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          disabled={isSearching}
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="absolute right-2 top-2"
        >
          {isSearching ? '...' : '🔍'}
        </button>
      </div>

      <button
        onClick={() => {
          if (!navigator.geolocation) {
            setError('Geolocation not supported');
            return;
          }

          setIsSearching(true);
          setError(null);

          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const { latitude, longitude } = pos.coords;
              const newPosition: [number, number] = [
                latitude,
                longitude,
              ];
              setPosition(newPosition);
              mapRef.current?.flyTo(newPosition, 16);
              await reverseGeocode(latitude, longitude);
              setIsSearching(false);
            },
            () => {
              setError('Failed to get location');
              setIsSearching(false);
            }
          );
        }}
        disabled={isSearching}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        Use Current Location
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="border rounded overflow-hidden">
        <MapContainer
          center={position}
          zoom={5}
          scrollWheelZoom
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <DraggableMarker />
          <MapClickHandler />
        </MapContainer>
      </div>
    </div>
  );
}
