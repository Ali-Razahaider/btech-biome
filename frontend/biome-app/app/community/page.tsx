"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Globe, Search, ArrowRight, Wind, Loader2, Users, Flame, Star, MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEcoStore } from "@/store/useStore";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/5 animate-pulse rounded-[2.5rem]" />
});

const MOCK_LEADERBOARD = [
  { id: 1, name: "EcoEnthusiast", points: 4850, level: 42, avatar: "🌍" },
  { id: 2, name: "GreenGuard", points: 4210, level: 38, avatar: "🌱" },
  { id: 3, name: "SolarSage", points: 3980, level: 35, avatar: "☀️" },
  { id: 4, name: "PlanetProtector", points: 3450, level: 31, avatar: "🌊" },
  { id: 5, name: "CarbonCracker", points: 3120, level: 28, avatar: "🍃" },
];

export default function Community() {
  const { user, challenges, toggleChallenge, aqi, fetchAQI } = useEcoStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingAQI, setIsLoadingAQI] = useState(false);

  useEffect(() => {
    const loadAQI = async () => {
      setIsLoadingAQI(true);
      await fetchAQI(user.city || "San Francisco");
      setIsLoadingAQI(false);
    };
    loadAQI();
  }, [user.city, fetchAQI]);

  const leaderboard = [
    ...MOCK_LEADERBOARD.map(h => ({ ...h, isMe: false })), 
    { 
      id: 99, 
      name: user.name + " (You)", 
      points: user.points, 
      level: Math.floor(user.points / 100), 
      avatar: "👤",
      isMe: true 
    }
  ].sort((a, b) => b.points - a.points);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-header mb-1">Community Hub</h1>
          <p className="text-foreground/60 font-medium italic">Join {MOCK_LEADERBOARD.length + 142} heroes protecting the biome.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find heroes or missions..." 
              className="w-full bg-black/5 border border-transparent rounded-2xl py-3 pl-12 pr-4 focus:bg-white focus:border-green/20 outline-none text-sm transition-all text-header"
            />
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Leaderboard */}
        <div className="bento-card">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-extrabold text-header flex items-center gap-2">
              <Trophy className="text-orange" size={24} /> Top Guardians
            </h3>
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Global</span>
          </div>

          <div className="space-y-3">
            {leaderboard.map((hero, idx) => (
              <div
                key={hero.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl transition-all border",
                  hero.isMe ? "bg-orange/10 border-orange/20" : "bg-black/5 border-transparent"
                )}
              >
                <div className="flex items-center gap-4">
                  <span className={cn("text-xs font-black w-4", idx === 0 ? "text-orange" : "text-foreground/30")}>
                    {idx + 1}
                  </span>
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">
                    {hero.avatar}
                  </div>
                  <div>
                    <div className="text-header font-bold text-sm">{hero.name}</div>
                    <div className={cn("text-[10px] font-bold uppercase", hero.isMe ? "text-orange" : "text-green")}>
                      Level {hero.level}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-sm text-header">{hero.points.toLocaleString()}</div>
                  <div className="text-[8px] font-bold text-foreground/40 uppercase">PTS</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Impact Map */}
        <div className="lg:col-span-2 bento-card flex flex-col p-0 overflow-hidden relative min-h-[500px]">
          <div className="p-8 pb-4 absolute top-0 left-0 w-full z-10 flex justify-between items-start pointer-events-none">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-black/5 shadow-lg pointer-events-auto">
              <h3 className="text-xl font-extrabold text-header flex items-center gap-2 mb-2">
                <Globe className="text-green" size={20} /> Bio-Map (Live)
              </h3>
              <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Satellite Feed: {user.city}</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-black/5 shadow-lg pointer-events-auto flex items-center gap-6">
              <div className="text-center">
                <p className="text-[8px] font-bold text-foreground/40 uppercase mb-1">Local AQI</p>
                {isLoadingAQI ? (
                  <Loader2 className="animate-spin text-green mx-auto" size={16} />
                ) : (
                  <p className="text-lg font-black text-header">{aqi?.value || "68"}</p>
                )}
              </div>
              <div className="w-px h-8 bg-black/5" />
              <div className="text-center">
                <p className="text-[8px] font-bold text-foreground/40 uppercase mb-1">CO2 Saved</p>
                <p className="text-lg font-black text-green">4.2M</p>
              </div>
            </div>
          </div>

          <div className="grow relative bg-gray-100">
             {aqi?.coords && (
              <MapComponent center={[aqi.coords[0], aqi.coords[1]]} aqi={aqi.value} />
            )}
          </div>
        </div>

        {/* Missions / Challenges */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-3xl font-black text-header mb-1">Active Missions</h3>
              <p className="text-foreground/60 font-medium">Join global challenges to earn massive points.</p>
            </div>
            <div className="btn-orange px-6 py-2 rounded-full text-xs flex items-center gap-2">
              <Flame size={14} /> Trending Now
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={cn(
                  "bento-card group flex flex-col",
                  challenge.joined && "border-green/30 ring-1 ring-green/5 bg-green/5"
                )}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-black/5 flex items-center justify-center text-header group-hover:scale-110 transition-transform">
                    {challenge.tag === "Lifestyle" ? <Star className="text-orange" size={24} /> : <Wind className="text-green" size={24} />}
                  </div>
                  <div className="bg-white px-3 py-1 rounded-full text-[10px] font-black border border-black/5 shadow-sm">
                    {challenge.tag.toUpperCase()}
                  </div>
                </div>

                <h4 className="text-xl font-extrabold text-header mb-2">{challenge.title}</h4>
                <p className="text-sm text-foreground/60 mb-8 line-clamp-2">Join {challenge.participants.toLocaleString()} others in this high-impact sustainability challenge.</p>
                
                <div className="mt-auto space-y-4">
                  <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                    <span>Progress</span>
                    <span className="text-green">{challenge.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${challenge.progress}%` }}
                      className="h-full bg-green"
                    />
                  </div>

                  <button
                    onClick={() => toggleChallenge(challenge.id)}
                    className={cn(
                      "w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                      challenge.joined
                        ? "bg-white border-2 border-green/20 text-green"
                        : "btn-orange"
                    )}
                  >
                    {challenge.joined ? "Joined" : "Join Mission"}
                    {!challenge.joined && <ArrowRight size={18} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

