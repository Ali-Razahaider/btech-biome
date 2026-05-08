"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calculator, 
  Users, 
  Map as MapIcon, 
  User,
  Leaf
} from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useEcoStore } from "@/store/useStore";


function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Calculator", href: "/calculator", icon: Calculator },
  { name: "Community", href: "/community", icon: Users },
  { name: "Map", href: "/map", icon: MapIcon },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Navigation() {
  const pathname = usePathname();
  const { user } = useEcoStore();


  return (
    <>
      {/* Sidebar for Desktop */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r border-black/5 bg-card px-4 py-8 md:flex">
        <div className="mb-10 flex items-center gap-2 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green text-white">
            <Leaf size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-header">Biome</span>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
                  isActive 
                    ? "bg-green/10 text-green font-semibold" 
                    : "text-foreground/70 hover:bg-black/5 hover:text-header"
                )}
              >
                <item.icon size={20} className={isActive ? "text-green" : ""} />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 h-6 w-1 rounded-r-full bg-green"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl bg-orange/10 p-4 border border-orange/20">
          <p className="text-[10px] font-bold uppercase tracking-wider text-orange">Current Streak</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-2xl font-black text-header">{user.streak} Days</span>
            <span className="text-xl animate-bounce">🔥</span>
          </div>
        </div>

      </aside>

      {/* Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-black/5 bg-white/80 px-2 py-3 backdrop-blur-lg md:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 transition-colors",
                isActive ? "text-green" : "text-foreground/60"
              )}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
