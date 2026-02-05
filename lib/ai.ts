import { v4 as uuidv4 } from "uuid";
import type { Trip, TripDay, TripActivity, TravelBreakdown } from "../types/trip";

/** Rough travel cost estimates (one-way) from major Indian cities. */
const TRAVEL_ESTIMATES: Record<
  string,
  { flight: string; train: string; bus: string; notes?: string }
> = {
  rishikesh: { flight: "N/A (nearest: Dehradun ~₹3–5k)", train: "₹400–800", bus: "₹500–1k", notes: "Dehradun airport then cab/bus." },
  haridwar: { flight: "N/A (Dehradun ~₹3–5k)", train: "₹400–900", bus: "₹500–1k" },
  manali: { flight: "N/A (Bhuntar ~₹5–8k)", train: "N/A", bus: "₹1k–1.5k (overnight)", notes: "Delhi–Manali bus ~12–14 hrs." },
  shimla: { flight: "N/A", train: "₹400–1k (Kalka Shatabdi)", bus: "₹600–1.2k" },
  mussoorie: { flight: "N/A (Dehradun ~₹3–5k)", train: "₹400–800", bus: "₹500–900" },
  goa: { flight: "₹3k–8k", train: "₹1k–2.5k", bus: "₹1k–2k", notes: "Flight to Goa (Dabolim/Mopa)." },
  pondicherry: { flight: "N/A (Chennai ~₹2–4k)", train: "₹500–1.2k", bus: "₹400–800", notes: "Chennai then 2–3 hr drive/bus." },
  pondi: { flight: "N/A (Chennai ~₹2–4k)", train: "₹500–1.2k", bus: "₹400–800" },
  kerala: { flight: "₹4k–10k (Kochi/Trivandrum)", train: "₹1k–3k", bus: "₹1k–2k" },
  munnar: { flight: "N/A (Kochi ~₹4–8k)", train: "N/A", bus: "₹300–600 from Kochi" },
  leh: { flight: "₹8k–15k", train: "N/A", bus: "N/A", notes: "Flights from Delhi; road only in season." },
  ladakh: { flight: "₹8k–15k (Leh)", train: "N/A", bus: "N/A" },
  darjeeling: { flight: "N/A (Bagdogra ~₹4–7k)", train: "₹600–1.5k", bus: "₹800–1.5k" },
  gangtok: { flight: "N/A (Bagdogra ~₹4–7k)", train: "N/A", bus: "₹600–1k" },
  udaipur: { flight: "₹4k–9k", train: "₹500–1.5k", bus: "₹600–1.2k" },
  jaipur: { flight: "₹3k–7k", train: "₹400–1.2k", bus: "₹500–1k" },
  default: { flight: "₹2k–6k (varies)", train: "₹400–1.5k", bus: "₹400–1.2k" },
};

function getTravelBreakdown(destination: string): TravelBreakdown {
  const key = destination.toLowerCase().replace(/\s+/g, "").slice(0, 20);
  const found = Object.keys(TRAVEL_ESTIMATES).find(
    (k) => k !== "default" && (key.includes(k) || k.includes(key))
  );
  const est = found ? TRAVEL_ESTIMATES[found] : TRAVEL_ESTIMATES.default;
  return { ...est };
}

type DestinationVibe = "religious" | "mountain" | "beach" | "city" | "hill_station" | "general";

function getDestinationVibe(_destination: string, lower: string): DestinationVibe {
  if (/\b(rishikesh|haridwar|varanasi|ayodhya|tirupati|amritsar|dwarka)\b/.test(lower)) return "religious";
  if (/\b(manali|shimla|mussoorie|nainital|darjeeling|munnar|ooty|leh|ladakh|spiti|kasol|bir)\b/.test(lower)) return "mountain";
  if (/\b(goa|pondi|pondicherry|kovalam|varkala|andaman|gokarna|mahabalipuram)\b/.test(lower)) return "beach";
  if (/\b(bangalore|mumbai|delhi|hyderabad|chennai|kolkata|pune)\b/.test(lower)) return "city";
  if (/\b(mountain|trek|trekking|hills|snow)\b/.test(lower)) return "mountain";
  if (/\b(beach|beaches|sea|coast)\b/.test(lower)) return "beach";
  if (/\b(temple|holy|spiritual|yoga|meditation)\b/.test(lower)) return "religious";
  return "general";
}

