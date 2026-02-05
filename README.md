# Travel Planner

Gen-Z style Travel Planner built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Zustand**, and **Framer Motion**.

Turn natural language prompts like:

> `3 days in Goa under 10000 with beaches, cafes, nightlife`

into a full itinerary: day-wise activities, travel cost estimates (flight/train/bus), and trip history stored in **localStorage**. No sign-up, no API keys—everything runs in your browser.

## What it does

- **Home** – Type how you talk; the app parses destination, days, and budget from your prompt and builds a structured trip.
- **Planner** – View your itinerary by day: timeline of activities (with costs and “photo spot” hints), travel breakdown for Indian destinations, and **regenerate a single day** if you want a different vibe.
- **Trip history** – All generated trips are saved in `localStorage` and listed at `/trips` with cursor-based pagination. Reopen any trip to edit or tweak.

Destination “vibes” (religious, mountain, beach, city, general) shape the activity templates—e.g. temples & ghats for Rishikesh, treks & viewpoints for Manali, beach and café flow for Goa. Travel estimates (flight/train/bus) are included for many Indian cities (Goa, Kerala, Leh, Jaipur, etc.).

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech stack

- **Next.js** (App Router), **React 18**, **TypeScript**
- **Tailwind CSS** (v4) for styling
- **Zustand** for trip and history state
- **Framer Motion** for animations
- **uuid** for trip IDs

Trip generation is **client-side** in `lib/ai.ts`: it parses your prompt and builds the itinerary with no backend or API keys required.
