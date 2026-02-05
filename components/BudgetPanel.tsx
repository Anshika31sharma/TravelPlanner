"use client";

import { motion } from "framer-motion";
import type { Trip } from "../types/trip";

interface BudgetPanelProps {
  trip: Trip | null;
}

function extractNumber(value: string): number {
  const match = value.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

export function BudgetPanel({ trip }: BudgetPanelProps) {
  if (!trip) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl sm:rounded-3xl border border-dashed border-slate-700/60 bg-slate-900/40 p-3 sm:p-4 text-[10px] sm:text-xs text-slate-500"
      >
        Generate a trip to see budget insights.
      </motion.div>
    );
  }

  const plannedBudget = extractNumber(trip.totalBudget);
  const estimatedSpend = trip.days.reduce((sum, day) => {
    return (
      sum +
      day.activities.reduce((inner, act) => inner + extractNumber(act.cost), 0)
    );
  }, 0);

  const overBy = estimatedSpend - plannedBudget;

  const statusLabel =
    plannedBudget === 0
      ? "Flexible budget"
      : overBy > 0
      ? "Slightly over planned"
      : "Within planned budget";

  const statusColor =
    plannedBudget === 0
      ? "text-slate-300"
      : overBy > 0
      ? "text-amber-300"
      : "text-emerald-300";

  const travel = trip.travelBreakdown;

  return (
    <motion.div
      className="space-y-2.5 sm:space-y-3 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/80 p-3 sm:p-4 shadow-lg shadow-black/40"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      {travel && (
        <div className="space-y-1.5 sm:space-y-2 rounded-xl sm:rounded-2xl bg-slate-900/80 p-2.5 sm:p-3">
          <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Getting there (approx)
          </p>
          <div className="space-y-1 sm:space-y-1.5 text-[10px] sm:text-[11px] text-slate-200">
            <div className="flex justify-between gap-2">
              <span className="text-slate-400">Flight</span>
              <span className="font-medium text-right break-words max-w-[55%]">{travel.flight}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-400">Train</span>
              <span className="font-medium">{travel.train}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-400">Bus</span>
              <span className="font-medium">{travel.bus}</span>
            </div>
            {travel.notes && (
              <p className="mt-1 sm:mt-1.5 border-t border-slate-700/60 pt-1 sm:pt-1.5 text-[9px] sm:text-[10px] text-slate-500">
                {travel.notes}
              </p>
            )}
          </div>
        </div>
      )}

      <div>
        <p className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Budget
        </p>
        <p className="mt-1.5 sm:mt-2 text-base sm:text-lg font-semibold text-slate-50">
          {trip.totalBudget || "Not specified"}
        </p>
        <p className={`mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] ${statusColor}`}>{statusLabel}</p>
      </div>

      <div className="space-y-1.5 sm:space-y-2 rounded-xl sm:rounded-2xl bg-slate-900/80 p-2.5 sm:p-3 text-[10px] sm:text-[11px] text-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Estimated spend</span>
          <span className="font-semibold">
            {estimatedSpend > 0 ? `~${estimatedSpend.toLocaleString()}` : "TBD"}
          </span>
        </div>
        {plannedBudget > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-slate-400">
              {overBy > 0 ? "Over by" : "Headroom"}
            </span>
            <span className="font-semibold">
              {Math.abs(overBy).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1 sm:space-y-2 text-[10px] sm:text-[11px] text-slate-400">
        <p className="font-medium text-slate-300">Tips</p>
        <ul className="space-y-0.5 sm:space-y-1 list-disc list-inside">
          <li>Swap paid activities with free local experiences if needed.</li>
          <li>Cluster spots to save commute costs and time.</li>
          <li>Lock stays early; treat activities as flex items.</li>
        </ul>
      </div>
    </motion.div>
  );
}

export default BudgetPanel;
