"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Users, Globe } from "lucide-react";

const SolutionLayers = () => {
  const layers = [
    {
      title: "Personal Layer",
      icon: User,
      description: "Track your footprint, log daily actions, and build sustainable habits through gamification and AI insights.",
      features: ["Carbon Calculator", "Daily Action Log", "Streak Tracking"],
      color: "from-green-400 to-emerald-500",
    },
    {
      title: "Community Layer",
      icon: Users,
      description: "Join local challenges, compete on leaderboards, and see the collective impact of your city.",
      features: ["Eco-Challenges", "City Leaderboards", "Social Proof"],
      color: "from-orange-400 to-amber-500",
    },
    {
      title: "Regional Intelligence",
      icon: Globe,
      description: "Explore biomass potential and air quality maps to drive systemic change in energy production.",
      features: ["Biomass Mapping", "Live AQI Data", "AI Site Analysis"],
      color: "from-blue-400 to-indigo-500",
    },
  ];

  return (
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-header mb-4">A Three-Layered Solution</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
            Biome bridges the gap between individual action and regional intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {layers.map((layer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${layer.color} flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <layer.icon size={32} />
              </div>
              
              <h3 className="text-2xl font-bold text-header mb-4">{layer.title}</h3>
              <p className="text-foreground/60 mb-8 leading-relaxed">
                {layer.description}
              </p>
              
              <ul className="space-y-3">
                {layer.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm font-semibold text-header/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-green"></div>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionLayers;
