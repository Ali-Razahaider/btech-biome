"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Users, Globe, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

const SolutionLayers = () => {
  const layers = [
    {
      title: "Personal Layer",
      subtitle: "Track & Improve",
      description: "Calculate your footprint, get AI action plans, and build habits with gamified streaks.",
      icon: User,
      color: "emerald-500",
      points: ["AI Carbon Calculator", "Daily Action Log", "Streak Tracking"]
    },
    {
      title: "Community Layer",
      subtitle: "Compete & Connect",
      description: "Join challenges, climb local leaderboards, and drive collective sustainability impact.",
      icon: Users,
      color: "orange-500",
      points: ["Active Challenges", "Global Leaderboards", "Social Accountability"]
    },
    {
      title: "Regional Intelligence",
      subtitle: "Analyze & Act",
      description: "Discover clean energy potential with live AQI tracking and AI biomass feasibility mapping.",
      icon: Globe,
      color: "blue-500",
      points: ["Biomass Potential Map", "AQI Heatmaps", "AI Feasibility Reports"]
    }
  ];

  return (
    <section className="py-24 ">
      <div className="container mx-auto px-4 md:px-12">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-header mb-6">Our <span className="text-emerald-400">3-Layer</span> Solution</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
            Biome combines personal accountability with regional intelligence to solve Pakistan's environmental challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {layers.map((layer, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group p-8 rounded-[2.5rem] bg-white border border-black/5 shadow-sm hover:shadow-xl transition-all"
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `rgba(${layer.color === 'emerald-500' ? '16, 185, 129' : layer.color === 'orange-500' ? '249, 115, 22' : '59, 130, 246'}, 0.1)`, color: `rgb(${layer.color === 'emerald-500' ? '16, 185, 129' : layer.color === 'orange-500' ? '249, 115, 22' : '59, 130, 246'})` }}
              >
                <layer.icon size={28} />
              </div>
              <div className="mb-8">
                <span 
                  className="text-sm font-bold uppercase tracking-widest mb-2 block"
                  style={{ color: `rgb(${layer.color === 'emerald-500' ? '16, 185, 129' : layer.color === 'orange-500' ? '249, 115, 22' : '59, 130, 246'})` }}
                >
                  {layer.subtitle}
                </span>
                <h3 className="text-2xl font-bold text-header">{layer.title}</h3>
              </div>
              <p className="text-foreground/60 mb-8 leading-relaxed">
                {layer.description}
              </p>
              <ul className="space-y-3">
                {layer.points.map((point, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-header">
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `rgba(${layer.color === 'emerald-500' ? '16, 185, 129' : layer.color === 'orange-500' ? '249, 115, 22' : '59, 130, 246'}, 0.1)` }}
                    >
                      <Check size={12} style={{ color: `rgb(${layer.color === 'emerald-500' ? '16, 185, 129' : layer.color === 'orange-500' ? '249, 115, 22' : '59, 130, 246'})` }} />
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/explore"
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-header text-white rounded-full font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Explore More</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SolutionLayers;

