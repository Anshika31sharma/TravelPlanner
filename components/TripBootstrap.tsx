"use client";

import { useEffect } from "react";
import { useTripStore } from "../store/tripStore";
import { getLatestTrip } from "../lib/pagination";

export function TripBootstrap() {
  const { currentTrip, setTrip } = useTripStore();

  useEffect(() => {
    if (currentTrip) return;
    const latest = getLatestTrip();
    if (latest) {
      setTrip(latest);
    }
  }, [currentTrip, setTrip]);

  return null;
}

export default TripBootstrap;

