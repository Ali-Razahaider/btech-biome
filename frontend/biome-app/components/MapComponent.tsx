"use client";

import { useEffect, useState, useRef } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEcoStore } from "@/store/useStore";
import { MapPin, Info, Zap, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MapProps {
  center: [number, number]; // [lat, lng]
  aqi: number;
}

export default function MapComponent({ center, aqi }: MapProps) {
  const { biomassZones, selectedZone, setSelectedZone } = useEcoStore();
  const [viewState, setViewState] = useState({
    latitude: center[0] || 31.5204,
    longitude: center[1] || 74.3587,
    zoom: 10
  });

  const mapRef = useRef<any>(null);

  useEffect(() => {
    setViewState((prev) => ({
      ...prev,
      latitude: center[0],
      longitude: center[1]
    }));
  }, [center]);

  const getAQIColor = (val: number) => {
    if (val < 50) return "#55D688"; // Green
    if (val < 100) return "#F9A826"; // Orange
    return "#EF4444"; // Red
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case "High": return "#10B981";
      case "Medium": return "#3B82F6";
      default: return "#94A3B8";
    }
  };

  // Convert biomassZones to GeoJSON for circular visualizations if needed, 
  // but for now let's use Markers with custom icons to match the design.
  
  return (
    <div className="w-full h-full z-0 relative rounded-[2rem] overflow-hidden">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
        ref={mapRef}
      >
        <NavigationControl position="top-right" />
        {/* User Location Marker */}
        <Marker 
          latitude={center[0]} 
          longitude={center[1]} 
          anchor="bottom"
        >
          <div className="group relative cursor-pointer">
            <div className="h-10 w-10 bg-white rounded-2xl shadow-xl border-2 border-green flex items-center justify-center text-green transform group-hover:scale-110 transition-transform">
              <MapPin size={24} fill="currentColor" fillOpacity={0.2} />
            </div>
            
            {/* Simple Tooltip on Hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
              <div className="bg-header text-white px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap shadow-xl">
                LIVE AQI: {aqi}
              </div>
            </div>
          </div>
        </Marker>

        {/* Biomass Zones as Markers */}
        {biomassZones.map((zone) => (
          <Marker
            key={zone.id}
            latitude={zone.coords[0]}
            longitude={zone.coords[1]}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedZone(zone);
            }}
          >
            <div 
              className="relative cursor-pointer"
            >
              {/* Pulse effect for High Potential */}
              {zone.potential === "High" && (
                <div 
                  className="absolute inset-0 rounded-full animate-ping opacity-20"
                  style={{ backgroundColor: getPotentialColor(zone.potential) }}
                />
              )}
              
              <div 
                className={cn(
                  "h-12 w-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white transition-all hover:scale-125",
                  selectedZone?.id === zone.id ? "scale-125 ring-4 ring-offset-2" : ""
                )}
                style={{ 
                  backgroundColor: getPotentialColor(zone.potential),
                  boxShadow: `0 0 20px ${getPotentialColor(zone.potential)}40`,
                  ["--tw-ring-color" as any]: getPotentialColor(zone.potential)
                }}
              >
                <Zap size={20} fill="currentColor" />
              </div>

              {/* Label for the zone */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2">
                <div className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md border border-black/5 shadow-sm">
                   <p className="text-[8px] font-black text-header whitespace-nowrap uppercase tracking-tight">{zone.name}</p>
                </div>
              </div>
            </div>
          </Marker>
        ))}

        {/* Popup for Selected Zone */}
        {selectedZone && (
          <Popup
            latitude={selectedZone.coords[0]}
            longitude={selectedZone.coords[1]}
            anchor="bottom"
            onClose={() => setSelectedZone(null)}
            closeButton={false}
            className="custom-mapbox-popup"
            offset={30}
          >
            <div className="p-4 min-w-[200px] bg-white rounded-3xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-extrabold text-header text-lg leading-tight">{selectedZone.name}</h3>
                  <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Biomass Intelligence</p>
                </div>
                <button 
                  onClick={() => setSelectedZone(null)}
                  className="p-1.5 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-black/5 p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-orange" />
                    <span className="text-[10px] font-bold text-foreground/60 uppercase">Potential</span>
                  </div>
                  <span className="font-bold text-sm" style={{ color: getPotentialColor(selectedZone.potential) }}>{selectedZone.potential}</span>
                </div>
                <div className="flex justify-between items-center bg-black/5 p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Info size={14} className="text-blue-500" />
                    <span className="text-[10px] font-bold text-foreground/60 uppercase">Crop Type</span>
                  </div>
                  <span className="font-bold text-sm text-header">{selectedZone.cropType}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedZone(selectedZone)}
                className="w-full mt-5 bg-header text-white text-[10px] font-bold py-3 rounded-2xl uppercase tracking-widest hover:bg-black/80 transition-all shadow-lg shadow-black/10 active:scale-95"
              >
                Analyze AI Feasibility
              </button>
            </div>
          </Popup>
        )}
      </Map>

      <style jsx global>{`
        .custom-mapbox-popup .mapboxgl-popup-content {
          padding: 0 !important;
          background: transparent !important;
          border-radius: 32px !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          border: none !important;
        }
        .custom-mapbox-popup .mapboxgl-popup-tip {
          border-top-color: white !important;
        }
        .mapboxgl-ctrl-bottom-right, .mapboxgl-ctrl-bottom-left {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
