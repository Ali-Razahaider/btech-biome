"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, TrendingDown, Users, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

const Features = () => {
  return (
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
  );
};

export default Features;
