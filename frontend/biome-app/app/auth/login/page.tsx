"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      // Sync with backend on login
      try {
        await authApi.sync({ email });
      } catch (err) {
        console.error("Login sync failed:", err);
      }
      toast.success("Welcome back to Biome!");
      window.location.href = "/dashboard";
    }
  };

  const inputClasses = "w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-12 focus:bg-white focus:border-green/20 outline-none text-header transition-all font-bold placeholder:text-foreground/20";
  const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30";

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Subtle Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-green/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-green/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg bg-white rounded-[3rem] shadow-2xl shadow-black/5 p-8 md:p-16 border border-white"
      >
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center justify-center transition-transform hover:scale-110 mb-6">
            <Image 
              src="/biome.png" 
              alt="Biome Logo" 
              width={160} 
              height={160} 
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>
          <h1 className="text-4xl font-black text-header mb-3">Welcome Back</h1>
          <p className="text-foreground/60 font-medium max-w-sm mx-auto">Continue your journey toward a carbon-neutral lifestyle.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className={iconClasses} size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className={inputClasses}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-1">Password</label>
              <Link href="#" className="text-[10px] font-bold text-green hover:underline uppercase tracking-widest">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className={iconClasses} size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={inputClasses}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-green text-white rounded-2xl font-black shadow-xl shadow-green/20 flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-4"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight className="w-6 h-6" />}
          </button>
        </form>

        <p className="mt-12 text-center text-sm font-medium text-foreground/60">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-green font-bold hover:underline">Sign up for free</Link>
        </p>
      </motion.div>
    </div>
  );
}
