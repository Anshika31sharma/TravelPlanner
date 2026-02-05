import type { Trip } from "../types/trip";

const STORAGE_KEY = "travelplanner_trips";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readAllTripsFromStorage(): Trip[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    // Basic runtime validation and normalization
    const trips: Trip[] = parsed
      .filter((item): item is Trip => {
        return (
          item &&
          typeof item === "object" &&
          typeof item.id === "string" &&
          typeof item.createdAt === "string" &&
          typeof item.tripTitle === "string" &&
          typeof item.totalBudget === "string" &&
          Array.isArray(item.days)
        );
      })
      // Ensure descending order by createdAt
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));

    return trips;
  } catch {
    return [];
  }
}

export function persistTripToStorage(trip: Trip): void {
  if (!isBrowser()) return;

  const existing = readAllTripsFromStorage();

  // Deduplicate by id, then prepend newest
  const withoutDuplicate = existing.filter((t) => t.id !== trip.id);
  const updated = [trip, ...withoutDuplicate];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export interface PaginatedTripsResult {
  trips: Trip[];
  nextCursor: string | null;
}

/**
 * Cursor-based pagination over trips stored in localStorage.
 *
 * - Trips are sorted by createdAt desc.
 * - The cursor is the createdAt timestamp of the last item from the previous page.
 */
export function getTrips(cursor: string | undefined, limit: number): PaginatedTripsResult {
  if (!isBrowser()) {
    return { trips: [], nextCursor: null };
  }

  const allTrips = readAllTripsFromStorage();
  if (allTrips.length === 0) {
    return { trips: [], nextCursor: null };
  }

  let startIndex = 0;

  if (cursor) {
    // Find the first trip strictly older than the cursor timestamp
    const cursorIndex = allTrips.findIndex((trip) => trip.createdAt === cursor);
    if (cursorIndex >= 0) {
      startIndex = cursorIndex + 1;
    } else {
      // If cursor doesn't match exactly, fall back to first item older than cursor
      startIndex = allTrips.findIndex((trip) => trip.createdAt < cursor);
      if (startIndex < 0) {
        return { trips: [], nextCursor: null };
      }
    }
  }

  const page = allTrips.slice(startIndex, startIndex + limit);
  if (page.length === 0) {
    return { trips: [], nextCursor: null };
  }

  const lastTrip = page[page.length - 1];
  const lastIndex = allTrips.findIndex((t) => t.id === lastTrip.id);
  const hasMore = lastIndex < allTrips.length - 1;

  return {
    trips: page,
    nextCursor: hasMore ? lastTrip.createdAt : null,
  };
}

/**
 * Returns the most recently created trip from localStorage, or null if none.
 */
export function getLatestTrip(): Trip | null {
  const all = readAllTripsFromStorage();
  return all.length > 0 ? all[0] : null;
}


