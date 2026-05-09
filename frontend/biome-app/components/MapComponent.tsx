"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEcoStore } from "@/store/useStore";

// Fix for default marker icons in Leaflet + Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapProps {
  center: [number, number];
  aqi: number;
  regionalAQIs?: { city: string; value: number; coords: [number, number] }[];
}

export default function MapComponent({ center, aqi, regionalAQIs }: MapProps) {
  const { biomassZones, setSelectedZone } = useEcoStore();
  
  // Safe center fallback for Pakistan (Lahore)
  const mapCenter: [number, number] = center || [31.5204, 74.3587];

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

  return (
    <div className="w-full h-full z-0 relative">
      <MapContainer 
        center={mapCenter} 
        zoom={8} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%", background: "#F8FAF9" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* User Location Marker */}
        <Marker position={mapCenter} icon={icon}>
          <Popup className="custom-popup">
            <div className="p-2 min-w-[150px]">
              <h3 className="font-extrabold text-header mb-2">Live AQI (Your City)</h3>
              <div className="flex items-center justify-between bg-black/5 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-foreground/40 uppercase">Air Index</span>
                <span className="font-black text-lg" style={{ color: getAQIColor(aqi) }}>{aqi}</span>
              </div>
            </div>
          </Popup>
        </Marker>
        
        {/* Regional AQI Markers */}
        {regionalAQIs?.map((item, idx) => (
          <Marker 
            key={`reg-${idx}`} 
            position={item.coords} 
            icon={L.divIcon({
              className: "custom-div-icon",
              html: `<div style="background-color: ${getAQIColor(item.value)}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3); display: flex; items-center; justify-center; color: white; font-size: 8px; font-weight: 900;">${item.value}</div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[150px]">
                <h3 className="font-extrabold text-header mb-2">{item.city} AQI</h3>
                <div className="flex items-center justify-between bg-black/5 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-foreground/40 uppercase">Air Index</span>
                  <span className="font-black text-lg" style={{ color: getAQIColor(item.value) }}>{item.value}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Biomass Zones */}
        {biomassZones.map((zone) => (
          <React.Fragment key={zone.id}>
            <Circle 
              center={zone.coords} 
              radius={15000} 
              eventHandlers={{
                click: () => setSelectedZone(zone),
              }}
              pathOptions={{ 
                fillColor: getPotentialColor(zone.potential), 
                fillOpacity: 0.4, 
                color: getPotentialColor(zone.potential),
                weight: 2,
              }} 
            />
            <Marker 
              position={zone.coords} 
              icon={L.divIcon({
                className: "custom-div-icon",
                html: `<div style="background-color: ${getPotentialColor(zone.potential)}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px rgba(0,0,0,0.4); display: flex; align-items: center; justify-center;"></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              })}
              eventHandlers={{
                click: () => setSelectedZone(zone),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[180px]">
                  <h3 className="font-extrabold text-header mb-1">{zone.name}</h3>
                  <p className="text-[10px] font-bold text-foreground/40 uppercase mb-3">Biomass Zone</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-black/5 p-2 rounded-lg">
                      <span className="text-[10px] font-bold text-foreground/40 uppercase">Potential</span>
                      <span className="font-bold text-sm" style={{ color: getPotentialColor(zone.potential) }}>{zone.potential}</span>
                    </div>
                    <div className="flex justify-between items-center bg-black/5 p-2 rounded-lg">
                      <span className="text-[10px] font-bold text-foreground/40 uppercase">Crop</span>
                      <span className="font-bold text-sm text-header">{zone.cropType}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedZone(zone)}
                    className="w-full mt-4 bg-header text-white text-[10px] font-bold py-2 rounded-lg uppercase tracking-widest hover:bg-black/80 transition-colors"
                  >
                    Analyze Site
                  </button>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>

      <style jsx global>{`
        .leaflet-container {
          font-family: inherit;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          background: #FFFFFF !important;
          color: #334155 !important;
          border-radius: 20px !important;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1) !important;
          padding: 4px !important;
        }
        .custom-popup .leaflet-popup-tip {
          background: #FFFFFF !important;
        }
      `}</style>
    </div>
  );
}