/** Build day-wise activities based on destination and vibe. */
function buildActivitiesForDay(
  destination: string,
  vibe: DestinationVibe
): TripActivity[] {
  const activities: TripActivity[] = [];
  const dest = destination;

  if (vibe === "religious") {
    activities.push(
      { time: "06:00", place: "Morning Ganga Aarti / Temple visit", description: `Start with sunrise aarti or temple darshan. Peaceful and photogenic.`, cost: "₹0", mapQuery: `${dest} ghat temple`, photoSpot: true },
      { time: "09:30", place: "Breakfast near ghats", description: `Simple prasad or local breakfast with chai.`, cost: "₹100–200", mapQuery: `${dest} breakfast` },
      { time: "11:00", place: "Ashram or yoga by the river", description: `Yoga/meditation session; many free or donation-based.`, cost: "₹0–300", mapQuery: `${dest} yoga ashram`, photoSpot: true },
      { time: "14:00", place: "Local lunch + temple hopping", description: `Visit 1–2 more temples; try local bhojanalay.`, cost: "₹150–400", mapQuery: `${dest} temple` },
      { time: "17:00", place: "Evening ghat walk / sunset", description: `Best time for photos and reels by the river.`, cost: "₹0", mapQuery: `${dest} ghat sunset`, photoSpot: true }
    );
  } else if (vibe === "mountain") {
    activities.push(
      { time: "07:00", place: "Early breakfast + trek start", description: `Short trek or nature walk; carry water and layers.`, cost: "₹200–500", mapQuery: `${dest} trek`, photoSpot: true },
      { time: "10:00", place: "Viewpoint / meadow", description: `Rest at a viewpoint; great for pictures.`, cost: "₹0", mapQuery: `${dest} viewpoint`, photoSpot: true },
      { time: "13:00", place: "Lunch at dhaba / cafe", description: `Warm meal; try local chai and maggi.`, cost: "₹200–400", mapQuery: `${dest} dhaba` },
      { time: "15:00", place: "Explore village / market", description: `Local market or short walk in town.`, cost: "₹0–300", mapQuery: `${dest} market` },
      { time: "18:00", place: "Sunset point", description: `Golden hour photos; wrap up before dark.`, cost: "₹0", mapQuery: `${dest} sunset point`, photoSpot: true }
    );
  } else if (vibe === "beach") {
    activities.push(
      { time: "06:30", place: "Sunrise on the beach", description: `Early morning beach walk; best light for photos.`, cost: "₹0", mapQuery: `${dest} beach`, photoSpot: true },
      { time: "09:00", place: "Beachside breakfast / cafe", description: `Chill breakfast with sea view.`, cost: "₹300–600", mapQuery: `${dest} beach cafe`, photoSpot: true },
      { time: "11:00", place: "Beach time / water sports", description: `Swim, surf, or just relax. Optional water sports extra.`, cost: "₹0–1k", mapQuery: `${dest} beach` },
      { time: "14:00", place: "Lunch at shack or town", description: `Fresh seafood or local lunch.`, cost: "₹400–800", mapQuery: `${dest} lunch` },
      { time: "17:00", place: "French Quarter / old town (if Pondy) or sunset beach", description: `Colonial streets or sunset by the sea—great for reels.`, cost: "₹0", mapQuery: `${dest} french quarter beach`, photoSpot: true }
    );
  } else if (vibe === "city") {
    activities.push(
      { time: "08:00", place: "Cafe / brunch spot", description: `Start with good coffee and breakfast.`, cost: "₹400–700", mapQuery: `${dest} cafe` },
      { time: "10:30", place: "Landmark or museum", description: `One main attraction; book online if needed.`, cost: "₹0–500", mapQuery: `${dest} landmark`, photoSpot: true },
      { time: "13:00", place: "Local lunch", description: `Famous local food or street food.`, cost: "₹200–500", mapQuery: `${dest} food` },
      { time: "15:00", place: "Market / shopping street", description: `Souvenirs or just walk around.`, cost: "₹0–1k", mapQuery: `${dest} market` },
      { time: "19:00", place: "Rooftop or waterfront", description: `Evening views; good for photos.`, cost: "₹500–1k", mapQuery: `${dest} rooftop`, photoSpot: true }
    );
  } else {
    // general
    activities.push(
      { time: "09:00", place: `Morning spot in ${dest}`, description: `Breakfast and a relaxed start.`, cost: "₹300–500", mapQuery: `${dest} cafe` },
      { time: "12:00", place: `Main attraction`, description: `Explore a key place in ${dest}.`, cost: "₹0–400", mapQuery: dest, photoSpot: true },
      { time: "14:00", place: "Lunch", description: `Local lunch.`, cost: "₹250–500", mapQuery: `${dest} restaurant` },
      { time: "17:00", place: "Viewpoint or walk", description: `Evening stroll; good for photos.`, cost: "₹0", mapQuery: `${dest} viewpoint`, photoSpot: true }
    );
  }

  return activities;
}

