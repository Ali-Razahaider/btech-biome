"use client";

import dynamic from "next/dynamic";
import { useEcoStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import { Globe, Wind, Info, MapPin, Zap } from "lucide-react";
import { motion } from "framer-motion";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/5 animate-pulse rounded-[2rem]" />
});

export default function MapPage() {
  const { user, aqi, fetchAQI } = useEcoStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await fetchAQI(user.city || "San Francisco");
      setIsLoading(false);
    };
    load();
  }, [user.city, fetchAQI]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-header mb-1">Environmental Map</h1>
          <p className="text-foreground/60 font-medium italic">Live air quality and eco-impact data for your region.</p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-black/5 p-4 rounded-2xl shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-green/10 flex items-center justify-center text-green">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-foreground/40 uppercase">Tracking</p>
            <p className="font-bold text-header">{user.city || "San Francisco"}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bento-card p-0 overflow-hidden min-h-[600px] relative border-4 border-white">
          {aqi?.coords && (
            <MapComponent center={[aqi.coords[0], aqi.coords[1]]} aqi={aqi.value} />
          )}
          
          <div className="absolute bottom-6 left-6 z-10">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-black/5 shadow-lg max-w-xs">
              <div className="flex items-center gap-2 mb-2 text-green font-bold text-xs uppercase tracking-widest">
                <div className="h-2 w-2 rounded-full bg-green animate-pulse" />
                Live Sensor Network
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Data is aggregated from over 12,000 global monitoring stations to provide real-time hyper-local insights.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bento-card">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Wind className="text-green" size={20} /> Air Quality
            </h3>
            <div className="text-center mb-6">
              <p className="text-5xl font-black text-header mb-1">{aqi?.value || "--"}</p>
              <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">AQI Score</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground/40">Status</span>
                <span className="text-green">Good</span>
              </div>
              <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-green w-[85%]" />
              </div>
            </div>
          </div>

          <div className="bento-card bg-orange/5 border-orange/10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="text-orange" size={18} /> Regional Impact
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground/60">Solar Output</span>
                <span className="font-bold text-header">High</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground/60">Grid Purity</span>
                <span className="font-bold text-header">64%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground/60">Wind Forecast</span>
                <span className="font-bold text-header">8m/s</span>
              </div>
            </div>
          </div>

          <div className="bento-card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Info className="text-header" size={18} /> Health Tips
            </h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Air quality is excellent today. A perfect time for outdoor exercise and deep breathing in nature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
