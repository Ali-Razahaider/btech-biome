"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="py-20 border-t border-black/5 bg-slate-50/30">
      <div className="w-full px-4 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="flex items-center justify-center transition-all duration-300">
                <Image 
                  src="/biome.png" 
                  alt="Biome Logo" 
                  width={180} 
                  height={53} 
                  className="h-12 w-auto object-contain"
                />
              </div>
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
  );
};

export default Footer;
