"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CloudOff, ZapOff } from "lucide-react";

const ProblemSection = () => {
  const problems = [
    {
      icon: ZapOff,
      title: "Gas Shortages",
      description: "Millions in Pakistan face severe energy scarcity, forcing a return to dirty fuels like crop residue and coal.",
      color: "text-orange",
      bg: "bg-orange/10",
    },
    {
      icon: CloudOff,
      title: "Toxic Air Quality",
      description: "Lahore consistently ranks as the most polluted city globally, with PM2.5 levels reaching hazardous peaks.",
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      icon: AlertTriangle,
      title: "No Actionable Path",
      description: "People want to help but lack a practical system that connects personal habits to local environmental impact.",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <h2 className="text-4xl md:text-5xl font-black text-header mb-6 leading-tight">
              Pakistan's Environment is at a <span className="text-orange">Breaking Point.</span>
            </h2>
            <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
              From the suffocating winter smog in Lahore to the chronic gas shortages across Punjab, our environmental crisis is deeply personal. We're not just facing global warming; we're facing a local health and energy emergency.
            </p>
            
            <div className="space-y-6">
              {problems.map((p, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="flex gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100"
                >
                  <div className={`shrink-0 w-12 h-12 rounded-2xl ${p.bg} ${p.color} flex items-center justify-center`}>
                    <p.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-header mb-1">{p.title}</h3>
                    <p className="text-foreground/60">{p.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1 relative"
          >
            <div className="relative aspect-square rounded-[40px] overflow-hidden bg-slate-100 border-8 border-white shadow-2xl">
              {/* Illustration Placeholder - I'll use a gradient and some floating elements to make it look premium */}
              <div className="absolute inset-0 bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <div className="text-slate-400 flex flex-col items-center">
                   <div className="w-32 h-32 bg-slate-400/20 rounded-full animate-pulse mb-4"></div>
                   <div className="w-48 h-4 bg-slate-400/20 rounded-full animate-pulse mb-2"></div>
                   <div className="w-32 h-4 bg-slate-400/20 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Overlay elements */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 p-6 rounded-3xl glass-light shadow-xl border border-white/40"
              >
                <div className="text-3xl font-black text-red-500">450+</div>
                <div className="text-sm font-bold text-header uppercase tracking-wider">AQI LAHORE</div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 left-10 p-6 rounded-3xl glass-light shadow-xl border border-white/40"
              >
                <div className="text-3xl font-black text-orange">60%</div>
                <div className="text-sm font-bold text-header uppercase tracking-wider">GAS DEFICIT</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
