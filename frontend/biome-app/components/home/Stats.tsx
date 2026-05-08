"use client";

import React from "react";
import { motion } from "framer-motion";

const stats = [
  { label: "Active Users", value: "50k+" },
  { label: "Carbon Offset", value: "200k Tons" },
  { label: "Trees Planted", value: "1.2M" },
  { label: "Global Partners", value: "450+" }
];

const Stats = () => {
  return (
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
  );
};

export default Stats;
