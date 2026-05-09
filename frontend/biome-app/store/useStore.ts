import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import { authApi, actionsApi, challengesApi, biomassApi, footprintApi, leaderboardApi, envApi, aiApi } from "@/lib/api";

interface EcoAction {
  id: string;
  title: string;
  points: number;
  timestamp: string;
  type: string;
}

interface UserProfile {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  city: string;
  country: string;
  habits: string[];
  points: number;
  streak: number;
  carbonScore: number;
  globalRank: number | null;
  lastLogin: string;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
}

interface Challenge {
  id: string;
  title: string;
  participants: number;
  progress: number;
  tag: string;
  joined: boolean;
}

interface BiomassZone {
  id: string;
  name: string;
  coords: [number, number];
  potential: "High" | "Medium" | "Low";
  cropType: string;
}

interface LeaderboardEntry {
  user_id: string;
  email: string;
  eco_points: number;
  rank: number;
  streak: number;
  city: string | null;
}

interface EcoStore {
  user: UserProfile;
  actions: EcoAction[];
  challenges: Challenge[];
  leaderboard: LeaderboardEntry[];
  aqi: { value: number; status: string; city: string; coords: [number, number] } | null;
  biomassZones: BiomassZone[];
  selectedZone: BiomassZone | null;
  insights: string[];
  weeklyPlan: any[];
  _synced: boolean;
  isLoading: boolean;
  
