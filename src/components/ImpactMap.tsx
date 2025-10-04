import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ImpactLocation, ImpactMetrics } from '../types/asteroid';

interface ImpactMapProps {
  onLocationSelect: (location: ImpactLocation) => void;
  impactLocation: ImpactLocation | null;
  metrics: ImpactMetrics | null;
}

export default function ImpactMap({ onLocationSelect, impactLocation, metrics }: ImpactMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: true,
      minZoom: 2,
      maxZoom: 10
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!markersRef.current || !impactLocation) return;

    markersRef.current.clearLayers();

    const icon = L.divIcon({
      html: '<div style="background: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 20px #ef4444;"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      className: 'impact-marker'
    });

    L.marker([impactLocation.lat, impactLocation.lng], { icon }).addTo(markersRef.current);

    if (metrics) {
      const craterRadius = (metrics.craterDiameter / 2) * 1000;

      L.circle([impactLocation.lat, impactLocation.lng], {
        radius: craterRadius,
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.4,
        weight: 2
      }).addTo(markersRef.current);

      L.circle([impactLocation.lat, impactLocation.lng], {
        radius: craterRadius * 3,
        color: '#f97316',
        fillColor: '#f97316',
        fillOpacity: 0.2,
        weight: 2
      }).addTo(markersRef.current);

      L.circle([impactLocation.lat, impactLocation.lng], {
        radius: craterRadius * 6,
        color: '#fbbf24',
        fillColor: '#fbbf24',
        fillOpacity: 0.1,
        weight: 2
      }).addTo(markersRef.current);
    }

    if (mapRef.current) {
      mapRef.current.setView([impactLocation.lat, impactLocation.lng], 5);
    }
  }, [impactLocation, metrics]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
      {impactLocation && (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-500/30 text-sm">
          <div className="text-cyan-400 font-mono">
            Lat: {impactLocation.lat.toFixed(4)}°
          </div>
          <div className="text-cyan-400 font-mono">
            Lng: {impactLocation.lng.toFixed(4)}°
          </div>
        </div>
      )}
    </div>
  );
}
