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
  Leaf,
  Settings,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEcoStore } from "@/store/useStore";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Calculator", href: "/calculator", icon: Calculator },
  { name: "Community", href: "/community", icon: Users },
  { name: "Map", href: "/map", icon: MapIcon },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useEcoStore();

  const handleSignOut = async () => {
    const { supabase } = await import("@/lib/supabase");
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <>
      {/* Sidebar for Desktop */}
      <aside className="fixed left-0 top-0 hidden h-full w-72 flex-col border-r border-black/5 bg-white px-6 py-10 md:flex z-40">
        <div className="mb-12 flex items-center gap-3 px-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green text-white shadow-lg shadow-green/20">
            <Leaf size={28} />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tighter text-header block">Biome</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-green/60 -mt-1 block">Vitality Mode</span>
          </div>
        </div>

        <nav className="flex flex-col gap-2 grow">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 group",
                  isActive 
                    ? "bg-green text-white shadow-xl shadow-green/20 font-bold" 
                    : "text-foreground/60 hover:bg-black/5 hover:text-header"
                )}
              >
                <item.icon size={22} className={cn("transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-foreground/40")} />
                <span className="text-[15px]">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute -right-6 h-10 w-1.5 rounded-l-full bg-green"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="rounded-3xl bg-slate-50 p-6 border border-black/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:rotate-12 transition-transform">
              <Leaf size={80} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Guardian Status</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-3xl font-black text-header leading-none">{user.streak}</span>
              <span className="text-sm font-bold text-foreground/60 mb-0.5">Day Streak</span>
            </div>
            <div className="mt-4 h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
              <div className="h-full bg-orange rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>

          <button 
            onClick={handleSignOut}
            className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-foreground/60 hover:bg-red-50 hover:text-red-500 transition-all duration-300 group"
          >
            <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-[15px] font-bold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-black/5 bg-white/90 px-2 py-4 backdrop-blur-xl md:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1.5 px-4 py-1 transition-all duration-300",
                isActive ? "text-green scale-110" : "text-foreground/40"
              )}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
