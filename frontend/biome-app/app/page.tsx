"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Leaf, 
  Globe, 
  Zap, 
  Shield, 
  TrendingDown, 
  Users, 
  BarChart3,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import Hero from "@/components/Hero";
import TextType from "@/components/TextType";

const features = [
  {
    title: "AI Carbon Tracker",
    description: "Our advanced AI automatically calculates your footprint based on daily habits and provides personalized reduction strategies.",
    icon: TrendingDown,
    image: "/carbon-feature.png",
    color: "bg-green/10 text-green"
  },
  {
    title: "Eco Community",
    description: "Join thousands of eco-conscious individuals. Share tips, join local challenges, and compete in the global leaderboard.",
    icon: Users,
    image: "/community-feature.png",
    color: "bg-orange/10 text-orange"
  }
];

const stats = [
  { label: "Active Users", value: "50k+" },
  { label: "Carbon Offset", value: "200k Tons" },
  { label: "Trees Planted", value: "1.2M" },
  { label: "Global Partners", value: "450+" }
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <Hero />

      {/* Stats Section */}
      <section className="py-20 bg-background relative z-10">
        <div className="w-full px-4 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black text-header mb-2">{stat.value}</div>
                <div className="text-foreground/60 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-slate-50/50">
        <div className="w-full px-4 md:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-header mb-6">Powerful Features for Impact</h2>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
              We provide the tools you need to make a real difference, from precision tracking to community action.
            </p>
          </div>

          <div className="space-y-32">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-16",
                  idx % 2 !== 0 && "md:flex-row-reverse"
                )}
              >
                <motion.div 
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="flex-1"
                >
                  <div className={cn("inline-flex p-3 rounded-2xl mb-6", feature.color)}>
                    <feature.icon size={32} />
                  </div>
                  <h3 className="text-3xl font-bold text-header mb-4">{feature.title}</h3>
                  <p className="text-lg text-foreground/60 mb-8 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-4 mb-10">
                    {[1, 2, 3].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-header font-medium">
                        <CheckCircle2 size={20} className="text-green" />
                        <span>Premium Benefit {item} for users</span>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href="/auth" 
                    className="inline-flex items-center gap-2 text-green font-bold hover:gap-3 transition-all"
                  >
                    Learn more <ArrowRight size={20} />
                  </Link>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="flex-1 relative aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-2xl"
                >
                  <Image 
                    src={feature.image} 
                    alt={feature.title} 
                    fill 
                    className="object-cover"
                  />
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 md:px-12">
        <div className="w-full">
          <div className="relative rounded-[3rem] bg-header overflow-hidden p-12 md:p-24 text-center text-white">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Leaf size={400} />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black mb-8">
                Ready to make <TextType 
                  as="span"
                  text={["an impact?", "a change?", "history?"]}
                  className="bg-gradient-to-r from-green to-emerald-400 bg-clip-text text-transparent inline-block"
                  cursorClassName="text-green"
                  typingSpeed={100}
                />
              </h2>
              <p className="text-xl text-white/70 mb-12">
                Join our community today and start your journey towards a carbon-neutral lifestyle. It's free to get started.
              </p>
              <Link 
                href="/auth" 
                className="inline-flex px-12 py-6 rounded-2xl bg-green text-white text-xl font-bold shadow-2xl shadow-green/20 hover:scale-105 transition-transform"
              >
                Create Your Biome Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-black/5 bg-slate-50/30">
        <div className="w-full px-4 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div className="max-w-xs">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green text-white shadow-lg shadow-green/20">
                  <Leaf size={24} />
                </div>
                <span className="text-2xl font-bold tracking-tight text-header">Biome</span>
              </Link>
              <p className="text-foreground/60 leading-relaxed">
                The leading platform for gamified sustainability and carbon tracking. Join the movement today.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div>
                <h4 className="font-bold text-header mb-6">Product</h4>
                <ul className="space-y-4 text-foreground/60">
                  <li><Link href="/dashboard" className="hover:text-green">Dashboard</Link></li>
                  <li><Link href="/calculator" className="hover:text-green">Calculator</Link></li>
                  <li><Link href="/map" className="hover:text-green">Eco Map</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-header mb-6">Company</h4>
                <ul className="space-y-4 text-foreground/60">
                  <li><Link href="#" className="hover:text-green">About Us</Link></li>
                  <li><Link href="#" className="hover:text-green">Careers</Link></li>
                  <li><Link href="#" className="hover:text-green">Press</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-header mb-6">Social</h4>
                <ul className="space-y-4 text-foreground/60">
                  <li><Link href="#" className="hover:text-green">Twitter</Link></li>
                  <li><Link href="#" className="hover:text-green">LinkedIn</Link></li>
                  <li><Link href="#" className="hover:text-green">Instagram</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-black/5">
            <p className="text-foreground/40 text-sm">© 2026 Biome Platform. All rights reserved.</p>
            <div className="flex gap-8 text-foreground/40 text-sm">
              <Link href="#" className="hover:text-header">Privacy Policy</Link>
              <Link href="#" className="hover:text-header">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
