"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, ArrowRight, Lightbulb, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEcoStore } from "@/store/useStore";
import { SkeletonInsightRow } from "@/components/Skeleton";

interface AIInsightsProps {
  insights: string[];
}

export default function AIInsights({ insights }: AIInsightsProps) {
  const { user, isLoading } = useEcoStore();
  
  const hasInsights = insights.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bento-card lg:col-span-3 bg-linear-to-br from-purple-50 to-white border-purple-100"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
            <Brain className="text-purple-500" size={20} /> AI Sustainability Insights
          </h3>
          <p className="text-foreground/60 text-sm font-medium italic">Personalized levers to reduce your footprint.</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
          <Sparkles size={20} className="animate-pulse" />
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <>
            <SkeletonInsightRow />
            <SkeletonInsightRow />
            <SkeletonInsightRow />
          </>
        ) : hasInsights ? (
          insights.map((insight, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all group"
            >
              <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Lightbulb size={16} />
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="text-sm font-medium text-header leading-relaxed">{insight}</p>
                <ArrowRight size={14} className="text-purple-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-12 text-center">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 mx-auto mb-4">
              <Zap size={24} />
            </div>
            <p className="text-sm font-bold text-header">No insights yet</p>
            <p className="text-xs text-foreground/50 mt-1">
              {user.carbonScore === 0 
                ? "Calculate your footprint to get AI-powered tips." 
                : "Gemini is still processing your data..."}
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-6 border-t border-purple-100 flex justify-end">
        <button className="text-[10px] font-bold text-purple-500 uppercase tracking-widest hover:underline">
          Refresh Analysis
        </button>
      </div>
    </motion.div>
  );
}
