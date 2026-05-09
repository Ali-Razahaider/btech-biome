"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="relative text-white! py-20 overflow-hidden bg-[#050D0A] bg-gradient-to-b from-[#050D0A] to-[#010503]">
      {/* Accent Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-green/50 to-transparent" />
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-green/10 blur-[120px] rounded-full" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-orange/5 blur-[120px] rounded-full" />

      <div className="relative z-10 w-full px-4 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="flex items-center justify-center transition-all duration-300 brightness-0 invert">
                <Image 
                  src="/biome.png" 
                  alt="Biome Logo" 
                  width={180} 
                  height={53} 
                  className="h-25 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-white/80 leading-relaxed">
              The leading platform for gamified sustainability and carbon tracking. Join the movement today and make a real impact.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h4 className="font-bold text-lg text-white! mb-6">Product</h4>
              <ul className="space-y-4 text-white/80">
                <li><Link href="/dashboard" className="hover:text-green transition-colors">Dashboard</Link></li>
                <li><Link href="/calculator" className="hover:text-green transition-colors">Calculator</Link></li>
                <li><Link href="/map" className="hover:text-green transition-colors">Eco Map</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg text-white! mb-6">Company</h4>
              <ul className="space-y-4 text-white/80">
                <li><Link href="#" className="hover:text-green transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-green transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-green transition-colors">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg text-white! mb-6">Social</h4>
              <ul className="space-y-4 text-white/80">
                <li><Link href="#" className="hover:text-green transition-colors">Twitter</Link></li>
                <li><Link href="#" className="hover:text-green transition-colors">LinkedIn</Link></li>
                <li><Link href="#" className="hover:text-green transition-colors">Instagram</Link></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-bold text-lg text-white mb-6">Stay Updated</h4>
              <p className="text-white/80 text-sm mb-4">Get the latest eco-insights and updates delivered to your inbox.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter email" 
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-green/50 transition-colors"
                />
                <button className="bg-green text-[#050D0A] font-bold px-4 py-2 rounded-lg text-sm hover:scale-105 transition-transform">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/10">
          <p className="text-white/80 text-sm">© 2026 Biome Platform. All rights reserved.</p>
          <div className="flex gap-8 text-white/80 text-sm">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
