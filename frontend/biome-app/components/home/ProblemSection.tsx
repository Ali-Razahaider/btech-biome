"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Wind, Zap } from "lucide-react";

const ProblemSection = () => {
  return (
    <section className="py-24 relative overflow-hidden ">
      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm mb-6 border border-emerald-100"
          >
            <AlertTriangle size={16} />
            <span>The Crisis in Pakistan</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-header mb-8 leading-tight">
            Our Environment is at a <span className="text-emerald-400">Breaking Point</span>
          </h2>
          <p className="text-xl text-foreground/60 leading-relaxed">
            Unbreathable air and energy scarcity are linked crises. It's time to act.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group p-8 md:p-12 rounded-[2.5rem] bg-white border border-slate-100 hover:border-emerald-200 transition-colors"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition-transform">
              <Wind size={32} />
            </div>
            <h3 className="text-3xl font-bold text-header mb-6">Unbreathable Air</h3>
            <p className="text-lg text-foreground/60 mb-6 leading-relaxed">
              Seasonal crop burning blankets our cities in smog, exposing millions to hazardous PM2.5 levels.
            </p>
            <div className="flex items-center gap-4   font-black">
              <span className="text-4xl">40M+</span>
              <span className="text-sm uppercase tracking-wider">People Affected by Smog</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group p-8 md:p-12 rounded-[2.5rem] bg-white border border-slate-100 hover:border-emerald-200 transition-colors"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition-transform">
              <Zap size={32} />
            </div>
            <h3 className="text-3xl font-bold text-header mb-6">Energy Scarcity</h3>
            <p className="text-lg text-foreground/60 mb-6 leading-relaxed">
              Gas shortages force reliance on wood and coal, while millions of tonnes of clean biogas potential goes up in smoke.
            </p>
            <div className="flex items-center gap-4   font-black">
              <span className="text-4xl">18M</span>
              <span className="text-sm uppercase tracking-wider">Tonnes of Crop Waste Burned</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
