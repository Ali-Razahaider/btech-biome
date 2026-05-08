import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EcoAction {
  id: string;
  title: string;
  points: number;
  timestamp: string;
  type: string;
}

interface UserProfile {
  name: string;
  city: string;
  habits: string[];
  points: number;
  streak: number;
  carbonScore: number;
  lastLogin: string;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
}

interface Challenge {
  id: number;
  title: string;
  participants: number;
  progress: number;
  tag: string;
  joined: boolean;
}

interface EcoStore {
  user: UserProfile;
  actions: EcoAction[];
  challenges: Challenge[];
  aqi: { value: number; status: string; city: string; coords: [number, number] } | null;
  
  // Actions
  addPoints: (pts: number) => void;
  addAction: (action: Omit<EcoAction, "id" | "timestamp">) => void;
  toggleChallenge: (id: number) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  fetchAQI: (city: string) => Promise<void>;
  checkStreak: () => void;
  calculateTier: (points: number) => "Bronze" | "Silver" | "Gold" | "Platinum";
}

export const useEcoStore = create<EcoStore>()(
  persist(
    (set, get) => ({
      user: {
        name: "Alex",
        city: "San Francisco",
        habits: [],
        points: 2450,
        streak: 4,
        carbonScore: 72,
        lastLogin: new Date().toISOString(),
        tier: "Bronze",
      },
      actions: [
        { id: "1", title: "Avoided Single-Use Plastic", points: 15, timestamp: new Date(Date.now() - 7200000).toISOString(), type: "waste" },
        { id: "2", title: "Used Public Transport", points: 25, timestamp: new Date(Date.now() - 18000000).toISOString(), type: "transport" },
      ],
      challenges: [
        { id: 1, title: "Zero Waste Week", participants: 1240, progress: 65, tag: "WASTE", joined: false },
        { id: 2, title: "10k Step Challenge", participants: 850, progress: 42, tag: "TRANSPORT", joined: false },
        { id: 3, title: "Meatless Mondays", participants: 2100, progress: 88, tag: "DIET", joined: false },
      ],
      aqi: null,

      calculateTier: (points) => {
        if (points >= 5000) return "Platinum";
        if (points >= 3000) return "Gold";
        if (points >= 1500) return "Silver";
        return "Bronze";
      },

      addPoints: (pts) => set((state) => {
        const newPoints = state.user.points + pts;
        return { 
          user: { 
            ...state.user, 
            points: newPoints,
            tier: get().calculateTier(newPoints)
          } 
        };
      }),

      addAction: (action) => set((state) => {
        const newAction = {
          ...action,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
        };
        const newPoints = state.user.points + action.points;
        return {
          actions: [newAction, ...state.actions],
          user: { 
            ...state.user, 
            points: newPoints,
            tier: get().calculateTier(newPoints)
          }
        };
      }),

      toggleChallenge: (id) => set((state) => ({
        challenges: state.challenges.map((c) => 
          c.id === id ? { ...c, joined: !c.joined, participants: c.joined ? c.participants - 1 : c.participants + 1 } : c
        )
      })),

      updateProfile: (profile) => set((state) => ({
        user: { ...state.user, ...profile }
      })),

      fetchAQI: async (city) => {
        try {
          const res = await fetch(`https://api.waqi.info/feed/${city}/?token=demo`);
          const data = await res.json();
          if (data.status === "ok") {
            set({ aqi: { 
              value: data.data.aqi, 
              status: data.data.aqi < 50 ? "Good" : data.data.aqi < 100 ? "Moderate" : "Unhealthy",
              city: data.data.city.name,
              coords: data.data.city.geo
            }});
          }
        } catch (error) {
          console.error("Failed to fetch AQI", error);
        }
      },

      checkStreak: () => {
        const state = get();
        const lastLogin = new Date(state.user.lastLogin);
        const today = new Date();
        const diffInDays = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 3600 * 24));
        
        if (diffInDays === 1) {
          set((state) => ({ 
            user: { ...state.user, streak: state.user.streak + 1, lastLogin: today.toISOString() } 
          }));
        } else if (diffInDays > 1) {
          set((state) => ({ 
            user: { ...state.user, streak: 1, lastLogin: today.toISOString() } 
          }));
        }
      }
    }),
    {
      name: "greenpulse-storage",
    }
  )
);
