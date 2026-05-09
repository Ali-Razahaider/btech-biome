"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Users, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";

const SolutionLayers = () => {
  const layers = [
    {
      title: "Personal Layer",
      subtitle: "Track & Improve",
      description: "Calculate your footprint, get AI action plans, and build habits with gamified streaks.",
      icon: User,
      color: "green",
      points: ["AI Carbon Calculator", "Daily Action Log", "Streak Tracking"]
    },
    {
      title: "Community Layer",
      subtitle: "Compete & Connect",
      description: "Join challenges, climb local leaderboards, and drive collective sustainability impact.",
      icon: Users,
      color: "orange",
      points: ["Active Challenges", "Global Leaderboards", "Social Accountability"]
    },
    {
      title: "Regional Intelligence",
      subtitle: "Analyze & Act",
      description: "Discover clean energy potential with live AQI tracking and AI biomass feasibility mapping.",
      icon: Globe,
      color: "blue",
      points: ["Biomass Potential Map", "AQI Heatmaps", "AI Feasibility Reports"]
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-12">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-header mb-6">Our 3-Layer Solution</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
            Biome combines personal accountability with regional intelligence to solve Pakistan's environmental challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {layers.map((layer, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group p-8 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-xl transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl bg-${layer.color}/10 text-${layer.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <layer.icon size={28} />
              </div>
              <div className="mb-8">
                <span className={`text-sm font-bold uppercase tracking-widest text-${layer.color} mb-2 block`}>
                  {layer.subtitle}
                </span>
                <h3 className="text-2xl font-bold text-header">{layer.title}</h3>
              </div>
              <p className="text-foreground/60 mb-8 leading-relaxed">
                {layer.description}
              </p>
              <ul className="space-y-3 mb-10">
                {layer.points.map((point, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-header">
                    <div className={`w-1.5 h-1.5 rounded-full bg-${layer.color}`} />
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 font-bold text-header hover:gap-3 transition-all"
              >
                Explore Layer <ArrowRight size={18} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionLayers;
