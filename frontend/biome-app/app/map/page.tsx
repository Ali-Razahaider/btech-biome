"use client";

import dynamic from "next/dynamic";
import { useEcoStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import { Globe, Wind, Info, MapPin, Zap, Brain, TrendingUp, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { aiApi } from "@/lib/api";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/5 animate-pulse rounded-[2rem]" />
});

export default function MapPage() {
  const { user, aqi, fetchAQI, selectedZone, setSelectedZone, syncWithBackend } = useEcoStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      await Promise.all([
        syncWithBackend(),
        fetchAQI(user.city || "Lahore")
      ]);
    };
    load();
  }, [user.city, fetchAQI, syncWithBackend]);

  const handleAnalyze = async () => {
    if (!selectedZone) return;
    setIsAnalyzing(true);
    setAnalysisResult(null); // Clear previous
    try {
      const result = await aiApi.analyzeBiomass({
        lat: selectedZone.coords[0],
        lng: selectedZone.coords[1],
        district: selectedZone.name,
        aqi: aqi?.value || 0
      });
      setAnalysisResult(result);
    } catch (e) {
      console.error("AI Analysis failed", e);
    }
    setIsAnalyzing(false);
  };

  useEffect(() => {
    if (selectedZone) {
      handleAnalyze();
    }
  }, [selectedZone]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-header mb-1">Environmental Map</h1>
          <p className="text-foreground/60 font-medium italic">Live air quality and biomass intelligence for Pakistan.</p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-black/5 p-4 rounded-2xl shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-green/10 flex items-center justify-center text-green">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-foreground/40 uppercase">Tracking</p>
            <p className="font-bold text-header">{user.city || "Lahore"}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 relative">
        <div className="lg:col-span-3 bento-card p-0 overflow-hidden min-h-[600px] relative border-4 border-white">
          {aqi?.coords && (
            <MapComponent center={[aqi.coords[0], aqi.coords[1]]} aqi={aqi.value} />
          )}
          
          <div className="absolute bottom-6 left-6 z-10">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-black/5 shadow-lg max-w-xs">
              <div className="flex items-center gap-2 mb-2 text-green font-bold text-xs uppercase tracking-widest">
                <div className="h-2 w-2 rounded-full bg-green animate-pulse" />
                Punjab Biomass Layer
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Click on the colored circles to analyze biogas feasibility and potential CO2 reduction in specific districts.
              </p>
            </div>
          </div>

          <AnimatePresence>
            {selectedZone && (
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute top-0 right-0 bottom-0 w-full md:w-96 bg-white shadow-2xl z-20 overflow-y-auto custom-scrollbar border-l border-black/5"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                      <Brain size={24} />
                    </div>
                    <button 
                      onClick={() => setSelectedZone(null)}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <h2 className="text-2xl font-black text-header mb-1">{selectedZone.name}</h2>
                  <p className="text-foreground/60 font-medium mb-8">AI Feasibility Assessment</p>

                  {isAnalyzing || !analysisResult ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                       <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="text-purple-500 mb-6"
                       >
                         <Zap size={48} />
                       </motion.div>
                       <p className="font-bold text-header animate-pulse">Gemini is analyzing crop data...</p>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                         <div className="flex justify-between items-center mb-4">
                           <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Feasibility Score</span>
                           <span className="text-2xl font-black text-green">{analysisResult.feasibility_score}/10</span>
                         </div>
                         <div className="h-3 bg-black/5 rounded-full overflow-hidden">
                           <div className="h-full bg-green transition-all duration-1000" style={{ width: `${analysisResult.feasibility_score * 10}%` }} />
                         </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <p className="text-[10px] font-bold text-blue-500 uppercase mb-1">CO2 Saved</p>
                            <p className="text-xl font-black text-header">{(analysisResult.co2_saved_kg / 1000).toFixed(1)}k <span className="text-xs font-medium">Tons</span></p>
                         </div>
                         <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                            <p className="text-[10px] font-bold text-orange uppercase mb-1">Households</p>
                            <p className="text-xl font-black text-header">{analysisResult.households_powered?.toLocaleString() || 0}</p>
                         </div>
                       </div>

                       <div className="space-y-4">
                         <h3 className="font-bold text-header flex items-center gap-2">
                           <TrendingUp className="text-green" size={18} /> AI Recommendations
                         </h3>
                         <ul className="space-y-4">
                           {(analysisResult.tips || []).map((tip: string, i: number) => (
                             <li key={i} className="text-sm text-foreground/60 leading-relaxed pl-4 border-l-2 border-green/30">
                               {tip}
                             </li>
                           ))}
                         </ul>
                       </div>

                       <button className="btn-primary w-full shadow-lg shadow-green/20">
                         Export Full Report
                       </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
                <span className={aqi?.value && aqi.value > 150 ? "text-red-500" : "text-green"}>
                  {aqi?.status || "Loading..."}
                </span>
              </div>
              <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-1000",
                    aqi?.value && aqi.value > 150 ? "bg-red-500" : "bg-green"
                  )} 
                  style={{ width: `${Math.min(100, (aqi?.value || 0) / 2)}%` }} 
                />
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
                <span className="text-sm font-medium text-foreground/60">Biomass Zones</span>
                <span className="font-bold text-header">4 Active</span>
              </div>
            </div>
          </div>

          <div className="bento-card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Info className="text-header" size={18} /> Health Tips
            </h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              {aqi?.value && aqi.value > 150 
                ? "Air quality is hazardous. Wear an N95 mask outdoors and use air purifiers inside."
                : "Air quality is manageable today. A good time for outdoor activities in green spaces."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
