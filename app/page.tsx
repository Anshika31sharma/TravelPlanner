"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PromptBox from "@/components/PromptBox";
import Loader from "@/components/Loader";
import HeroCollage from "@/components/HeroCollage";
import { generateTrip } from "../lib/ai";
import { useTripStore } from "../store/tripStore";
import { useHistoryStore } from "../store/historyStore";
import { persistTripToStorage } from "../lib/pagination";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const router = useRouter();
  const { setTrip, setLoading, setError, isLoading } = useTripStore();
  const { addTripToTop } = useHistoryStore();

  const handleGenerate = useCallback(
    async (prompt: string) => {
      setError(null);
      setLoading(true);
      try {
        const trip = await generateTrip(prompt);
        setTrip(trip);
        persistTripToStorage(trip);
        addTripToTop(trip);
        router.push("/planner");
      } catch (err) {
        console.error(err);
        setError("Something went wrong while generating your trip. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [setTrip, setLoading, setError, addTripToTop, router]
  );

  const { error } = useTripStore();

  return (
    <main className="flex flex-1 flex-col px-3 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-16 lg:py-10">
      <section className="mx-auto grid w-full max-w-6xl items-start gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <motion.div
          className="space-y-6 sm:space-y-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <header className="space-y-3 sm:space-y-4">
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1 text-[10px] sm:text-[11px] font-medium text-violet-100 shadow-sm shadow-violet-500/40"
            >
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              <span>Gen-Z Travel Studio</span>
            </motion.div>
            <div className="space-y-2">
              <motion.h1
                variants={item}
                className="bg-gradient-to-br from-slate-50 via-violet-200 to-fuchsia-300 bg-clip-text text-2xl font-semibold leading-tight text-transparent sm:text-3xl md:text-4xl lg:text-5xl"
              >
                Turn chaotic trip ideas
                <br />
                into a pinterest-worthy itinerary.
              </motion.h1>
              <motion.p
                variants={item}
                className="max-w-md text-xs sm:text-sm text-slate-400"
              >
                Type how you actually talk. We&apos;ll map it into days, vibes, and budgets—ready to
                share in the group chat.
              </motion.p>
            </div>
          </header>

          <motion.div variants={item}>
            <PromptBox onSubmit={handleGenerate} isLoading={isLoading} />
          </motion.div>
          {isLoading && (
            <motion.div variants={item}>
              <Loader />
            </motion.div>
          )}
          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-1 text-xs text-rose-400"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.div
            variants={item}
            className="flex items-center gap-3 text-[10px] sm:text-[11px] text-slate-500"
          >
            <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-slate-900/80 text-[10px] sm:text-[12px] text-slate-200">
              ✈️
            </span>
            <span>Plans live only in your browser – no sign-up, no spam, just vibes.</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative min-h-[200px] sm:min-h-[240px]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl sm:rounded-[2rem] border border-white/10 bg-slate-900/60 shadow-[0_0_60px_rgba(15,23,42,0.8)] sm:shadow-[0_0_80px_rgba(15,23,42,0.9)]" />
          <div className="relative m-1.5 sm:m-2 rounded-xl sm:rounded-[1.7rem] bg-slate-950/80 p-3 sm:p-4 shadow-2xl shadow-black/60">
            <div className="mb-3 sm:mb-4 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] text-slate-400">
              <span className="font-medium text-slate-100">Explore moods</span>
              <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] sm:text-[10px]">
                Click a mood → find spots near you
              </span>
            </div>
            <HeroCollage />
          </div>
        </motion.div>
      </section>
    </main>
  );
}
