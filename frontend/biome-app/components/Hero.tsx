"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import TextType from "./TextType";

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center pt-32 pb-20 bg-white">
      <div className="relative z-10 w-full text-center px-4 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green/10 border border-green/20 text-green text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-green animate-pulse"></span>
            Building Pakistan's First Biomass Intelligence Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-header mb-6 leading-tight tracking-tight">
            Healing our <span className="text-green">Biome</span> through <br />
            <TextType 
              as="span"
              text={["Action", "Intelligence", "Community"]}
              className="bg-linear-to-r from-green to-emerald-600 bg-clip-text text-transparent inline-block"
              cursorClassName="text-green"
              typingSpeed={80}
            />
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/70 mb-10 max-w-3xl mx-auto leading-relaxed">
            The all-in-one platform for personal footprint tracking, community eco-challenges, and regional biomass intelligence tailored for Pakistan.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link 
              href="/auth/signup" 
              className="group relative px-10 py-5 rounded-2xl bg-green text-white text-lg font-bold shadow-2xl shadow-green/20 hover:scale-105 transition-transform duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started for Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <button className="px-10 py-5 rounded-2xl bg-slate-50 border border-slate-200 text-header text-lg font-bold hover:bg-slate-100 transition-all shadow-sm">
              Watch Demo
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
