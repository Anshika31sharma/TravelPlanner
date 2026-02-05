"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface PromptBoxProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
}

const EXAMPLE_PROMPTS: string[] = [
  "3 days in Goa under 10000 with beaches, cafes, nightlife",
  "5-day solo trip to Himachal under 15000 with treks and hostels",
  "Weekend in Bangalore with rooftop bars, coffee spots, and co-working",
];

export function PromptBox({ onSubmit, isLoading }: PromptBoxProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isLoading) return;
    onSubmit(value.trim());
  };

  const handleExampleClick = (prompt: string) => {
    if (isLoading) return;
    setValue(prompt);
    onSubmit(prompt);
  };

  return (
    <div className="w-full max-w-2xl space-y-4 sm:space-y-6">
      <motion.form
        onSubmit={handleSubmit}
        className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-slate-900/80 p-3 sm:p-4 shadow-2xl backdrop-blur-xl transition-all duration-300"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder='e.g. "3 days in Goa under 10000 with beaches, cafes, nightlife"'
            className="min-h-[64px] sm:min-h-[72px] flex-1 resize-none rounded-xl sm:rounded-2xl border border-white/5 bg-slate-950/60 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/40 transition-all duration-200"
          />
          <motion.button
            type="submit"
            disabled={isLoading || !value.trim()}
            className="inline-flex w-full items-center justify-center rounded-xl sm:rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 px-4 py-2.5 sm:px-5 sm:py-4 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:shadow-violet-500/50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto shrink-0"
            whileHover={!isLoading && value.trim() ? { scale: 1.02 } : undefined}
            whileTap={!isLoading && value.trim() ? { scale: 0.98 } : undefined}
          >
            {isLoading ? "Planning..." : "Generate Trip"}
          </motion.button>
        </div>
        <p className="mt-1.5 sm:mt-1 text-[11px] sm:text-xs text-slate-500">
          Gen-Z mode: be as chaotic or specific as you want. We&apos;ll translate it into a clean itinerary.
        </p>
      </motion.form>

      <div className="space-y-2">
        <p className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Try something like
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((prompt, i) => (
            <motion.button
              key={prompt}
              type="button"
              disabled={isLoading}
              onClick={() => handleExampleClick(prompt)}
              className="group rounded-full border border-white/10 bg-slate-900/60 px-3 py-1.5 sm:px-4 sm:py-2 text-left text-[11px] sm:text-xs text-slate-200 shadow-sm transition hover:border-violet-400/70 hover:bg-slate-800/80 disabled:cursor-not-allowed disabled:opacity-60"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              whileHover={!isLoading ? { scale: 1.03, y: -2 } : undefined}
              whileTap={!isLoading ? { scale: 0.98 } : undefined}
            >
              <span className="block max-w-[200px] sm:max-w-[260px] truncate">
                {prompt}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PromptBox;