  // Actions
  addPoints: (pts: number) => void;
  addAction: (action: { category: string; description: string; points: number }) => Promise<void>;
  toggleChallenge: (id: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => void;
  fetchAQI: (city: string) => Promise<void>;
  fetchLeaderboard: (filter?: 'alltime' | 'weekly' | 'monthly') => Promise<void>;
  checkStreak: () => void;
  calculateTier: (points: number) => "Bronze" | "Silver" | "Gold" | "Platinum";
  syncWithBackend: () => Promise<void>;
  setSelectedZone: (zone: BiomassZone | null) => void;
  fetchAIInsights: () => Promise<void>;
  fetchWeeklyPlan: () => Promise<void>;
}

export const useEcoStore = create<EcoStore>()(
  persist(
    (set, get) => ({
      user: {
        name: "User",
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        city: "Lahore",
        country: "Pakistan",
        habits: [],
        points: 0,
        streak: 0,
        carbonScore: 0,
        globalRank: null,
        lastLogin: new Date().toISOString(),
        tier: "Bronze",
      },
      actions: [],
      challenges: [],
      biomassZones: [],
      leaderboard: [],
      selectedZone: null,
      aqi: null,
      insights: [],
      weeklyPlan: [],
      _synced: false,
      isLoading: true,

      setSelectedZone: (zone) => set({ selectedZone: zone }),

      calculateTier: (points) => {
        if (points >= 2000) return "Platinum";
        if (points >= 1000) return "Gold";
        if (points >= 500) return "Silver";
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

      addAction: async (action) => {
        // Optimistic UI update — show immediately
        const optimisticAction: EcoAction = {
          id: `temp-${Date.now()}`,
          title: action.description,
          points: action.points,
          timestamp: new Date().toISOString(),
          type: action.category.toLowerCase(),
        };
        set((state) => ({
          actions: [optimisticAction, ...state.actions],
          user: {
            ...state.user,
            points: state.user.points + action.points,
            tier: get().calculateTier(state.user.points + action.points),
          },
        }));

        try {
          await actionsApi.logAction({
            category: action.category,
            description: action.description,
            points: action.points,
          });
          // Refresh everything to ensure dashboard is up to date
          await get().syncWithBackend();
        } catch (error) {
          // Rollback optimistic update
          set((state) => ({
            actions: state.actions.filter(a => a.id !== optimisticAction.id),
            user: {
              ...state.user,
              points: state.user.points - action.points,
              tier: get().calculateTier(state.user.points - action.points),
            },
          }));
          console.error("Failed to log action:", error);
        }
      },

      toggleChallenge: async (id) => {
        const previousChallenges = [...get().challenges];
        
        // Optimistic update
        set((state) => ({
          challenges: state.challenges.map(c => 
            c.id === id ? { ...c, joined: !c.joined, participants: c.joined ? c.participants - 1 : c.participants + 1 } : c
          )
        }));

        try {
          const challenge = previousChallenges.find(c => c.id === id);
          if (challenge?.joined) {
            await challengesApi.leave(id.toString());
          } else {
            await challengesApi.join(id.toString());
          }
          
          // Sync with backend to ensure data consistency
          const allChallenges = await challengesApi.getAll();
          set({
            challenges: allChallenges.map((c: any) => ({
              id: c.id,
              title: c.title,
              participants: c.participants || Math.floor(Math.random() * 1000) + 100,
              progress: c.progress || 0,
              tag: "COMMUNITY",
              joined: c.joined,
            })),
          });
        } catch (error) {
          // Rollback on failure
          set({ challenges: previousChallenges });
          console.error("Failed to toggle challenge:", error);
        }
      },

      updateProfile: (profile) => set((state) => ({
        user: { ...state.user, ...profile }
      })),

      fetchAQI: async (city) => {
        try {
          const data = await envApi.getAQI(city);
          set({ aqi: { 
            value: data.aqi, 
            status: data.aqi < 50 ? "Good" : data.aqi < 100 ? "Moderate" : "Unhealthy",
            city: data.city.name,
            coords: data.city.geo
          }});
        } catch (error) {
          console.error("Failed to fetch AQI", error);
        }
      },

      fetchLeaderboard: async (filter = 'alltime') => {
        try {
          const data = await leaderboardApi.get(filter);
          set({ leaderboard: data });
          
          // Update global rank if user is in leaderboard
          const myRank = data.find((entry: any) => entry.email === get().user.email)?.rank;
          if (myRank) {
            set((state) => ({ user: { ...state.user, globalRank: myRank } }));
          }
        } catch (error) {
          console.error("Failed to fetch leaderboard", error);
        }
      },

      fetchAIInsights: async () => {
        try {
          const { insights } = await aiApi.getInsights();
          set({ insights });
        } catch (error) {
          console.error("Failed to fetch AI insights", error);
        }
      },

      fetchWeeklyPlan: async () => {
        try {
          const { plan } = await aiApi.getWeeklyPlan();
          set({ weeklyPlan: plan });
        } catch (error) {
          console.error("Failed to fetch weekly plan", error);
        }
      },

      checkStreak: () => {
        // Streak is now handled by backend during action logs
      },

      syncWithBackend: async () => {
        set({ isLoading: true });
        try {
          // 0. Pre-flight check: Is the user logged in?
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user?.email) return;

          // 1. Ensure user exists in backend DB (only once per session)
          if (!get()._synced) {
            try {
              await authApi.sync({ email: session.user.email });
            } catch (syncErr) {
              console.warn("Auth sync failed (likely network or pre-flight):", syncErr);
              // If we can't sync, we might not be able to fetch anything else, 
              // but we'll try anyway if it's a transient issue.
            }
          }

          // 2. Fetch everything with individual error handling to prevent total failure
          const fetchResults = await Promise.allSettled([
            authApi.getMe(),
            actionsApi.getRecent(),
            challengesApi.getAll(),
            biomassApi.getZones(),
          ]);

          const [userRes, actionsRes, challengesRes, zonesRes] = fetchResults;

          // Update state only for successful fetches
          const updates: Partial<EcoStore> = { _synced: true };

          if (userRes.status === 'fulfilled') {
            const userData = userRes.value;
            updates.user = {
              ...get().user,
              name: userData.email?.split('@')[0] || get().user.name,
              email: userData.email,
              city: userData.city || get().user.city,
              habits: userData.habits || get().user.habits,
              points: userData.eco_points,
              streak: userData.streak,
              tier: get().calculateTier(userData.eco_points),
            };
          }

          if (actionsRes.status === 'fulfilled') {
            updates.actions = actionsRes.value.map((a: any) => ({
              id: a.id,
              title: a.description,
              points: a.points,
              timestamp: a.logged_at,
              type: a.category.toLowerCase(),
            }));
          }

          if (challengesRes.status === 'fulfilled') {
            updates.challenges = challengesRes.value.map((c: any) => ({
              id: c.id,
              title: c.title,
              participants: c.participants || Math.floor(Math.random() * 1000) + 100,
              progress: c.progress || 0,
              tag: "COMMUNITY",
              joined: c.joined,
            }));
          }

          if (zonesRes.status === 'fulfilled') {
            updates.biomassZones = zonesRes.value.map((z: any) => {
              const firstPoint = z.geojson?.geometry?.coordinates?.[0]?.[0] || [74.3, 31.5];
              return {
                id: z.id.toString(),
                name: z.district,
                coords: [firstPoint[1], firstPoint[0]] as [number, number],
                potential: z.residue_tonnes_annual > 2000 ? "High" : "Medium",
                cropType: z.crop_type,
              };
            });
          }

          set({ ...updates, isLoading: false });

          // 3. Fetch footprint score (non-blocking)
          try {
            const history = await footprintApi.getHistory();
            if (history && history.length > 0) {
              const latest = history[0];
              const tonnes = latest.total_co2e / 1000;
              const score = Math.max(0, Math.min(100, Math.round(100 - (tonnes * 10))));
              set((state) => ({ user: { ...state.user, carbonScore: score } }));
            }
          } catch (e) {
            console.log("Footprint fetch skipped (likely no data)");
          }

          // 4. Fetch AI data if missing
          if (get().insights.length === 0) {
            get().fetchAIInsights();
            get().fetchWeeklyPlan();
          }

          // 5. Fetch leaderboard to get rank
          if (!get().user.globalRank) {
            get().fetchLeaderboard();
          }
        } catch (error) {
          console.error("Store sync critical failure:", error);
          set({ isLoading: false });
        }
      }
    }),
    {
      name: "greenpulse-storage",
      partialize: (state) => ({
        user: state.user,
        actions: state.actions,
        challenges: state.challenges,
        biomassZones: state.biomassZones,
      }),
    }
  )
);
