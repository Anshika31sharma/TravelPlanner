import { v4 as uuidv4 } from "uuid";
import type { RawAiTripResponse, Trip, TripActivity, TripDay } from "../types/trip";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function safeParseJson(input: string): unknown | null {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

function coerceActivities(raw: unknown): TripActivity[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      if (!isRecord(item)) return null;
      return {
        time: String(item.time ?? ""),
        place: String(item.place ?? ""),
        description: String(item.description ?? ""),
        cost: String(item.cost ?? ""),
        mapQuery: String(item.mapQuery ?? item.place ?? ""),
      } satisfies TripActivity;
    })
    .filter((a): a is TripActivity => !!a);
}

function coerceDays(raw: unknown): TripDay[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      if (!isRecord(item)) return null;
      const dayNumber = Number(item.day ?? 0) || 0;

      return {
        day: dayNumber,
        title: String(item.title ?? `Day ${dayNumber || ""}`.trim()),
        activities: coerceActivities(item.activities),
      } satisfies TripDay;
    })
    .filter((d): d is TripDay => !!d);
}

export function normalizeAiTripResponse(
  raw: unknown,
  opts: { prompt: string }
): Trip {
  const now = new Date().toISOString();

  if (!isRecord(raw)) {
    return {
      id: uuidv4(),
      createdAt: now,
      prompt: opts.prompt,
      tripTitle: "Untitled Trip",
      totalBudget: "",
      days: [],
    };
  }

  const base = raw as Partial<RawAiTripResponse>;

  const days = coerceDays(base.days);

  const trip: Trip = {
    id: uuidv4(),
    createdAt: now,
    prompt: opts.prompt,
    tripTitle: base.tripTitle || "Untitled Trip",
    totalBudget: base.totalBudget || "",
    days,
  };

  return trip;
}

