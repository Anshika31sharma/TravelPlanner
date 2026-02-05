"use client";

import { motion } from "framer-motion";
import type { TripActivity } from "../types/trip";

interface TimelineCardProps {
  activity: TripActivity;
  index: number;
  onChange: (patch: Partial<TripActivity>) => void;
}

export function TimelineCard({ activity, index, onChange }: TimelineCardProps) {
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
    activity.mapQuery || activity.place
  )}`;

  return (
    <motion.div
      className="group relative flex gap-2 sm:gap-3 rounded-2xl sm:rounded-3xl border border-white/5 bg-slate-900/70 p-3 sm:p-4 shadow-sm shadow-black/40 backdrop-blur transition-shadow hover:shadow-violet-500/5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.25,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -2 }}
    >
      <div className="flex flex-col items-center pt-0.5 sm:pt-1">
        <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {activity.time || "--:--"}
        </span>
        <div className="mt-1.5 sm:mt-2 flex flex-1 flex-col items-center">
          <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(129,140,248,0.9)]" />
          <div className="mt-1 h-full w-px flex-1 bg-gradient-to-b from-violet-500/60 via-violet-500/10 to-transparent" />
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            <input
              className="w-full rounded-lg sm:rounded-xl border border-transparent bg-transparent text-[11px] sm:text-xs font-semibold text-slate-100 outline-none focus:border-violet-500/60 focus:bg-slate-900/80 px-1 py-0.5"
              value={activity.place}
              placeholder="Activity"
              onChange={(e) =>
                onChange({
                  place: e.target.value,
                  mapQuery: activity.mapQuery || e.target.value,
                })
              }
            />
            <textarea
              className="mt-0.5 sm:mt-1 w-full resize-none rounded-lg sm:rounded-xl border border-transparent bg-transparent text-[10px] sm:text-[11px] leading-snug text-slate-400 outline-none focus:border-violet-500/60 focus:bg-slate-900/80 px-1 py-0.5"
              rows={2}
              value={activity.description}
              placeholder="Details. Edit freely."
              onChange={(e) => onChange({ description: e.target.value })}
            />
          </div>
          {activity.cost && (
            <input
              className="w-full sm:min-w-[72px] sm:max-w-[100px] rounded-full border border-transparent bg-slate-800/80 px-2 py-1 text-right text-[9px] sm:text-[10px] font-medium text-emerald-300 outline-none focus:border-emerald-400/60"
              value={activity.cost}
              placeholder="₹0"
              onChange={(e) => onChange({ cost: e.target.value })}
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px]">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-violet-500/40 bg-violet-500/5 px-2.5 py-0.5 sm:px-3 sm:py-1 font-medium text-violet-200 transition hover:border-violet-400 hover:bg-violet-500/20"
          >
            <span>Open in Maps</span>
          </a>
          {activity.photoSpot && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 sm:px-2.5 text-[9px] sm:text-[10px] font-medium text-amber-200">
              📷 Photo spot
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default TimelineCard;
