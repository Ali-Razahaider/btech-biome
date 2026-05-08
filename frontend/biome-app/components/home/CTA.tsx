"use client";

import React from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";
import TextType from "@/components/TextType";

const CTA = () => {
  return (
    <section className="py-32 px-4 md:px-12">
      <div className="w-full">
        <div className="relative rounded-[3rem] bg-header overflow-hidden p-12 md:p-24 text-center text-white">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Leaf size={400} />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl text-white! font-black mb-8">
              Ready to make <TextType 
                as="span"
                text={["an impact?", "a change?", "history?"]}
                className="bg-linear-to-r from-green to-emerald-400 bg-clip-text text-transparent inline-block"
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
  );
};

export default CTA;
