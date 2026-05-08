"use client";

import { useEcoStore } from "@/store/useStore";
import { 
  User, 
  Settings, 
  Shield, 
  Award, 
  MapPin, 
  Mail, 
  ChevronRight,
  LogOut,
  Sparkles,
  Trophy,
  Leaf
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useEcoStore();

  const achievements = [
    { name: "Pioneer", date: "Joined April 2026", icon: Shield, color: "text-green bg-green/10" },
    { name: "Eco Warrior", date: "10 Actions Logged", icon: Award, color: "text-orange bg-orange/10" },
    { name: "Streak Master", date: "7 Day Streak", icon: Sparkles, color: "text-green bg-green/10" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-header mb-1">Your Profile</h1>
          <p className="text-foreground/60 font-medium italic">Managing your identity in the biome.</p>
        </div>
        <button className="p-3 rounded-2xl bg-black/5 hover:bg-black/10 transition-colors text-header">
          <Settings size={24} />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bento-card flex flex-col items-center text-center p-8">
            <div className="relative mb-6">
              <div className="h-24 w-24 rounded-full bg-green/20 flex items-center justify-center text-4xl overflow-hidden border-4 border-white shadow-xl">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-black/5">
                <Shield className="text-green" size={20} />
              </div>
            </div>
            <h2 className="text-2xl font-black text-header mb-1">{user.name}</h2>
            <p className="text-sm font-bold text-green uppercase tracking-widest mb-6">{user.tier} Guardian</p>
            
            <div className="w-full space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-black/5 text-left">
                <MapPin size={18} className="text-foreground/40" />
                <span className="text-sm font-medium text-header">{user.city || "San Francisco"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-black/5 text-left">
                <Mail size={18} className="text-foreground/40" />
                <span className="text-sm font-medium text-header">{user.name.toLowerCase()}@biome.eco</span>
              </div>
            </div>

            <button className="w-full mt-8 flex items-center justify-center gap-2 text-foreground/40 hover:text-red-500 font-bold text-sm transition-colors pt-4 border-t border-black/5">
              <LogOut size={18} /> Sign Out
            </button>
          </div>

          <div className="bento-card">
            <h3 className="text-lg font-bold mb-4">Eco Vitality</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground/60">Score</span>
              <span className="font-bold text-header">{user.carbonScore} / 100</span>
            </div>
            <div className="h-2 bg-black/5 rounded-full overflow-hidden">
              <div className="h-full bg-green" style={{ width: `${user.carbonScore}%` }} />
            </div>
          </div>
        </div>

        {/* Achievements & Stats */}
        <div className="md:col-span-2 space-y-8">
          <div className="bento-card">
            <h3 className="text-xl font-extrabold text-header mb-6 flex items-center gap-2">
              <Trophy className="text-orange" size={24} /> Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-black/5 hover:border-green/20 transition-all cursor-pointer">
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", item.color)}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-header">{item.name}</p>
                    <p className="text-[10px] font-bold text-foreground/40 uppercase">{item.date}</p>
                  </div>
                  <ChevronRight size={16} className="ml-auto text-foreground/20" />
                </div>
              ))}
              <div className="flex items-center justify-center p-4 rounded-2xl border-2 border-dashed border-black/5 opacity-50">
                <p className="text-xs font-bold text-foreground/40 uppercase">+ Unlock More</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bento-card flex flex-col gap-4">
              <div className="h-12 w-12 rounded-2xl bg-orange/10 flex items-center justify-center text-orange">
                <Leaf size={24} />
              </div>
              <h3 className="text-xl font-bold">Total Savings</h3>
              <p className="text-4xl font-black text-header">142<span className="text-lg font-bold text-foreground/40 ml-1">kg CO2</span></p>
              <p className="text-xs text-foreground/60 font-medium">Equal to planting <span className="text-green font-bold">6 trees</span> this month.</p>
            </div>
            <div className="bento-card flex flex-col gap-4">
              <div className="h-12 w-12 rounded-2xl bg-green/10 flex items-center justify-center text-green">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold">Points Rank</h3>
              <p className="text-4xl font-black text-header">#1,240</p>
              <p className="text-xs text-foreground/60 font-medium">You are in the <span className="text-orange font-bold">top 12%</span> of all biome users.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
