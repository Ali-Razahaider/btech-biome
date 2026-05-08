"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calculator, Map, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "AI Carbon Calculator",
    description: "Measure your environmental footprint with precision using our advanced algorithms. Get real-time feedback on your daily choices and learn how to optimize your lifestyle for a cleaner planet.",
    icon: Calculator,
    color: "bg-green/10 text-green",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426",
  },
  {
    title: "Regional Intelligence Map",
    description: "Explore live air quality data and biomass potential zones across the region. Our interactive mapping system provides local insights to help you understand environmental impacts in your area.",
    icon: Map,
    color: "bg-blue-50 text-blue-600",
    image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2066",
  },
  {
    title: "Community Challenges",
    description: "Join collective missions to reduce plastic, save energy, and plant trees. Connect with thousands of like-minded individuals and see the cumulative impact of our community actions.",
    icon: Users,
    color: "bg-orange/10 text-orange",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=2264",
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