/**
 * Pure frontend mock: generates a structured Trip with destination-specific
 * itineraries, travel cost breakdown (flight/train/bus), and photo spots.
 */
export async function generateTrip(prompt: string): Promise<Trip> {
  const now = new Date().toISOString();
  const lower = prompt.toLowerCase();

  const matchDays = lower.match(/(\d+)\s*day/);
  const daysCount = matchDays ? Math.min(Number(matchDays[1]) || 3, 10) : 3;

  const destinationMatch = lower.match(/\b(?:in|to)\s+([a-zA-Z\s]+?)(?:\s+under|\s+with|\s*$)/i) ||
    lower.match(/(?:goa|manali|rishikesh|pondicherry|pondi|kerala|shimla|munnar|leh|udaipur|jaipur|darjeeling|mumbai|delhi|bangalore|ooty|gokarna|andaman|varanasi|haridwar|mussoorie|kasol|spiti|mahabalipuram|kovalam|varkala)/i);
  const destination = destinationMatch
    ? (typeof destinationMatch[1] === "string" ? destinationMatch[1].trim() : destinationMatch[0]).replace(/\s+under.*$/i, "").trim() || "Your Destination"
    : "Your Destination";

  const budgetMatch = lower.match(/under\s*([\d,]+)/);
  const budget = budgetMatch ? budgetMatch[1] : "";
  const totalBudget = budget ? `₹${budget}` : "Flexible Budget";

  const vibe = getDestinationVibe(destination, lower);
  const travelBreakdown = getTravelBreakdown(destination);

  const days: TripDay[] = Array.from({ length: daysCount }).map((_, index) => {
    const dayNumber = index + 1;
    const activities = buildActivitiesForDay(destination, vibe);
    const dayTitles: Record<DestinationVibe, string> = {
      religious: `Day ${dayNumber}: Temples, ghats & yoga in ${destination}`,
      mountain: `Day ${dayNumber}: Treks & views in ${destination}`,
      beach: `Day ${dayNumber}: Beaches & vibes in ${destination}`,
      city: `Day ${dayNumber}: Exploring ${destination}`,
      hill_station: `Day ${dayNumber}: Hills & cool air in ${destination}`,
      general: `Day ${dayNumber} in ${destination}`,
    };
    return {
      day: dayNumber,
      title: dayTitles[vibe],
      activities,
    };
  });

  const trip: Trip = {
    id: uuidv4(),
    createdAt: now,
    prompt,
    tripTitle: `${daysCount}-day trip to ${destination}`,
    totalBudget,
    travelBreakdown,
    days,
  };

  return trip;
}
