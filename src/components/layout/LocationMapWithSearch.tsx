// --- components/layout/LocationMapWithSearch.tsx ---
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

const createMarkerIcon = () => new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

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

  const handleSearch = useCallback(async () => {
    if (!address.trim()) {
      setError('Please enter an address');
      return;
    }
    setIsSearching(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${GEOAPIFY_API_KEY}`
      );

      if (!res.ok) throw new Error('Geocoding failed');
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
    } catch (err: unknown) {
      setError('Failed to search location. Please try again.');
      console.error('Geocoding error:', err);
    } finally {
      setIsSearching(false);
    }
  }, [address, onLocationChange]);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${GEOAPIFY_API_KEY}`
      );
      if (!res.ok) throw new Error('Reverse geocoding failed');
      const data = await res.json();
      const addr = data.features?.[0]?.properties?.formatted || '';
      setAddress(addr);
      onLocationChange(lat, lng, addr);
    } catch (err: unknown) {
      console.error('Reverse geocoding error:', err);
      setAddress('');
    }
  }, [onLocationChange]);

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

    const eventHandlers = {
      dragend: async () => {
        const marker = markerRef.current;
        if (marker) {
          const latlng = marker.getLatLng();
          setPosition([latlng.lat, latlng.lng]);
          await reverseGeocode(latlng.lat, latlng.lng);
        }
      },
    };

    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        icon={createMarkerIcon()}
        ref={markerRef}
      />
    );
  };

  useEffect(() => {
    if (initialPosition && (initialPosition[0] !== position[0] || initialPosition[1] !== position[1])) {
      setPosition(initialPosition);
      if (initialAddress) {
        setAddress(initialAddress);
      } else {
        reverseGeocode(initialPosition[0], initialPosition[1]);
      }
    }
  }, [initialPosition, initialAddress, position, reverseGeocode]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          className="border p-2 rounded w-full mb-1 pr-10"
          type="text"
          placeholder="Search address (e.g., MG Road, Bangalore)"
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
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
          aria-label="Search location"
        >
          {isSearching ? <span className="animate-spin">↻</span> : <span>🔍</span>}
        </button>
      </div>

      <button
        onClick={() => {
          if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
          }
          setIsSearching(true);
          setError(null);
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const newPosition: [number, number] = [latitude, longitude];
              setPosition(newPosition);
              mapRef.current?.flyTo(newPosition, 16);
              await reverseGeocode(latitude, longitude);
              setIsSearching(false);
            },
            (err) => {
              console.error(err);
              setError("Failed to get current location.");
              setIsSearching(false);
            }
          );
        }}
        disabled={isSearching}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Use Current Location
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="border rounded overflow-hidden">
        <MapContainer
          center={position}
          zoom={5}
          scrollWheelZoom={true}
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