"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
}

export default function MapComponent({ center, aqi }: MapProps) {
  const getAQIColor = (val: number) => {
    if (val < 50) return "#55D688"; // Green
    if (val < 100) return "#F9A826"; // Orange
    return "#334155"; // Slate
  };

  return (
    <div className="w-full h-full z-0 relative">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%", background: "#F8FAF9" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={center} icon={icon}>
          <Popup className="custom-popup">
            <div className="p-2 min-w-[150px]">
              <h3 className="font-extrabold text-header mb-2">Local Quality</h3>
              <div className="flex items-center justify-between bg-black/5 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-foreground/40 uppercase">Air Index</span>
                <span className="font-black text-lg" style={{ color: getAQIColor(aqi) }}>{aqi}</span>
              </div>
              <p className="text-[9px] font-bold text-foreground/30 mt-3 uppercase tracking-widest text-center">Live Sensor Data</p>
            </div>
          </Popup>
        </Marker>
        <Circle 
          center={center} 
          radius={2000} 
          pathOptions={{ 
            fillColor: getAQIColor(aqi), 
            fillOpacity: 0.1, 
            color: getAQIColor(aqi),
            weight: 1,
            dashArray: "5, 10"
          }} 
        />
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
        .leaflet-bar {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }
        .leaflet-bar a {
          background-color: #FFFFFF !important;
          color: #334155 !important;
          border-bottom: 1px solid rgba(0,0,0,0.05) !important;
        }
      `}</style>
    </div>
  );
}

