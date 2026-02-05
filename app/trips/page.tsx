"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import TripHistoryCard from "../../components/TripHistoryCard";
import { useHistoryStore } from "../../store/historyStore";
import { useTripStore } from "../../store/tripStore";
import { getTrips } from "../../lib/pagination";

const PAGE_SIZE = 10;

export default function TripsPage() {
  const router = useRouter();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const {
    trips,
    hasMore,
    nextCursor,
    setInitialPage,
    appendPage,
    isFetching,
    setIsFetching,
  } = useHistoryStore();
  const { setTrip } = useTripStore();

  useEffect(() => {
    if (!trips.length) {
      const { trips: firstTrips, nextCursor: cursor } = getTrips(undefined, PAGE_SIZE);
      setInitialPage(firstTrips, cursor);
    }
  }, [trips.length, setInitialPage]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isFetching && hasMore) {
          setIsFetching(true);
          const { trips: pageTrips, nextCursor: cursor } = getTrips(nextCursor || undefined, PAGE_SIZE);
          appendPage(pageTrips, cursor);
          setIsFetching(false);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [appendPage, hasMore, isFetching, nextCursor, setIsFetching]);

  const handleOpenTrip = (trip: (typeof trips)[number]) => {
    setTrip(trip);
    router.push("/planner");
  };

  return (
    <motion.main
      className="flex flex-1 flex-col px-3 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-16"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <header className="mx-auto flex w-full max-w-5xl flex-col gap-2 pb-4 sm:pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            Trip history
          </p>
          <h1 className="mt-1 sm:mt-2 text-xl font-semibold text-slate-50 sm:text-2xl md:text-3xl">
            Your saved itineraries
          </h1>
          <p className="mt-0.5 sm:mt-1 max-w-xl text-[10px] sm:text-[11px] text-slate-400">
            Every generated trip is cached locally on this device so you can revisit and tweak later.
          </p>
        </div>
        <motion.button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-2 sm:px-4 text-[10px] sm:text-[11px] font-medium text-slate-200 transition hover:border-violet-400 hover:text-violet-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          New trip
        </motion.button>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-3 sm:gap-4">
        {trips.length === 0 && !hasMore ? (
          <p className="text-[10px] sm:text-xs text-slate-500">
            No trips yet. Generate your first itinerary from the home page.
          </p>
        ) : (
          <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
            {trips.map((trip, index) => (
              <TripHistoryCard
                key={trip.id}
                trip={trip}
                index={index}
                onOpen={handleOpenTrip}
              />
            ))}
          </div>
        )}

        <div ref={sentinelRef} className="h-6 sm:h-8 w-full" />

        <AnimatePresence mode="wait">
          {isFetching && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-[10px] sm:text-[11px] text-slate-500"
            >
              Loading more trips...
            </motion.p>
          )}
        </AnimatePresence>
        {!hasMore && trips.length > 0 && (
          <p className="text-center text-[10px] sm:text-[11px] text-slate-500">
            You&apos;re all caught up.
          </p>
        )}
      </section>
    </motion.main>
  );
}
