"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calculator, Zap, Users, Map, Brain, Award } from "lucide-react";
import Link from "next/link";

const BentoFeatures = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-header mb-4">Precision Tools for Change</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
            Everything you need to measure, act, and transform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[auto] md:h-[800px]">
          {/* Calculator - Large Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 md:row-span-1 p-8 rounded-[32px] bg-green/5 border border-green/10 flex flex-col justify-between group overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-green text-white flex items-center justify-center mb-6 shadow-lg shadow-green/20">
                <Calculator size={24} />
              </div>
              <h3 className="text-2xl font-bold text-header mb-3">AI Carbon Calculator</h3>
              <p className="text-foreground/60 max-w-sm mb-6">
                Enter your transport, energy, and food habits to get a precise breakdown of your annual CO2 emissions.
              </p>
              <Link href="/calculator" className="text-green font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                Try it now <Zap size={18} fill="currentColor" />
              </Link>
            </div>
            
            {/* Abstract visual element */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-green/10 rounded-full blur-3xl group-hover:bg-green/20 transition-colors duration-500"></div>
          </motion.div>

          {/* Map - Tall Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-1 md:row-span-2 p-8 rounded-[32px] bg-blue-50 border border-blue-100 flex flex-col justify-between group overflow-hidden relative"
          >
             <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-blue/20">
                <Map size={24} />
              </div>
              <h3 className="text-2xl font-bold text-header mb-3">Biomass Explorer</h3>
              <p className="text-foreground/60 mb-6">
                Real-time AQI tracking and Punjab biomass potential maps for renewable energy planning.
              </p>
              <Link href="/map" className="text-blue-600 font-bold flex items-center gap-2">
                Explore Map
              </Link>
            </div>
            
            <div className="mt-8 flex-1 bg-blue-200/30 rounded-2xl border border-blue-200/50 relative overflow-hidden">
                {/* Simplified Map UI elements */}
                <div className="absolute top-4 left-4 right-4 h-2 bg-blue-300/30 rounded-full"></div>
                <div className="absolute top-8 left-4 w-1/2 h-2 bg-blue-300/30 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full border-4 border-blue-400/30"></div>
            </div>
          </motion.div>

          {/* AI Insights - Square Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-1 md:row-span-1 p-8 rounded-[32px] bg-purple-50 border border-purple-100 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-purple/20">
                <Brain size={24} />
              </div>
              <h3 className="text-xl font-bold text-header mb-2">Gemini AI Advisor</h3>
              <p className="text-sm text-foreground/60">
                Personalized 7-day action plans and biogas feasibility reports.
              </p>
            </div>
          </motion.div>

          {/* Community - Large Bottom Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 md:row-span-1 p-8 rounded-[32px] bg-orange/5 border border-orange/10 flex flex-col md:flex-row gap-8 items-center group overflow-hidden relative"
          >
            <div className="flex-1 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-orange text-white flex items-center justify-center mb-6 shadow-lg shadow-orange/20">
                <Users size={24} />
              </div>
              <h3 className="text-2xl font-bold text-header mb-3">Community Challenges</h3>
              <p className="text-foreground/60 mb-6">
                Join thousands of others in "No Plastic Week" or "Bike to Work" challenges.
              </p>
              <Link href="/community" className="text-orange font-bold">Join Community</Link>
            </div>
            <div className="flex-1 w-full relative z-10">
               {/* Leaderboard UI mock */}
               <div className="space-y-3">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-orange/10">
                     <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                     <div className="flex-1 h-2 bg-slate-200 rounded-full"></div>
                     <div className="w-8 h-4 bg-orange/20 rounded-full"></div>
                   </div>
                 ))}
               </div>
            </div>
          </motion.div>

          {/* Streaks/Rewards - Square Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-1 md:row-span-1 p-8 rounded-[32px] bg-amber-50 border border-amber-100 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-amber/20">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold text-header mb-2">Impact Rewards</h3>
              <p className="text-sm text-foreground/60">
                Maintain daily streaks to earn points and rank up.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BentoFeatures;
