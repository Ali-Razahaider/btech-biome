"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, ArrowRight, User, Mail, Lock, MapPin, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    city: "",
    country: "Pakistan",
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    // 1. Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      toast.error(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // 2. Insert into profiles table
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        gender: formData.gender,
        city: formData.city,
        country: formData.country,
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        toast.error("Profile created but some data couldn't be saved.");
      } else {
        // 3. Sync with FastAPI Backend
        try {
          await authApi.sync({
            email: formData.email,
            city: formData.city,
            habits: [], // Default habits or add to form
          });
          toast.success("Account created and synced with Biome!");
        } catch (syncError) {
          console.error("Backend sync error:", syncError);
          toast.success("Account created, but backend sync failed.");
        }
      }
      
      router.push("/dashboard");
    }
  };

  const inputClasses = "w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-12 focus:bg-white focus:border-green/20 outline-none text-header transition-all font-bold placeholder:text-foreground/20";
  const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30";

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-green/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl shadow-black/5 p-8 md:p-16 border border-white"
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
          <h1 className="text-4xl font-black text-header mb-3">Join the Biome</h1>
          <p className="text-foreground/60 font-medium max-w-sm mx-auto">Create your account and start your journey towards planetary vitality.</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <User className={iconClasses} size={20} />
              <input 
                type="text" 
                placeholder="First Name"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className={inputClasses}
              />
            </div>
            <div className="relative">
              <User className={iconClasses} size={20} />
              <input 
                type="text" 
                placeholder="Last Name"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="relative">
            <Mail className={iconClasses} size={20} />
            <input 
              type="email" 
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Lock className={iconClasses} size={20} />
              <input 
                type="password" 
                placeholder="Password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={inputClasses}
              />
            </div>
            <div className="relative">
              <Lock className={iconClasses} size={20} />
              <input 
                type="password" 
                placeholder="Confirm Password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <User className={iconClasses} size={20} />
              <select
                required
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className={cn(inputClasses, "appearance-none")}
              >
                <option value="" disabled>Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="private">Prefer not to say</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none" size={16} />
            </div>
            <div className="relative">
              <MapPin className={iconClasses} size={20} />
              <input 
                type="text" 
                placeholder="City"
                required
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className={inputClasses}
              />
            </div>
            <div className="relative">
              <Globe className={iconClasses} size={20} />
              <input 
                type="text" 
                placeholder="Country"
                required
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className={inputClasses}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-green text-white rounded-2xl font-black shadow-xl shadow-green/20 flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-4"
          >
            {loading ? "Creating Account..." : "Create Biome Account"}
            {!loading && <ArrowRight className="w-6 h-6" />}
          </button>
        </form>

        <p className="mt-12 text-center text-sm font-medium text-foreground/60">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-green font-bold hover:underline">Sign in instead</Link>
        </p>
      </motion.div>
    </div>
  );
}
