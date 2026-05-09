"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf, Bike, Zap, Trash2, CheckCircle2 } from "lucide-react";
import { useEcoStore } from "@/store/useStore";

import toast from "react-hot-toast";

interface LogActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACTION_TYPES = [
  { id: "transport", title: "Cycled to Work", points: 25, icon: Bike, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "waste", title: "Avoided Plastic", points: 15, icon: Trash2, color: "text-orange", bg: "bg-orange-50" },
  { id: "energy", title: "Turned off AC", points: 20, icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
  { id: "food", title: "Plant-based Meal", points: 20, icon: Leaf, color: "text-green", bg: "bg-green-50" },
];

export default function LogActionModal({ isOpen, onClose }: LogActionModalProps) {
  const { addAction } = useEcoStore();
  const [success, setSuccess] = useState(false);

  const handleLog = async (action: typeof ACTION_TYPES[0]) => {
    const loadingToast = toast.loading(`Recording your impact for ${action.title}...`);
    try {
      await addAction({
        category: action.id,
        description: action.title,
        points: action.points,
      });
      
      toast.success(`Impact Recorded! +${action.points} pts`, {
        id: loadingToast,
        icon: '🌱',
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      toast.error("Failed to log action. Please try again.", {
        id: loadingToast,
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden p-8"
          >
            <div className="flex justify-between items-center mb-8 ">
              <h2 className="text-2xl font-black text-header">Log Eco-Action</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {success ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green/10 rounded-full flex items-center justify-center text-green mb-6"
                >
                  <CheckCircle2 size={48} />
                </motion.div>
                <h3 className="text-2xl font-bold text-header mb-2">Points Earned!</h3>
                <p className="text-foreground/60">Your impact is growing. Keep it up!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {ACTION_TYPES.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleLog(action)}
                    className="flex items-center cursor-pointer hover:text-green justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-green/50 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${action.bg} ${action.color} flex items-center justify-center`}>
                        <action.icon size={24} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-header">{action.title}</p>
                        <p className="text-xs text-foreground/40 font-bold uppercase tracking-wider">{action.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-green">+{action.points} pts</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
