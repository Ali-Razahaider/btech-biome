"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Zap, ArrowRight, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEcoStore } from "@/store/useStore";

interface PlanItem {
  day: number;
  title: string;
  description: string;
  estimated_co2_saved_kg: number;
}

interface WeeklyPlanProps {
  plan: PlanItem[];
}

export default function WeeklyPlan({ plan }: WeeklyPlanProps) {
  const { user } = useEcoStore();
  
  const hasPlan = plan && plan.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bento-card lg:col-span-3"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-black text-header flex items-center gap-3">
            <Calendar className="text-green" size={28} /> Personalized 7-Day Plan
          </h3>
          <p className="text-foreground/60 font-medium italic mt-1">Daily small actions, massive regional impact.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green/10 rounded-full border border-green/20">
          <Leaf size={16} className="text-green" />
          <span className="text-xs font-bold text-green uppercase tracking-wider">
            ~{plan.reduce((acc, item) => acc + item.estimated_co2_saved_kg, 0).toFixed(1)}kg Potential Savings
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {hasPlan ? (
          plan.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "p-5 rounded-3xl border transition-all hover:shadow-lg group relative overflow-hidden",
                index === 0 
                  ? "bg-green-50 border-green-200 ring-2 ring-green-500/20 shadow-green-500/5" 
                  : "bg-white border-black/5 hover:border-green/30"
              )}
            >
              {index === 0 && (
                <div className="absolute top-2 right-2">
                  <span className="text-[8px] font-black bg-green text-white px-2 py-0.5 rounded-full uppercase tracking-tighter animate-pulse">
                    Today
                  </span>
                </div>
              )}
              
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                    index === 0 ? "bg-green text-white" : "bg-black/5 text-foreground/40"
                  )}>
                    Day {item.day}
                  </span>
                </div>
                
                <h4 className="font-bold text-header text-sm mb-2 line-clamp-2 min-h-[40px] group-hover:text-green transition-colors">
                  {item.title}
                </h4>
                <p className="text-[10px] text-foreground/50 font-medium mb-6 line-clamp-3">
                  {item.description}
                </p>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1 text-green">
                    <Zap size={12} fill="currentColor" />
                    <span className="text-[10px] font-black">-{item.estimated_co2_saved_kg}kg</span>
                  </div>
                  <div className="h-6 w-6 rounded-full bg-black/5 flex items-center justify-center text-foreground/20 group-hover:bg-green group-hover:text-white transition-all">
                    <CheckCircle2 size={14} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-7 py-20 text-center bg-black/5 rounded-3xl border-2 border-dashed border-black/10">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-green mx-auto mb-6 shadow-sm">
              <Calendar size={32} />
            </div>
            <h4 className="text-xl font-bold text-header mb-2">Your journey starts here</h4>
            <p className="text-sm text-foreground/60 max-w-md mx-auto">
              Once you calculate your carbon footprint, Biome AI will generate a personalized 7-day plan to help you reduce your impact.
            </p>
            <button 
              onClick={() => window.location.href = "/calculator"}
              className="mt-8 px-8 py-3 bg-header text-white rounded-2xl font-bold text-sm hover:scale-105 transition-all"
            >
              Calculate Now
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
