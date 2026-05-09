<p align="center">
  <img src="https://img.shields.io/badge/🌿_BIOME-Pakistan's_AI_Sustainability_Platform-55D688?style=for-the-badge&labelColor=0d1117" alt="Biome Banner" />
</p>

<h1 align="center">🌍 Biome</h1>

<p align="center">
  <strong>Turning Climate Intent into Measurable Impact</strong><br/>
  <em>AI-Powered Sustainability for Individuals, Communities, and Regions — Built for Pakistan</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Leaflet_Maps-199900?style=flat-square&logo=leaflet&logoColor=white" alt="Leaflet" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

---

## 🔥 The Pitch (60 Seconds)

> **"What if you could click on a map of Punjab, and in 3 seconds, AI tells you exactly how many households a biogas plant could power there — and how much smog it would eliminate?"**

That's Biome. We built a platform that connects **your personal carbon footprint** to **Pakistan's biggest environmental crisis** — the seasonal smog that chokes 40 million people every winter.

Biome isn't just a calculator. It's a **3-layer sustainability engine:**

1. 🧑 **Personal** — Calculate your CO₂, log daily eco-actions, build streaks, earn points
2. 👥 **Community** — Join challenges, compete on leaderboards, create collective impact
3. 🗺️ **Regional Intelligence** — AI-powered biomass feasibility analysis on a live map of Pakistan

**One platform. Three layers. Real impact.**

---

## 💀 The Problem

Pakistan faces two deeply linked environmental crises that kill thousands and cost billions annually:

| Crisis | Scale | What's Happening |
|--------|-------|-------------------|
| **Unbreathable Air** | **40M+ people** affected by seasonal smog | Lahore consistently ranks among the world's most polluted cities. Crop burning blankets cities in hazardous PM2.5 |
| **Energy Scarcity** | **18M tonnes** of crop waste burned annually | Gas shortages force households to burn wood, coal, and crop residue — the same residue that could generate clean biogas |
| **No Behavior Loop** | **Zero tools** connecting personal action to local data | People know they should act, but have no system that makes sustainability measurable, rewarding, or locally relevant |

**The cruel irony:** The very crop waste causing deadly smog is an untapped clean energy resource. Burning it is both the problem and the wasted solution.

---

## 💡 Our Solution — The 3-Layer Architecture

### Layer 1: Personal Impact Engine 🧑

> *"What's MY footprint, and what can I do TODAY?"*

- **AI Carbon Calculator** — Input transport, flights, diet, and energy data → get precise CO₂e breakdown in kg
- **Daily Eco-Action Logger** — Log actions like "cycled to work" or "skipped meat" → earn points instantly
- **Streak System** — Consecutive daily actions build streaks, creating habit loops (like Duolingo for the planet)
- **Tier Progression** — Bronze → Silver → Gold → Platinum based on accumulated eco-points
- **AI Weekly Plans** — Gemini generates a personalized 7-day action plan with estimated CO₂ savings per action

### Layer 2: Community Engine 👥

> *"How does MY impact compare, and how do WE move the needle?"*

- **Live Leaderboard** — Global ranking with weekly, monthly, and all-time filters
- **Active Challenges** — Community missions like "No Plastic Week" or "Walk to Work 5 Days"
- **Join/Leave Mechanics** — Users can opt into challenges with real-time participant tracking
- **Social Accountability** — The same gamification psychology behind fitness apps, applied to sustainability

### Layer 3: Regional Biomass Intelligence 🗺️

> *"WHERE in Pakistan can clean energy replace crop burning?"*

- **Interactive Leaflet Map** — Live AQI data for Lahore, Faisalabad, Gujranwala, Multan, Sialkot, and Sheikhupura
- **Biomass Potential Overlays** — Color-coded circles showing crop residue zones across Punjab (wheat & rice)
- **AI Site Analysis** — Click any biomass zone on the map → Gemini returns:
  - ✅ Feasibility Score (1–10)
  - 📉 Estimated CO₂ saved annually (kg)
  - 🏠 Number of households that could be powered
  - 🌬️ Projected AQI improvement (%) if crop burning stopped
  - 💡 3 actionable recommendations
- **Persistent Analysis** — Results are stored in the database for instant retrieval

---

## 🎯 The Demo Flow (For Judges)

