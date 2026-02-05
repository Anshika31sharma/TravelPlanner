"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { TripDay } from "../types/trip";

interface DayTabsProps {
  days: TripDay[];
  selectedDay: number | null;
  onSelect: (dayNumber: number) => void;
}

export function DayTabs({ days, selectedDay, onSelect }: DayTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!days.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl sm:rounded-3xl border border-dashed border-slate-700/60 bg-slate-900/40 p-3 sm:p-4 text-[10px] sm:text-xs text-slate-500"
      >
        No days yet. Generate a trip from the landing page to see your itinerary here.
      </motion.div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      <p className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        Days
      </p>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-1 -mx-1 scrollbar-thin md:flex-col md:overflow-visible md:mx-0"
        style={{ scrollbarWidth: "thin" }}
      >
        {days.map((day, index) => {
          const isActive = day.day === selectedDay;
          return (
            <motion.button
              key={day.day}
              type="button"
              onClick={() => onSelect(day.day)}
              className={[
                "relative flex shrink-0 items-center justify-between gap-2 rounded-xl sm:rounded-2xl border px-2.5 py-2 sm:px-3 sm:py-2 text-left text-[10px] sm:text-xs transition min-w-[140px] sm:min-w-0 md:min-w-0",
                isActive
                  ? "border-violet-500/80 bg-violet-500/10 text-violet-100"
                  : "border-white/5 bg-slate-900/40 text-slate-200 hover:border-violet-500/40 hover:bg-slate-900/70",
              ].join(" ")}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04, duration: 0.2 }}
              whileHover={!isActive ? { x: 2 } : undefined}
              whileTap={{ scale: 0.98 }}
            >
              <div className="min-w-0 flex-1">
                <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em]">
                  Day {day.day}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[10px] sm:text-[11px] text-slate-400">
                  {day.title}
                </p>
              </div>
              <motion.span
                layoutId="day-pill"
                className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 rounded-lg sm:rounded-xl border border-white/10 bg-slate-950/70 text-[9px] sm:text-[10px] font-semibold text-slate-300 flex items-center justify-center"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                {day.activities.length}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default DayTabs;
