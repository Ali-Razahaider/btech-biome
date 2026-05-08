"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Wind, MapPin, Target, Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEcoStore } from "@/store/useStore";
import Link from "next/link";

const steps = [
  { id: 1, title: "Your Location", subtitle: "Where are you planting roots?", icon: MapPin },
  { id: 2, title: "Eco Goals", subtitle: "What are your sustainability priorities?", icon: Target },
  { id: 3, title: "All Set!", subtitle: "Ready to start your green journey?", icon: Sparkles },
];

const goals = [
  "Reduce Carbon Footprint",
  "Zero Waste Lifestyle",
  "Sustainable Diet",
  "Eco-Friendly Travel",
  "Energy Efficiency",
  "Plastic Free Living",
];

export default function AuthPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const { user: storeUser, updateProfile } = useEcoStore();
  
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    city: storeUser.city || "",
    name: storeUser.name || "",
    habits: storeUser.habits || [],
  });

  const toggleGoal = (goal: string) => {
    const newHabits = formData.habits.includes(goal)
      ? formData.habits.filter(g => g !== goal)
      : [...formData.habits, goal];
    
    setFormData({ ...formData, habits: newHabits });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        setCurrentStep(1); // Move to onboarding after signup
      }
    }
    setLoading(false);
  };

  const handleFinish = async () => {
    updateProfile({
      city: formData.city,
      name: formData.name,
      habits: formData.habits,
    });
    // Here you could also save this to Supabase profile table
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden selection:bg-green/30 selection:text-green">
      {/* Visual Side */}
      <div className="relative w-full md:w-1/2 bg-green/5 overflow-hidden flex items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 20 + i * 5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute opacity-10"
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 20}%`,
              }}
            >
              <Wind className="w-64 h-64 text-green" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="relative mb-8">
            <div className="absolute -inset-8 bg-green/20 blur-[80px] rounded-full animate-pulse" />
            <div className="relative bento-card p-12 rounded-[3.5rem] border-4 border-green bg-white shadow-2xl">
              <Leaf className="w-24 h-24 text-green drop-shadow-[0_0_15px_rgba(85,214,136,0.3)]" />
            </div>
          </div>
          <h2 className="text-5xl font-black text-header text-center mb-4 tracking-tighter">Biome</h2>
          <p className="text-foreground/60 text-center max-w-sm font-medium italic">
            Join the movement of guardians turning daily actions into planetary vitality.
          </p>
        </motion.div>
      </div>

      {/* Form Side */}
      <div className="w-full md:w-1/2 p-8 md:p-24 flex flex-col justify-center relative z-10 bg-background">
        <div className="max-w-md mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-green/10 p-3 rounded-2xl text-green">
                    {(() => {
                      if (currentStep === 0) return <Sparkles className="w-6 h-6" />;
                      const Icon = steps[currentStep - 1].icon;
                      return <Icon className="w-6 h-6" />;
                    })()}
                  </div>
                  <div className="h-1.5 grow bg-black/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                      className="h-full bg-green"
                    />
                  </div>
                </div>
                <h1 className="text-4xl font-extrabold text-header mb-2">
                  {currentStep === 0 ? (isLogin ? "Welcome Back" : "Join the Biome") : steps[currentStep - 1].title}
                </h1>
                <p className="text-foreground/60 font-medium">
                  {currentStep === 0 ? (isLogin ? "Sign in to continue your journey" : "Create an account to start your impact") : steps[currentStep - 1].subtitle}
                </p>
              </div>

              {currentStep === 0 && (
                <form onSubmit={handleAuth} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      required
                      className="w-full bg-black/5 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-green/20 outline-none text-header transition-all text-lg font-bold shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-1">Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-black/5 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-green/20 outline-none text-header transition-all text-lg font-bold shadow-sm"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm font-medium ml-1">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-4 rounded-2xl font-black shadow-lg shadow-green/20 flex items-center justify-center gap-2"
                  >
                    {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                  </button>
                  <div className="text-center">
                    <button 
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-sm font-bold text-green hover:underline"
                    >
                      {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                  </div>
                </form>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-1">City / Region</label>
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full bg-black/5 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-green/20 outline-none text-header transition-all text-lg font-bold shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-1">Display Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your eco-alias"
                      className="w-full bg-black/5 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-green/20 outline-none text-header transition-all text-lg font-bold shadow-sm"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-2 gap-3">
                  {goals.map(goal => (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={cn(
                        "p-4 rounded-2xl text-[10px] font-black transition-all text-left border-2 uppercase tracking-wider",
                        formData.habits.includes(goal)
                          ? "bg-green border-green text-white shadow-lg shadow-green/20"
                          : "bg-white border-black/5 text-foreground/60 hover:border-black/10"
                      )}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center space-y-8 py-8">
                  <div className="relative inline-block">
                    <div className="absolute -inset-6 bg-green/10 blur-3xl rounded-full" />
                    <CheckCircle2 className="w-24 h-24 text-green relative z-10 mx-auto" />
                  </div>
                  <p className="text-foreground/60 leading-relaxed font-medium italic">
                    &quot;You&apos;re ready to join the biome. Let&apos;s start making an impact, one choice at a time.&quot;
                  </p>
                </div>
              )}

              {currentStep > 0 && (
                <div className="mt-12 flex gap-4">
                  {currentStep > 1 && (
                    <button
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="p-4 rounded-2xl border border-black/10 text-header hover:bg-black/5 transition-all flex items-center justify-center"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                  )}
                  
                  {currentStep < 3 ? (
                    <button
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="grow btn-primary flex items-center justify-center gap-2 shadow-lg shadow-green/20"
                    >
                      Continue <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <Link href="/dashboard" className="grow" onClick={handleFinish}>
                      <button className="w-full btn-primary flex items-center justify-center gap-2 shadow-lg shadow-green/20">
                        Enter the Biome <ArrowRight className="w-5 h-5" />
                      </button>
                    </Link>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
