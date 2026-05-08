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
  Info,
  Plane
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useEcoStore } from "@/store/useStore";

const steps = [
  { id: "transport", title: "Transport", icon: Car, color: "#55D688", description: "Your weekly commute and travel." },
  { id: "flights", title: "Flights", icon: Plane, color: "#3B82F6", description: "Annual air travel." },
  { id: "diet", title: "Diet", icon: Utensils, color: "#F9A826", description: "Your eating habits." },
  { id: "energy", title: "Energy", icon: Zap, color: "#55D688", description: "Monthly home energy use." },
];

const COLORS = ["#55D688", "#3B82F6", "#F9A826", "#10B981"];

export default function Calculator() {
  const { addAction, updateProfile } = useEcoStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const [values, setValues] = useState({
    transport: 50, // KM per week
    flights: 2,    // Hours per year
    diet: 3,       // Meat meals per week
    energy: 150,   // kWh per month
  });

  const calculateTotal = () => {
    // Basic conversion factors (Kg CO2e)
    const transportCO2 = values.transport * 52 * 0.17; // 170g per km
    const flightsCO2 = values.flights * 250;           // 250kg per hour
    const dietCO2 = values.diet * 52 * 3.3;            // 3.3kg per meat meal
    const energyCO2 = values.energy * 12 * 0.45;       // 0.45kg per kWh
    
    return {
      total: (transportCO2 + flightsCO2 + dietCO2 + energyCO2) / 1000, // Tonnes
      breakdown: [
        { name: "Transport", value: transportCO2 },
        { name: "Flights", value: flightsCO2 },
        { name: "Diet", value: dietCO2 },
        { name: "Energy", value: energyCO2 },
      ]
    };
  };

  const results = calculateTotal();

  const handleCalculate = async () => {
    setIsCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCalculating(false);
    setShowResult(true);
    
    updateProfile({ carbonScore: Math.max(0, 100 - Math.round(results.total * 5)) });
    
    addAction({
      title: "Full Carbon Audit",
      points: 50,
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
              {results.total.toFixed(1)}
            </div>
            <div className="text-sm font-bold text-foreground/40 uppercase tracking-widest mt-2">Tonnes CO2 / Year</div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-left mb-12">
            <div className="p-6 rounded-3xl bg-green/5 border border-green/10">
              <div className="flex items-center gap-3 mb-4">
                <TrendingDown className="text-green" size={24} />
                <h3 className="font-bold text-header">Insight</h3>
              </div>
              <p className="text-sm text-foreground/70">
                {results.breakdown[0].value > results.breakdown[2].value 
                  ? "Your transport emissions are your primary impact. Consider carpooling or switching to transit." 
                  : "Your dietary choices have a high impact. Skipping meat 2 more days could save 0.5 tonnes per year."}
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-orange/5 border border-orange/10">
              <div className="flex items-center gap-3 mb-4">
                <Info className="text-orange" size={24} />
                <h3 className="font-bold text-header">Regional Context</h3>
              </div>
              <p className="text-sm text-foreground/70">In Pakistan, reducing home energy use and switching to biogas can significantly lower regional smog levels.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={() => { setShowResult(false); setCurrentStep(0); }}
              className="px-8 py-4 rounded-2xl font-bold border border-black/10 hover:bg-black/5"
            >
              Start Over
            </button>
            <button 
              onClick={() => window.location.href = "/dashboard"}
              className="btn-primary px-12"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-header mb-1">Carbon Calculator</h1>
          <p className="text-foreground/60 font-medium italic">Empowering you with data-driven sustainability.</p>
        </div>
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 w-10 rounded-full transition-all duration-500",
                i <= currentStep ? "bg-green" : "bg-black/5"
              )}
            />
          ))}
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                  <h2 className="text-3xl font-extrabold text-header">{steps[currentStep].title}</h2>
                  <p className="text-foreground/60 font-medium">{steps[currentStep].description}</p>
                </div>
              </div>

              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest">
                      {steps[currentStep].id === "transport" && "KM per Week"}
                      {steps[currentStep].id === "flights" && "Hours per Year"}
                      {steps[currentStep].id === "diet" && "Meat Meals per Week"}
                      {steps[currentStep].id === "energy" && "kWh per Month"}
                    </label>
                    <span className="text-3xl font-black text-green">
                      {values[steps[currentStep].id as keyof typeof values]}
                      <span className="text-sm font-bold text-foreground/40 ml-1">
                        {steps[currentStep].id === "transport" ? "km" : steps[currentStep].id === "flights" ? "hrs" : steps[currentStep].id === "diet" ? "meals" : "kWh"}
                      </span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={steps[currentStep].id === "energy" ? "1000" : steps[currentStep].id === "transport" ? "500" : "50"}
                    step="1"
                    value={values[steps[currentStep].id as keyof typeof values]}
                    onChange={(e) => updateValue(steps[currentStep].id, parseInt(e.target.value))}
                    className="w-full h-3 bg-black/5 rounded-full appearance-none cursor-pointer accent-green"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Low", val: steps[currentStep].id === "energy" ? 100 : 5 },
                    { label: "Average", val: steps[currentStep].id === "energy" ? 300 : 20 },
                    { label: "High", val: steps[currentStep].id === "energy" ? 700 : 40 },
                    { label: "Intense", val: steps[currentStep].id === "energy" ? 1000 : 100 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => updateValue(steps[currentStep].id, opt.val)}
                      className={cn(
                        "p-5 rounded-2xl border-2 transition-all text-left",
                        values[steps[currentStep].id as keyof typeof values] === opt.val 
                          ? "border-green bg-green/5" 
                          : "border-black/5 bg-white hover:border-black/10"
                      )}
                    >
                      <p className="text-header font-bold text-sm">{opt.label}</p>
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
                className="px-8 py-4 rounded-2xl font-bold border border-black/10 hover:bg-black/5 transition-all"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isCalculating}
              className="btn-primary grow flex items-center justify-center gap-2"
            >
              {isCalculating ? (
                <>Analyzing... <Loader2 size={20} className="animate-spin" /></>
              ) : (
                <>{currentStep === steps.length - 1 ? "Calculate Impact" : "Next Step"} <ArrowRight size={20} /></>
              )}
            </button>
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center">
          <div className="bento-card w-full aspect-square relative z-10 flex flex-col items-center justify-center p-12">
            <h3 className="text-2xl font-bold text-header mb-8">Live Breakdown</h3>
            
            <div className="w-full h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={results.breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {results.breakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-header">{results.total.toFixed(1)}</span>
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Total Tonnes</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full">
              {steps.map((step, i) => (
                <div key={step.id} className="flex flex-col items-center gap-1">
                  <div className="h-2 w-6 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[10px] font-bold text-foreground/40 uppercase">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

