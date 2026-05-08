"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Menu,
  X,
  ChevronRight,
  LayoutDashboard,
  Calculator,
  Users,
  Map as MapIcon,
  User,
} from "lucide-react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Calculator", href: "/calculator", icon: Calculator },
  { name: "Community", href: "/community", icon: Users },
  { name: "Map", href: "/map", icon: MapIcon },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);

    // Check auth status
    const checkAuth = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuth();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLandingPage = pathname === "/";
  const authenticatedNavItems = user
    ? navItems
    : [
        { name: "Features", href: "#features" },
        { name: "Impact", href: "#impact" },
      ];

  // Super smooth easing curve for the Vercel/Apple feel
  const easeSmooth = cubicBezier(0.16, 1, 0.3, 1);

  return (
    <>
      {/* Desktop Navbar */}
      <motion.div
        id="desktop-wrapper"
        initial={false}
        animate={{
          paddingTop: isScrolled ? "1rem" : "1.5rem",
        }}
        transition={{ duration: 0.5, ease: easeSmooth }}
        className="fixed  top-0 left-0 w-full hidden lg:flex justify-center z-[1000]"
      >
        <motion.div
          className={cn(
            "relative flex items-center overflow-hidden transition-colors duration-500",
            isScrolled
              ? "bg-white/80 backdrop-blur-xl rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-black/5"
              : "bg-transparent border-transparent px-12",
          )}
          initial={false}
          animate={{
            width: isScrolled ? "748px" : "100%",
            height: isScrolled ? "56px" : "64px",
          }}
          transition={{ duration: 0.6, ease: easeSmooth }}
        >
          {/* Nav Links - Glides to Center */}
          <motion.nav
            className="absolute flex items-center gap-8 whitespace-nowrap"
            initial={false}
            animate={{
              left: isScrolled ? "50%" : "3rem",
              x: isScrolled ? "-50%" : "0%",
              scale: isScrolled ? 0.95 : 1,
            }}
            transition={{ duration: 0.6, ease: easeSmooth }}
          >
            {authenticatedNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  isScrolled
                    ? "text-foreground/60 hover:text-foreground"
                    : "text-foreground/80 hover:text-green",
                )}
              >
                {item.name}
              </Link>
            ))}
          </motion.nav>

          {/* Logo - Glides to Left */}
          <motion.div
            className="absolute flex items-center gap-2 cursor-pointer"
            initial={false}
            animate={{
              left: isScrolled ? "1.25rem" : "50%",
              x: isScrolled ? "0%" : "-50%",
              scale: isScrolled ? 0.9 : 1,
            }}
            transition={{ duration: 0.6, ease: easeSmooth }}
          >
            <Link href="/" className="flex items-center gap-2 group">
              <div
                className={cn(
                  "flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                )}
              >
                <Image 
                  src="/biome.png" 
                  alt="Biome Logo" 
                  width={168} 
                  height={168} 
                  className="h-15 w-15  object-contain"
                  priority
                />
              </div>
            </Link>
          </motion.div>

          {/* Auth Actions - Glides on Right */}
          <motion.div
            className="absolute flex items-center gap-6"
            initial={false}
            animate={{
              right: isScrolled ? "0.4rem" : "3rem",
            }}
            transition={{ duration: 0.6, ease: easeSmooth }}
          >
            <AnimatePresence mode="wait">
              {!isScrolled && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href="/auth"
                    className={cn(
                      "text-sm font-medium transition-colors duration-200 text-foreground/60 hover:text-foreground",
                    )}
                  >
                    Login
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            <Link
              href={user ? "/dashboard" : "/auth"}
              className={cn(
                "relative h-11 min-w-[115px] flex items-center justify-center rounded-full font-semibold transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden bg-green text-white shadow-lg shadow-green/20",
                isScrolled && "h-10 min-w-[135px]",
              )}
            >
              <motion.span
                className="absolute"
                animate={{
                  y: isScrolled ? -30 : 0,
                  opacity: isScrolled ? 0 : 1,
                }}
                transition={{ duration: 0.6, ease: easeSmooth }}
              >
                {user ? "Dashboard" : "Sign Up"}
              </motion.span>
              <motion.span
                className="absolute"
                initial={{ y: 30, opacity: 0 }}
                animate={{
                  y: isScrolled ? 0 : 30,
                  opacity: isScrolled ? 1 : 0,
                }}
                transition={{ duration: 0.6, ease: easeSmooth }}
              >
                {user ? "Dashboard" : "Get Started"}
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Mobile Navbar */}
      <motion.nav
        id="nav-mobile"
        initial={false}
        animate={{
          backgroundColor: isScrolled
            ? "rgba(255, 255, 255, 0.85)"
            : isLandingPage
              ? "rgba(255, 255, 255, 0)"
              : "rgba(255, 255, 255, 1)",
          paddingTop: isScrolled ? "0.75rem" : "1rem",
          paddingBottom: isScrolled ? "0.75rem" : "1rem",
          boxShadow: isScrolled ? "0 2px 10px rgba(0, 0, 0, 0.05)" : "none",
        }}
        className="fixed top-0 left-0 w-full lg:hidden flex items-center justify-between px-6 z-[1000] backdrop-blur-xl"
      >
        <Link href="/" className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center justify-center transition-all duration-300",
            )}
          >
            <Image 
              src="/biome.png" 
              alt="Biome Logo" 
              width={144} 
              height={144} 
              className="h-10 w-auto object-contain"
            />
          </div>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={cn(
            "p-2 rounded-xl transition-colors duration-300",
            isScrolled ? "bg-black/5 text-header" : "bg-black/5 text-header",
          )}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-full left-4 right-4 mt-2 bg-white rounded-[24px] p-6 shadow-2xl border border-black/5 overflow-hidden"
            >
              <div className="flex flex-col gap-1">
                {authenticatedNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-black/2 hover:bg-black/5 transition-all"
                  >
                    <span className="font-semibold text-foreground/80">
                      {item.name}
                    </span>
                    <ChevronRight size={18} className="text-foreground/30" />
                  </Link>
                ))}
                <Link
                  href={user ? "/dashboard" : "/auth"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-4 w-full py-4 rounded-2xl bg-green text-white text-center font-bold shadow-lg shadow-green/20"
                >
                  {user ? "Go to Dashboard" : "Get Started"}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
