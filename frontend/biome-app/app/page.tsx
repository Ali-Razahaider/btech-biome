"use client";

import React from "react";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/home/ProblemSection";
import SolutionLayers from "@/components/home/SolutionLayers";
import BentoFeatures from "@/components/home/BentoFeatures";
import Stats from "@/components/home/Stats";
import CTA from "@/components/home/CTA";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <Hero />
      <Stats />
      <ProblemSection />
      <SolutionLayers />
      <BentoFeatures />
      <CTA />
      <Footer />
    </div>
  );
}
