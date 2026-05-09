"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calculator, Map, Users, Zap, Brain, TrendingUp } from "lucide-react";
import Image from "next/image";

const BentoFeatures = () => {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="container mx-auto px-4 md:px-12">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-header mb-6">Built for Modern Impact</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
            Everything you need to make sustainability simple, measurable, and rewarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px]">
          {/* Main Feature - Calculator */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-8 md:row-span-2 group relative overflow-hidden rounded-[2.5rem] bg-green p-10 text-white"
            style={{ boxShadow: "0 8px 40px 0 rgba(85,214,136,0.35), 0 2px 12px 0 rgba(85,214,136,0.18)" }}
          >
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8">
                <Calculator size={32} />
              </div>
              <h3 className="text-4xl text-white! font-black mb-4">AI Carbon Calculator</h3>
              <p className="text-white/80 text-xl max-w-md leading-relaxed mb-auto">
                Calculate your CO2 footprint with sciAI Carbon Calculatorentific precision and get a personalized reduction plan.
              </p>
              <div className="flex gap-4">
                <div className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm font-bold">Transport</div>
                <div className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm font-bold">Home Energy</div>
                <div className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm font-bold">Food Habits</div>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-2/3 h-2/3 opacity-20 transform translate-x-1/4 translate-y-1/4">
              <Calculator size={400} />
            </div>
          </motion.div>

          {/* Feature - Regional Map */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 md:row-span-1 group relative overflow-hidden rounded-[2.5rem] bg-blue-500 p-8 text-white"
            style={{ boxShadow: "0 8px 40px 0 rgba(59,130,246,0.35), 0 2px 12px 0 rgba(59,130,246,0.18)" }}
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                <Map size={24} />
              </div>
              <h3 className="text-2xl text-white! font-bold mb-2">Regional Intelligence</h3>
              <p className="text-white/80">Interactive map showing live AQI and biomass potential.</p>
            </div>
            <div className="absolute top-0 right-0 p-6 opacity-30">
              <TrendingUp size={100} />
            </div>
          </motion.div>

          {/* Feature - Community */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 md:row-span-1 group relative overflow-hidden rounded-[2.5rem] bg-orange p-8 text-white"
            style={{ boxShadow: "0 8px 40px 0 rgba(249,115,22,0.35), 0 2px 12px 0 rgba(249,115,22,0.18)" }}
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-2xl text-white! font-bold mb-2">Community Action</h3>
              <p className="text-white/80">Join missions, track collective impact, and climb leaderboards.</p>
            </div>
            <div className="absolute bottom-0 right-0 p-6 opacity-30">
              <Zap size={80} />
            </div>
          </motion.div>

          {/* Small Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-4 md:row-span-1 group relative overflow-hidden rounded-[2.5rem] bg-slate-100 p-8 border border-black/5"
            style={{ boxShadow: "0 4px 24px 0 rgba(85,214,136,0.15), 0 1px 6px 0 rgba(85,214,136,0.08)" }}
          >
            <div className="w-12 h-12 rounded-xl bg-green/10 text-green flex items-center justify-center mb-6">
              <Brain size={24} />
            </div>
            <h3 className="text-xl   font-bold text-header mb-2">AI Advisor</h3>
            <p className="text-foreground/60 text-sm">Personalized weekly plans powered by Gemini AI.</p>
          </motion.div>

          {/* Small Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-4 md:row-span-1 group relative overflow-hidden rounded-[2.5rem] bg-slate-100 p-8 border border-black/5"
            style={{ boxShadow: "0 4px 24px 0 rgba(59,130,246,0.15), 0 1px 6px 0 rgba(59,130,246,0.08)" }}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold text-header mb-2">Live AQI Data</h3>
            <p className="text-foreground/60 text-sm">Real-time air quality tracking for major Pakistani cities.</p>
          </motion.div>

          {/* Small Feature 3 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="md:col-span-4 md:row-span-1 group relative overflow-hidden rounded-[2.5rem] bg-slate-100 p-8 border border-black/5"
            style={{ boxShadow: "0 4px 24px 0 rgba(249,115,22,0.15), 0 1px 6px 0 rgba(249,115,22,0.08)" }}
          >
            <div className="w-12 h-12 rounded-xl bg-orange/10 text-orange flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-header mb-2">Action Log</h3>
            <p className="text-foreground/60 text-sm">Build eco-habits with daily streaks and gamified rewards.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BentoFeatures;
