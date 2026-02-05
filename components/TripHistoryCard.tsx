"use client";

import { motion } from "framer-motion";
import type { Trip } from "../types/trip";

interface TripHistoryCardProps {
  trip: Trip;
  index: number;
  onOpen: (trip: Trip) => void;
}

export function TripHistoryCard({ trip, index, onOpen }: TripHistoryCardProps) {
  const created = new Date(trip.createdAt);
  const formattedDate = created.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const daysCount = trip.days.length;

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(trip)}
      className="group flex w-full flex-col gap-1.5 sm:gap-2 rounded-2xl sm:rounded-3xl border border-white/5 bg-slate-950/70 p-3 sm:p-4 text-left shadow-sm shadow-black/40 transition hover:border-violet-500/60 hover:bg-slate-900/80"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
          <p className="text-[11px] sm:text-xs font-semibold text-slate-100 line-clamp-2">
            {trip.tripTitle}
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2">
            {trip.prompt}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-slate-900/70 px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-medium text-slate-300">
          {daysCount} day{daysCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-0.5 sm:mt-1 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
        <span>{trip.totalBudget || "Budget TBD"}</span>
        <span>{formattedDate}</span>
      </div>

      <div className="mt-1 sm:mt-2 flex items-center justify-between text-[10px] sm:text-[11px]">
        <span className="text-violet-300">Open itinerary</span>
        <span className="text-slate-500 group-hover:text-violet-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 inline-block">
          ↗
        </span>
      </div>
    </motion.button>
  );
}

export default TripHistoryCard;
