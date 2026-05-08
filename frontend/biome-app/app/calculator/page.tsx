"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Car, 
  Utensils, 
  Zap, 
  ArrowRight, 
  ArrowLeft, 
  Leaf, 
  Loader2,
  CheckCircle2,
  TrendingDown,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useEcoStore } from "@/store/useStore";

const steps = [
  { id: "transport", title: "Transport", icon: Car, color: "#55D688", description: "How do you get around?" },
  { id: "diet", title: "Diet", icon: Utensils, color: "#F9A826", description: "What's on your plate?" },
  { id: "energy", title: "Energy", icon: Zap, color: "#55D688", description: "How is your home powered?" },
];

const COLORS = ["#55D688", "#F9A826", "#334155"];

export default function Calculator() {
  const { addAction } = useEcoStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [values, setValues] = useState({
    transport: 40,
    diet: 30,
    energy: 30,
  });

  const chartData = [
    { name: "Transport", value: values.transport },
    { name: "Diet", value: values.diet },
    { name: "Energy", value: values.energy },
  ];

  const handleCalculate = async () => {
    setIsCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsCalculating(false);
    setShowResult(true);
    
    addAction({
      title: "Carbon Audit Completed",
      points: 25,
      type: "education"
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCalculate();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const updateValue = (stepId: string, val: number) => {
    setValues({ ...values, [stepId]: val });
  };

  if (showResult) {
    return (
      <div className="max-w-4xl mx-auto py-12 animate-in zoom-in duration-500">
        <div className="bento-card text-center p-12">
          <div className="h-20 w-20 bg-green/10 rounded-full flex items-center justify-center text-green mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-4xl font-extrabold mb-4">Calculation Complete!</h2>
          <p className="text-foreground/60 text-lg mb-12">Your annual footprint is estimated at</p>
          
          <div className="flex flex-col items-center mb-12">
            <div className="text-7xl font-black text-header">
              {((values.transport * 0.4 + values.diet * 0.3 + values.energy * 0.3) / 10).toFixed(1)}
            </div>
            <div className="text-sm font-bold text-foreground/40 uppercase tracking-widest mt-2">Tonnes CO2 / Year</div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-left mb-12">
            <div className="p-6 rounded-3xl bg-green/5 border border-green/10">
              <div className="flex items-center gap-3 mb-4">
                <TrendingDown className="text-green" size={24} />
                <h3 className="font-bold text-header">Winning Area</h3>
              </div>
              <p className="text-sm text-foreground/70">Your transport habits are significantly lower than the regional average. Great job using sustainable transit!</p>
            </div>
            <div className="p-6 rounded-3xl bg-orange/5 border border-orange/10">
              <div className="flex items-center gap-3 mb-4">
                <Info className="text-orange" size={24} />
                <h3 className="font-bold text-header">Quick Win</h3>
              </div>
              <p className="text-sm text-foreground/70">Reducing red meat consumption by just 2 days a week could lower your diet footprint by 12%.</p>
            </div>
          </div>

          <button 
            onClick={() => { setShowResult(false); setCurrentStep(0); }}
            className="btn-primary w-full md:w-auto px-12"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-header mb-1">Carbon Calculator</h1>
          <p className="text-foreground/60 font-medium">Detailed audit of your daily environmental impact.</p>
        </div>
        <div className="flex gap-3">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 w-12 rounded-full transition-all duration-500",
                i <= currentStep ? "bg-green" : "bg-black/5"
              )}
            />
          ))}
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Step Form */}
        <div className="bento-card min-h-[500px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-black/5 flex items-center justify-center text-header">
                  {(() => {
                    const Icon = steps[currentStep].icon;
                    return <Icon size={32} />;
                  })()}
                </div>
                <div>
                  <h2 className="text-4xl font-extrabold text-header">{steps[currentStep].title}</h2>
                  <p className="text-foreground/60 font-medium">{steps[currentStep].description}</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-foreground/40 uppercase tracking-widest">Intensity Level</label>
                    <span className="text-2xl font-black text-green">{values[steps[currentStep].id as keyof typeof values]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={values[steps[currentStep].id as keyof typeof values]}
                    onChange={(e) => updateValue(steps[currentStep].id, parseInt(e.target.value))}
                    className="w-full h-3 bg-black/5 rounded-full appearance-none cursor-pointer accent-green"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-foreground/40 uppercase">
                    <span>Low Impact</span>
                    <span>Moderate</span>
                    <span>High Impact</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Eco Conscious", val: 20 },
                    { label: "Balanced", val: 50 },
                    { label: "Standard", val: 75 },
                    { label: "Heavy User", val: 100 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => updateValue(steps[currentStep].id, opt.val)}
                      className={cn(
                        "p-6 rounded-2xl border-2 transition-all text-left",
                        values[steps[currentStep].id as keyof typeof values] === opt.val 
                          ? "border-green bg-green/5" 
                          : "border-black/5 bg-white hover:border-black/10"
                      )}
                    >
                      <p className="text-header font-bold">{opt.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-4 pt-10 mt-auto">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-8 py-4 rounded-2xl font-bold flex items-center gap-2 border border-black/10 hover:bg-black/5 transition-all"
              >
                <ArrowLeft size={20} /> Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isCalculating}
              className="btn-primary grow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCalculating ? (
                <>Calculating... <Loader2 size={20} className="animate-spin" /></>
              ) : (
                <>{currentStep === steps.length - 1 ? "Finish Audit" : "Next Step"} <ArrowRight size={20} /></>
              )}
            </button>
          </div>
        </div>

        {/* Live Visualization */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-green/5 rounded-[3rem] -rotate-3 scale-105" />
          <div className="absolute inset-0 bg-orange/5 rounded-[3rem] rotate-2 scale-105" />
          
          <div className="bento-card w-full aspect-square relative z-10 flex flex-col items-center justify-center p-12">
            <h3 className="text-2xl font-bold text-header mb-8">Live Breakdown</h3>
            
            <div className="w-full h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Leaf className="text-green mb-2" size={32} />
                <span className="text-4xl font-black text-header">Live</span>
                <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Impact View</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-12 w-full">
              {steps.map((step, i) => (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div className="h-3 w-8 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">{step.title}</span>
                  <span className="text-sm font-bold text-header">{values[step.id as keyof typeof values]}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

