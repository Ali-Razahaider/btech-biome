"use client";

import React from "react";
import Hero from "@/components/Hero";
import Stats from "@/components/home/Stats";
import ProblemSection from "@/components/home/ProblemSection";
import SolutionLayers from "@/components/home/SolutionLayers";
import BentoFeatures from "@/components/home/BentoFeatures";
import CTA from "@/components/home/CTA";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <section id="hero">
        <Hero />
      </section>
      <section id="impact">
        <Stats />
      </section>
      <section id="challenge">
        <ProblemSection />
      </section>
      <section id="solutions">
        <SolutionLayers />
      </section>
      <section id="features">
        <BentoFeatures />
      </section>
      <CTA />
      <Footer />
    </div>
  );
}
