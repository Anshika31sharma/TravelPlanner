"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTripStore } from "../../store/tripStore";
import { useHistoryStore } from "../../store/historyStore";
import DayTabs from "../../components/DayTabs";
import TimelineCard from "../../components/TimelineCard";
import BudgetPanel from "../../components/BudgetPanel";
import { generateTrip } from "../../lib/ai";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function PlannerPage() {
  const router = useRouter();
  const { currentTrip, updateActivity, replaceDay, isLoading, setLoading, setError } =
    useTripStore();
  const { addTripToTop } = useHistoryStore();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    if (!currentTrip) {
      router.replace("/");
      return;
    }
    if (currentTrip.days.length && selectedDay === null) {
      setSelectedDay(currentTrip.days[0].day);
    }
  }, [currentTrip, router, selectedDay]);

  const activeDay = useMemo(() => {
    if (!currentTrip || selectedDay === null) return null;
    return currentTrip.days.find((d) => d.day === selectedDay) ?? null;
  }, [currentTrip, selectedDay]);

  const handleRegenerateDay = useCallback(async () => {
    if (!currentTrip || !activeDay) return;

    setError(null);
    setLoading(true);
    try {
      const regeneratedTrip = await generateTrip(currentTrip.prompt);
      const newDay =
        regeneratedTrip.days.find((d) => d.day === activeDay.day) ??
        regeneratedTrip.days[activeDay.day - 1];

      if (newDay) {
        replaceDay(activeDay.day, newDay);
        const updatedForHistory = {
          ...currentTrip,
          days: currentTrip.days.map((d) =>
            d.day === newDay.day ? newDay : d
          ),
        };
        addTripToTop(updatedForHistory);
      }
    } catch (err) {
      console.error(err);
      setError("Could not regenerate this day. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentTrip, activeDay, setError, setLoading, replaceDay, addTripToTop]);

  if (!currentTrip) {
    return null;
  }

  return (
    <motion.main
      className="flex flex-1 flex-col px-3 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-16"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <header className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4 pb-4 sm:pb-6">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            Your itinerary
          </p>
          <h1 className="mt-1 sm:mt-2 text-xl font-semibold text-slate-50 sm:text-2xl md:text-3xl truncate">
            {currentTrip.tripTitle}
          </h1>
          <p className="mt-0.5 sm:mt-1 max-w-xl text-[10px] sm:text-[11px] text-slate-400 line-clamp-2">
            {currentTrip.prompt}
          </p>
        </div>
        <motion.button
          type="button"
          onClick={() => router.push("/trips")}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-2 sm:px-4 text-[10px] sm:text-[11px] font-medium text-slate-200 transition hover:border-violet-400 hover:text-violet-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View trip history
        </motion.button>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-4 sm:gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)_minmax(0,1.1fr)]">
        <div className="order-2 md:order-1">
          <DayTabs
            days={currentTrip.days}
            selectedDay={selectedDay}
            onSelect={setSelectedDay}
          />
        </div>

        <div className="order-1 md:order-2 space-y-3 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/80 p-3 sm:p-4 shadow-lg shadow-black/40">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            <p className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Timeline
            </p>
            {activeDay && (
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[10px] sm:text-[11px] text-slate-400">
                  Day {activeDay.day} • {activeDay.activities.length} activities
                </p>
                <motion.button
                  type="button"
                  disabled={isLoading}
                  onClick={handleRegenerateDay}
                  className="inline-flex items-center gap-1 rounded-full border border-violet-500/50 bg-violet-600/10 px-2.5 py-1 sm:px-3 text-[9px] sm:text-[10px] font-medium text-violet-200 transition hover:border-violet-400 hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  whileHover={!isLoading ? { scale: 1.03 } : undefined}
                  whileTap={!isLoading ? { scale: 0.98 } : undefined}
                >
                  {isLoading ? "Regenerating..." : "Regenerate this day"}
                </motion.button>
              </div>
            )}
          </div>

          <div className="mt-3 space-y-2 sm:space-y-3">
            <AnimatePresence initial={false} mode="wait">
              {activeDay ? (
                <motion.div
                  key={activeDay.day}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="space-y-2 sm:space-y-3"
                >
                  {activeDay.activities.map((activity, index) => (
                    <TimelineCard
                      key={`${activity.time}-${activity.place}-${index}`}
                      activity={activity}
                      index={index}
                      onChange={(patch) =>
                        updateActivity(activeDay.day, index, patch)
                      }
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] sm:text-xs text-slate-500"
                >
                  Select a day from the left to view its timeline.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="order-3">
          <BudgetPanel trip={currentTrip} />
        </div>
      </section>
    </motion.main>
  );
}