```
1. Landing Page → Premium hero with animated text cycling through
   "Measurable Impact" / "Community Action" / "AI Intelligence"

2. Sign Up → Supabase Auth (email/password) → auto-sync to backend DB

3. Carbon Calculator → Step-by-step wizard (Transport → Flights → Diet → Energy)
   → Live pie chart updates in real-time → Server calculates precise CO₂e

4. Dashboard → Eco-Score gauge, tier progression, streak tracker,
   AI-generated insights, personalized 7-day action plan

5. Community Hub → Join challenges, see live leaderboard with filters,
   interactive AQI map embedded

6. 🌟 THE WOW MOMENT — Environmental Map Page:
   → See live AQI markers for 6+ Pakistani cities
   → Click on a biomass zone (e.g., Sheikhupura)
   → Watch Gemini AI analyze the site in real-time
   → Slide-in panel shows feasibility score, CO₂ savings,
      households powered, and AI recommendations
```

---

## 🏗️ Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  Next.js 16 (App Router) + React 19 + TypeScript                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │ Dashboard │ │Calculator│ │Community │ │ Environmental Map │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
│  Zustand (State) │ Framer Motion (Anim) │ Recharts (Viz)        │
│  Leaflet.js (Maps) │ Supabase Auth (JWT) │ Axios (HTTP)         │
├─────────────────────────────────────────────────────────────────┤
│                        BACKEND API                               │
│  FastAPI (Python 3.12) — Async, Type-safe                       │
│  ┌────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐          │
│  │ Auth   │ │Footprint │ │Eco-Action│ │ Challenges  │          │
│  │ /sync  │ │/calculate│ │  /log    │ │ /join /leave│          │
│  └────────┘ └──────────┘ └──────────┘ └────────────┘          │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────────┐       │
│  │Leaderboard│ │Environment│ │ AI (Gemini 2.5 Flash)   │       │
│  │ /global  │ │/airquality│ │ /insights /plan /biomass │       │
│  └──────────┘ └──────────┘ └──────────────────────────┘       │
├─────────────────────────────────────────────────────────────────┤
│                      DATA LAYER                                  │
│  PostgreSQL (Supabase) + SQLAlchemy ORM + Alembic Migrations    │
│  Models: User, FootprintLog, EcoAction, Challenge,              │
│          ChallengeParticipant, AIAnalysis, BiomassZone           │
├─────────────────────────────────────────────────────────────────┤
│                    EXTERNAL SERVICES                             │
│  Supabase Auth (JWT) │ WAQI API (AQI) │ Google Gemini (AI)     │
│  OpenStreetMap (Tiles) │ CARTO (Map Style)                      │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack Summary

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 16 + React 19 + TypeScript | Server components, App Router, latest React |
| **Styling** | Tailwind CSS 4 + Framer Motion | Rapid styling + premium micro-animations |
| **State** | Zustand (persisted) | Lightweight, performant, optimistic UI updates |
| **Maps** | Leaflet.js + OpenStreetMap + CARTO | Fully free, no API key limits |
| **Charts** | Recharts | Pie charts, gauges for footprint visualization |
| **Backend** | FastAPI (Python 3.12, async) | Fast, type-safe, Pydantic validation |
| **ORM** | SQLAlchemy 2.0 + Alembic | Async ORM with migration management |
| **Database** | PostgreSQL (Supabase) | Managed, free tier, integrated auth |
| **Auth** | Supabase Auth + JWT verification | Battle-tested, handles registration/login |
| **AI** | Google Gemini 2.5 Flash | Low-latency, structured JSON responses |
| **AQI Data** | WAQI API (cached 10 min) | Free, real-time air quality for Pakistani cities |
| **Deployment** | Vercel (frontend) + Render (backend) | Zero-config, free tier |

---

## 📊 Data Models

```
User ──────┬──→ FootprintLog (CO₂e breakdown per audit)
           ├──→ EcoAction (daily logged actions with points)
           └──→ ChallengeParticipant ──→ Challenge

BiomassZone (seeded GeoJSON for Punjab districts)
AIAnalysis (persisted Gemini analysis results per location)
```

**7 tables**, all with async SQLAlchemy mapped columns, Alembic-managed migrations, and Pydantic schema validation.

---

## 🧠 AI Integration (Gemini 2.5 Flash)

We use Google Gemini across **three distinct AI features**, each with tailored prompt engineering:

| Feature | Input | Output | Use Case |
|---------|-------|--------|----------|
| **Footprint Insights** | User's CO₂ breakdown | Top 3 reduction levers | Dashboard personalization |
| **Weekly Plan** | User habits + footprint | 7-day action plan with CO₂ savings | Behavior change engine |
| **Biomass Analysis** | Lat/lng, district, AQI | Feasibility score, CO₂ saved, households powered, tips | Regional intelligence |

All AI responses are structured JSON, validated server-side, and cached in the database.

---

## 🌟 What Makes This Different

