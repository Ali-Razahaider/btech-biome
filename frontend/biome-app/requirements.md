Tech Stack Specifications
Framework: Next.js 14+ (App Router)

Language: TypeScript (Strict mode)

Styling: Tailwind CSS

Animations: Framer Motion (for smooth transitions, progress bars, and hover effects)

Icons/Illustrations: Lucide-React for icons; high-quality SVG/Lottie for sustainability-themed illustrations.

Charts/Visuals: Recharts or Chart.js (for the carbon footprint breakdown).

State Management: React Context API or Zustand (to handle mock data flow).

Comprehensive Project Prompt
The Objective
Build the front-end for GreenPulse, a sustainability platform that gamifies eco-conscious living. The UI must follow a "Carbon-Negative" dark theme with high-contrast green accents. Every interaction should feel fluid using Framer Motion.

Global Styles & Theming
Colors: * bg-main: #0B0B0C (Deep Charcoal)

bg-card: #1C1D1F (Off-black)

accent-primary: #55D688 (Eco-Green)

accent-secondary: #957DC0 (Muted Lavender)

Typography: Inter or Geist Sans.

Animations: Use layoutId from Framer Motion for shared element transitions between pages. Implement "Spring" physics for all button hovers and modal entries.

Component Architecture
1. Landing Page (/)
Hero Section: A sleek, minimalist mission statement with a "Glassmorphism" effect background.

Visual Impact: A pulsing green node network representing "Environmental Impact Stats."

CTA: A high-visibility button with a hover-glow effect leading to the Calculator.

Checklist Status: Render the "Day 1 Checklist" entry as seen in the reference image: a card with a thick #55D688 border, a checked box, and purple "5pts" text.

2. Personal Dashboard (/dashboard)
Carbon Score Widget: A circular progress gauge (Framer Motion) that fills based on the current score.

Streak Tracker: A "Flame" icon that glows brighter the higher the streak number.

Level/Badge Gallery: A grid of hexagon-shaped badges. Use grayscale for locked badges and vibrant colors for unlocked ones.

3. Interactive Carbon Calculator (/calculator)
Multi-Step UI: Use a Framer Motion AnimatePresence to transition between "Transport," "Diet," and "Energy" steps.

Real-time Visualization: A Recharts Donut Chart on the right side of the screen that shifts its segments instantly as the user moves sliders or clicks options.

4. Community & Social (/community)
Challenges: Card components with "Progress Bars" that animate on scroll. Include "Join" buttons that toggle to "Joined" with a scale-up animation.

Leaderboard: A list that uses framer-motion's layout prop so ranks re-order smoothly when filters (Week/Month/All-time) are changed.

Data Map: A custom SVG map of the world or specific regions. On hover, show a tooltip with "Live AQI" (Air Quality Index) using mock data.

5. Authentication & Profile (/auth, /settings)
Onboarding: A step-by-step profile builder asking for the user's city and sustainability goals.

Visuals: Use vector illustrations of wind turbines or lush forests in the background of the login page.

Development Instructions
Strictly Front-End: Use useState and useEffect with local JSON files to simulate backend responses.

Responsiveness: Use Tailwind’s sm, md, and lg breakpoints. The "Carbon Calculator" must stack vertically on mobile.

Micro-interactions: * Buttons should scale down to 0.95 on click.

List items should fade in with a 0.1s stagger delay.

Checkboxes should animate the "check" mark drawing in using pathLength.

Required Illustrations/Assets
Hero Illustration: A minimalist 3D-style SVG of a glowing green heart or a digital leaf.

Empty States: If no logs exist, show a "Planting seeds..." illustration.

Badges: 8 unique SVG icons representing different eco-milestones.

Final Note for Developer: Ensure the code is clean, modular, and utilizes TypeScript interfaces for all data structures (e.g., interface UserProfile, interface CarbonAction).