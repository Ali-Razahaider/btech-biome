"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Flame, 
  TrendingUp, 
  Plus, 
  Leaf, 
  Trophy, 
  Zap, 
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useEcoStore } from "@/store/useStore";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import LogActionModal from "@/components/dashboard/LogActionModal";

const TIER_CONFIG = {
  Bronze: { color: "#CD7F32", min: 0, max: 1500, next: "Silver" },
  Silver: { color: "#C0C0C0", min: 1500, max: 3000, next: "Gold" },
  Gold: { color: "#F9A826", min: 3000, max: 5000, next: "Platinum" },
  Platinum: { color: "#55D688", min: 5000, max: 10000, next: "Diamond" },
};

export default function Dashboard() {
  const router = useRouter();
  const { user, actions, syncWithBackend, challenges, toggleChallenge } = useEcoStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth/login");
      } else {
        syncWithBackend();
      }
    };
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const currentTier = TIER_CONFIG[user.tier] || TIER_CONFIG.Bronze;
  const tierProgress = ((user.points - currentTier.min) / (currentTier.max - currentTier.min)) * 100;

  const gaugeData = [
    { value: user.carbonScore },
    { value: 100 - user.carbonScore },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <LogActionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-header mb-1">Impact Hub</h1>
          <p className="text-foreground/60 font-medium italic">Welcome back, {user.name}. Ready for a greener day?</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-orange/10 px-6 py-3 rounded-2xl flex items-center gap-3 border border-orange/20 shadow-sm shadow-orange/10">
            <Flame className="text-orange animate-pulse" size={24} />
            <div>
              <p className="text-[10px] font-bold text-orange uppercase tracking-wider">Streak</p>
              <p className="font-bold text-header text-xl">{user.streak} Days</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 shadow-lg shadow-green/20"
          >
            <Plus size={20} /> Log Action
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Eco-Score Gauge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bento-card flex flex-col items-center justify-center relative min-h-[300px]"
        >
          <div className="absolute top-6 left-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Zap className="text-green" size={20} /> Eco-Score
            </h3>
          </div>
          
          <div className="w-full h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={180}
                  endAngle={0}
                  paddingAngle={0}
                  dataKey="value"
                >
                  <Cell fill="url(#gaugeGradient)" stroke="none" />
                  <Cell fill="#E2E8F0" stroke="none" />
                </Pie>
                <defs>
                  <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#F9A826" />
                    <stop offset="100%" stopColor="#55D688" />
                  </linearGradient>
                </defs>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
              <span className="text-5xl font-black text-header leading-none">{user.carbonScore}</span>
              <span className="text-xs font-bold text-foreground/40 uppercase mt-1">Excellent</span>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2 text-green font-bold text-sm bg-green/10 px-4 py-2 rounded-full">
            <TrendingUp size={16} /> +12% from last week
          </div>
        </motion.div>

        {/* Tier Progression */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bento-card lg:col-span-2 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                <ShieldCheck className="text-header" size={20} /> Tier Status
              </h3>
              <p className="text-foreground/60 text-sm font-medium">You&apos;re doing great! Keep going to reach Silver.</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-header">{user.points.toLocaleString()}</p>
              <p className="text-xs font-bold text-foreground/40 uppercase">Total Points</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-bold inline-block py-1 px-2 uppercase rounded-full text-orange bg-orange/10">
                    {user.tier} Tier
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold inline-block text-header">
                    {Math.round(tierProgress)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-black/5 p-1 border border-black/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${tierProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange rounded-full"
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-foreground/40 uppercase tracking-widest px-1">
                <span>Bronze</span>
                <span>Silver</span>
                <span>Gold</span>
                <span>Platinum</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-black/5 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-green/10 flex items-center justify-center text-green">
                  <Trophy size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-foreground/40 uppercase">Global Rank</p>
                  <p className="font-bold text-header text-sm">#1,240</p>
                </div>
              </div>
              <div className="bg-white border border-black/5 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-orange/10 flex items-center justify-center text-orange">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-foreground/40 uppercase">Actions Logged</p>
                  <p className="font-bold text-header text-sm">{actions.length}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Eco-Action Log Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bento-card lg:col-span-2"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="text-header" size={20} /> Recent Actions
            </h3>
            <button className="text-green font-bold text-sm hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {actions.slice(0, 3).map((action) => (
              <div key={action.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-black/5 shadow-sm hover:border-green/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green/10 flex items-center justify-center text-green">
                    <Leaf size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-header">{action.title}</p>
                    <p className="text-xs text-foreground/60 font-medium">{new Date(action.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-green">+{action.points} pts</p>
                  <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">{action.type}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Challenge Card Preview */}
        {challenges.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bento-card flex flex-col justify-between"
          >
            <div>
              <div className="bg-orange/10 text-orange text-[10px] font-bold px-2 py-1 rounded-full w-fit mb-4 uppercase tracking-wider">
                Trending Challenge
              </div>
              <h3 className="text-2xl font-black text-header mb-2 leading-tight">{challenges[0].title}</h3>
              <p className="text-foreground/60 text-sm font-medium mb-6">Earn {challenges[0].tag} points and help the community.</p>
              
              <div className="space-y-2 mb-8">
                <div className="flex justify-between text-xs font-bold text-header">
                  <span>Community Progress</span>
                  <span>{challenges[0].progress}%</span>
                </div>
                <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-green" style={{ width: `${challenges[0].progress}%` }} />
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => toggleChallenge(challenges[0].id)}
              className="btn-orange w-full shadow-lg shadow-orange/20"
            >
              {challenges[0].joined ? "View Details" : "Join Challenge"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
