export interface TripActivity {
  time: string;
  place: string;
  description: string;
  cost: string;
  /**
   * Raw query string to be used with Google Maps search.
   * Example: "Baga Beach Goa"
   */
  mapQuery: string;
  /** True if this spot is especially good for photos / reels. */
  photoSpot?: boolean;
}

/** Travel cost estimates to reach the destination (flight, train, bus). */
export interface TravelBreakdown {
  flight: string;
  train: string;
  bus: string;
  notes?: string;
}

export interface TripDay {
  day: number;
  title: string;
  activities: TripActivity[];
}

/**
 * Core trip entity used throughout the app.
 *
 * The AI response provides the base structure (title, budget, days, activities).
 * We augment it with metadata for persistence and history.
 */
export interface Trip {
  /** Stable identifier used for history and list rendering. */
  id: string;
  /** ISO timestamp string representing when the trip was created. */
  createdAt: string;
  /** Original natural-language prompt used to generate this trip. */
  prompt: string;
  /** Human-readable title, e.g. "3 Days in Goa Under 10k". */
  tripTitle: string;
  /** Budget as a formatted string, e.g. "₹10,000" or "$500". */
  totalBudget: string;
  /** Optional travel cost estimates (flight / train / bus) to reach destination. */
  travelBreakdown?: TravelBreakdown;
  /** Array of day-level itineraries. */
  days: TripDay[];
}

/**
 * Shape returned by the AI model before we enrich it with metadata.
 * Mirrors the JSON contract described in the product spec.
 */
export interface RawAiTripResponse {
  tripTitle: string;
  totalBudget: string;
  days: {
    day: number;
    title: string;
    activities: {
      time: string;
      place: string;
      description: string;
      cost: string;
      mapQuery: string;
    }[];
  }[];
}

