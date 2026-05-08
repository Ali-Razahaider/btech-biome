"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Leaf, ArrowRight, Zap, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange/5 rounded-full blur-[120px]" />
      </div>

      <section className="relative z-10 pt-12 md:pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green/10 border border-green/20 text-green text-sm font-bold mb-8">
              <Sparkles size={16} className="fill-green" />
              <span>VITALITY MODE ACTIVE</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 text-header">
              Your Journey to <br />
              <span className="text-green">Sustainability</span> Starts Here.
            </h1>
            
            <p className="text-lg text-foreground/80 mb-10 max-w-xl leading-relaxed">
              Biome gamifies eco-conscious living. Track your footprint, join local challenges, and earn rewards for every green choice you make.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <button className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg shadow-green/20 cursor-pointer">
                  Open Dashboard <ArrowRight size={20} />
                </button>
              </Link>
              <Link href="/calculator">
                <button className="btn-orange w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg shadow-orange/20 cursor-pointer">
                  Try Calculator <Zap size={20} />
                </button>
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-card flex items-center justify-center text-xs font-bold text-foreground/40 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-foreground/60">
                Join <span className="text-header font-bold">2,400+</span> others making an impact.
              </p>
            </div>
          </motion.div>

          {/* Day 1 Checklist Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", damping: 20 }}
            className="relative"
          >
            <div className="bento-card border-4 border-green relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <div className="bg-orange text-white px-4 py-2 rounded-2xl font-bold text-sm shadow-md animate-bounce">
                  5pts
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-3xl font-bold mb-2">Day 1 Checklist</h3>
                <p className="text-foreground/60 font-medium">Quick wins to start your day</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Landing Page", completed: true },
                  { label: "Check Eco-Score", completed: false },
                  { label: "Log One Action", completed: false },
                  { label: "Join a Challenge", completed: false },
                ].map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className={cn(
                      "flex items-center justify-between p-5 rounded-2xl border transition-all duration-300",
                      item.completed 
                        ? "bg-green/5 border-green/20" 
                        : "bg-white border-black/5 hover:border-orange/30"
                    )}
                  >
                    <span className={cn(
                      "font-semibold text-lg",
                      item.completed ? "text-green" : "text-header"
                    )}>
                      {item.label}
                    </span>
                    <div className={cn(
                      "w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-500",
                      item.completed ? "bg-green border-green" : "border-black/10"
                    )}>
                      {item.completed && <CheckCircle2 className="w-5 h-5 text-white" />}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 p-6 rounded-3xl bg-orange/5 border border-orange/10 flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-orange/20 flex items-center justify-center text-orange">
                  <Trophy size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold text-orange uppercase tracking-wider">Next Milestone</p>
                  <p className="text-xl font-bold text-header">Level 2 Eco-Warrior</p>
                </div>
              </div>
            </div>

            {/* Floating Element */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 bg-white p-6 rounded-[2rem] shadow-2xl border border-black/5 flex items-center gap-4 z-20"
            >
              <div className="h-12 w-12 rounded-full bg-green/20 flex items-center justify-center text-green">
                <Leaf size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground/40 uppercase">Total CO2 Saved</p>
                <p className="text-xl font-bold text-green">14.2 kg</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-20">
        <h2 className="text-4xl font-extrabold mb-12 text-center">Core Features</h2>
        <div className="bento-grid">
          <div className="bento-card flex flex-col gap-4">
            <div className="h-12 w-12 rounded-2xl bg-green/10 flex items-center justify-center text-green">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold">Eco-Score</h3>
            <p className="text-foreground/70">A real-time metric of your environmental impact based on your daily choices.</p>
          </div>
          <div className="bento-card flex flex-col gap-4">
            <div className="h-12 w-12 rounded-2xl bg-orange/10 flex items-center justify-center text-orange">
              <Trophy size={24} />
            </div>
            <h3 className="text-xl font-bold">Tiered Rewards</h3>
            <p className="text-foreground/70">Progress through Bronze to Platinum and unlock exclusive sustainability perks.</p>
          </div>
          <div className="bento-card flex flex-col gap-4">
            <div className="h-12 w-12 rounded-2xl bg-green/10 flex items-center justify-center text-green">
              <Leaf size={24} />
            </div>
            <h3 className="text-xl font-bold">Carbon Calculator</h3>
            <p className="text-foreground/70">Detailed breakdown of your footprint across transport, diet, and energy.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

