import axios from 'axios';
import { supabase } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Supabase JWT to requests
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export const authApi = {
  sync: async (userData: { email: string; city?: string; habits?: string[] }) => {
    const response = await api.post('/api/auth/sync', userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

export const actionsApi = {
  getRecent: async () => {
    const response = await api.get('/api/actions/recent');
    return response.data;
  },
  logAction: async (actionData: { category: string; description: string; points: number }) => {
    const response = await api.post('/api/actions/log', actionData);
    return response.data;
  },
};

export const challengesApi = {
  getAll: async () => {
    const response = await api.get('/api/challenges/');
    return response.data;
  },
  join: async (challengeId: string) => {
    const response = await api.post(`/api/challenges/${challengeId}/join`);
    return response.data;
  },
  leave: async (challengeId: string) => {
    const response = await api.post(`/api/challenges/${challengeId}/leave`);
    return response.data;
  },
};

export const leaderboardApi = {
  get: async (filter: 'alltime' | 'weekly' | 'monthly' = 'alltime') => {
    const response = await api.get(`/api/leaderboard/global?filter=${filter}`);
    return response.data;
  },
};

export const biomassApi = {
  getZones: async () => {
    const response = await api.get('/api/biomass/zones');
    return response.data;
  },
};

export const footprintApi = {
  calculate: async (data: any) => {
    const response = await api.post('/api/footprint/calculate', data);
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/api/footprint/history');
    return response.data;
  },
};

export const envApi = {
  getAQI: async (city: string) => {
    const response = await api.get(`/api/env/airquality?city=${city}`);
    return response.data;
  },
};

export const aiApi = {
  getInsights: async () => {
    const response = await api.post('/api/ai/footprint-insights');
    return response.data;
  },
  getWeeklyPlan: async () => {
    const response = await api.post('/api/ai/weekly-plan');
    return response.data;
  },
  analyzeBiomass: async (params: { lat: number; lng: number; district: string; aqi: number }) => {
    const response = await api.post('/api/ai/biomass-analysis', null, { params });
    return response.data;
  },
};

export default api;
