import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import { authApi, actionsApi, challengesApi, biomassApi, footprintApi, leaderboardApi, envApi } from "@/lib/api";

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
  _synced: boolean;
  
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
        lastLogin: new Date().toISOString(),
        tier: "Bronze",
      },
      actions: [],
      challenges: [],
      biomassZones: [],
      leaderboard: [],
      selectedZone: null,
      aqi: null,
      _synced: false,

      setSelectedZone: (zone) => set({ selectedZone: zone }),
      
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
          // Refresh only user + actions (lightweight)
          const [userData, recentActions] = await Promise.all([
            authApi.getMe(),
            actionsApi.getRecent(),
          ]);
          const mappedActions = recentActions.map((a: any) => ({
            id: a.id,
            title: a.description,
            points: a.points,
            timestamp: a.logged_at,
            type: a.category.toLowerCase(),
          }));
          set((state) => ({
            user: {
              ...state.user,
              points: userData.eco_points,
              streak: userData.streak,
              tier: get().calculateTier(userData.eco_points),
            },
            actions: mappedActions,
          }));
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
        try {
          const challenge = get().challenges.find(c => c.id === id);
          if (challenge?.joined) {
            await challengesApi.leave(id.toString());
          } else {
            await challengesApi.join(id.toString());
          }
          // Only refresh challenges
          const allChallenges = await challengesApi.getAll();
          set({
            challenges: allChallenges.map((c: any) => ({
              id: c.id,
              title: c.title,
              participants: c.participants || Math.floor(Math.random() * 1000) + 100,
              progress: c.progress || 0,
              tag: "COMMUNITY",
              joined: c.joined || false,
            })),
          });
        } catch (error) {
          console.error("Failed to toggle challenge:", error);
        }
      },

      updateProfile: (profile) => set((state) => ({
        user: { ...state.user, ...profile }
      })),

      fetchAQI: async (city) => {
        try {
          // 1. Get coordinates from Mapbox Geocoding (Reliable for Punjab/Pakistan)
          const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
          const geocodeRes = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxToken}&limit=1`
          );
          const geocodeData = await geocodeRes.json();
          let coords: [number, number] = [31.5204, 74.3587]; // Fallback to Lahore

          if (geocodeData.features?.length > 0) {
            const [lng, lat] = geocodeData.features[0].center;
            coords = [lat, lng];
          }

          // 2. Get AQI data from WAQI (Just for the value)
          const res = await fetch(`https://api.waqi.info/feed/${city}/?token=demo`);
          const data = await res.json();
          
          if (data.status === "ok") {
            set({ aqi: { 
              value: data.data.aqi, 
              status: data.data.aqi < 50 ? "Good" : data.data.aqi < 100 ? "Moderate" : "Unhealthy",
              city: data.data.city.name,
              coords: coords // Use the reliable Mapbox coordinates
            }});
          } else {
            // Fallback for AQI if API fails but we have coordinates
            set({ aqi: {
              value: 45,
              status: "Good",
              city: city,
              coords: coords
            }});
          }
        } catch (error) {
          console.error("Failed to fetch city data", error);
        }
      },

      fetchLeaderboard: async (filter = 'alltime') => {
        try {
          const data = await leaderboardApi.get(filter);
          set({ leaderboard: data });
        } catch (error) {
          console.error("Failed to fetch leaderboard", error);
        }
      },

      checkStreak: () => {
        // Streak is now handled by backend during action logs
      },

      syncWithBackend: async () => {
        try {
          // 0. Ensure user exists in backend DB (only once per session)
          if (!get()._synced) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email) {
              try {
                await authApi.sync({ email: session.user.email });
              } catch (syncErr) {
                console.warn("Auth sync pre-flight failed:", syncErr);
              }
            }
          }

          // 1. Fetch everything in parallel for speed
          const [userData, recentActions, allChallenges, zones] = await Promise.all([
            authApi.getMe(),
            actionsApi.getRecent(),
            challengesApi.getAll(),
            biomassApi.getZones().catch(() => []),
          ]);

          // 2. Fetch footprint score (non-blocking)
          let score = 0;
          try {
            const history = await footprintApi.getHistory();
            if (history && history.length > 0) {
              score = Math.max(0, Math.min(100, 100 - Math.round(history[0].total_co2e * 10)));
            }
          } catch {
            // No footprint yet — that's fine
          }

          // 3. Map all data
          const mappedActions = recentActions.map((a: any) => ({
            id: a.id,
            title: a.description,
            points: a.points,
            timestamp: a.logged_at,
            type: a.category.toLowerCase(),
          }));

          const mappedChallenges = allChallenges.map((c: any) => ({
            id: c.id,
            title: c.title,
            participants: c.participants || Math.floor(Math.random() * 1000) + 100,
            progress: c.progress || 0,
            tag: "COMMUNITY",
            joined: c.joined || false,
          }));

          const mappedZones = zones.map((z: any) => ({
            id: z.id.toString(),
            name: z.district,
            coords: z.geojson?.geometry?.coordinates?.[0]?.[0] || [31.5, 74.3],
            potential: z.residue_tonnes_annual > 2000 ? "High" : "Medium",
            cropType: z.crop_type,
          }));

          // 4. Single atomic state update
          set((state) => ({
            _synced: true,
            user: {
              ...state.user,
              name: userData.email?.split('@')[0] || state.user.name,
              email: userData.email,
              city: userData.city || state.user.city,
              habits: userData.habits || state.user.habits,
              points: userData.eco_points,
              streak: userData.streak,
              tier: get().calculateTier(userData.eco_points),
              carbonScore: score,
            },
            actions: mappedActions,
            challenges: mappedChallenges,
            biomassZones: mappedZones,
          }));
        } catch (error) {
          console.error("Store sync failed:", error);
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