| Other Sustainability Apps | Biome |
|--------------------------|-------|
| Generic global calculators | **Pakistan-specific** CO₂ formulas and data |
| Static results | **Live AQI data** from WAQI for real Pakistani cities |
| No community features | **Gamified challenges**, leaderboards, streak system |
| No regional context | **AI biomass mapping** connecting personal action to regional impact |
| Basic UI | **Premium bento-grid dashboard** with animations, gauges, and tier progression |
| No AI | **Gemini-powered** insights, weekly plans, and feasibility analysis |

---

## 🚀 Key Engineering Decisions

1. **Optimistic UI Updates** — Actions are reflected immediately in the UI before server confirmation, with automatic rollback on failure
2. **Parallel Data Fetching** — `Promise.allSettled` ensures partial failures don't break the dashboard
3. **10-Minute AQI Cache** — Server-side caching respects WAQI free-tier limits while keeping data fresh
4. **Supabase JWT Passthrough** — Frontend authenticates via Supabase; backend verifies the same JWT for zero-friction auth
5. **Persisted AI Results** — Biomass analyses are stored in PostgreSQL for instant retrieval of previously analyzed locations
6. **Dynamic Map Markers** — Custom Leaflet `divIcon` markers with color-coded AQI values rendered directly on the map

---

## 📁 Project Structure

```
hackathon/
├── frontend/biome-app/
│   ├── app/
│   │   ├── page.tsx              # Landing page (Hero, Stats, Problem, Solution, Features, CTA)
│   │   ├── auth/                 # Login & Signup pages
│   │   ├── dashboard/            # Impact Hub — scores, tiers, AI insights, weekly plan
│   │   ├── calculator/           # Step-by-step carbon calculator with live pie chart
│   │   ├── community/            # Leaderboard, challenges, live map
│   │   ├── map/                  # Environmental map with AI biomass analysis
│   │   └── profile/              # User profile management
│   ├── components/
│   │   ├── MapComponent.tsx      # Leaflet map with AQI markers and biomass zones
│   │   ├── dashboard/            # AIInsights, WeeklyPlan, LogActionModal
│   │   └── home/                 # BentoFeatures, ProblemSection, SolutionLayers
│   ├── store/useStore.ts         # Zustand state management (persisted)
│   └── lib/api.ts                # Axios API client with Supabase JWT interceptor
│
├── backend/
│   ├── main.py                   # FastAPI app with CORS, routers, health checks
│   ├── app/
│   │   ├── api/                  # Route handlers (auth, footprint, actions, challenges, leaderboard, env, biomass, ai)
│   │   ├── models/               # SQLAlchemy models (User, FootprintLog, EcoAction, Challenge, etc.)
│   │   ├── schemas/              # Pydantic request/response schemas
│   │   ├── services/             # Business logic (AI service, footprint calculation)
│   │   ├── core/                 # Config loader, JWT security
│   │   └── db/                   # Database session, initialization, seed data
│   └── alembic/                  # Database migrations
│
└── project-guide.md              # Detailed project specification
```

---

## 🏆 Hackathon Alignment

| Rubric Item | How Biome Delivers |
|-------------|-------------------|
| **Problem Relevance** | Directly addresses Pakistan's #1 environmental crisis — air pollution from crop burning |
| **Innovation** | First platform to connect personal footprint tracking with AI biomass feasibility mapping |
| **Technical Depth** | Full-stack with 8 API modules, 7 DB models, 3 AI features, real-time external APIs |
| **User Experience** | Premium UI with animations, bento grid, glassmorphism, tier gamification |
| **Completeness** | Auth → Calculator → Dashboard → Community → AI Map — full end-to-end flow |
| **Impact Potential** | If even 5% of Punjab's crop residue converts to biogas, it eliminates a major smog source |
| **Scalability** | Modular architecture — easily extendable to other countries, new data sources, or NGO dashboards |

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+, Python 3.12+, PostgreSQL (or Supabase account)

### Frontend
```bash
cd frontend/biome-app
npm install
npm run dev        # → http://localhost:3000
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload    # → http://localhost:8000
```

### Environment Variables
Create `.env` files with:
- `DATABASE_URL` — PostgreSQL connection string
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` — Supabase project credentials
- `GEMINI_API_KEY` — Google Gemini API key
- `WAQI_TOKEN` — World Air Quality Index API token
- `JWT_SECRET_KEY` — For backend token signing

---

## 👥 Team

**B-Tech Biome** — Built at Hack for a Sustainable Future

---

<p align="center">
  <strong>🌿 Every action counts. Every data point matters. Every district can be cleaner.</strong><br/>
  <em>Biome — Where personal sustainability meets regional intelligence.</em>
</p>
