"use client";

import { create } from "zustand";
import type { Trip, TripActivity, TripDay } from "../types/trip";
import { persistTripToStorage } from "../lib/pagination";

interface TripState {
  currentTrip: Trip | null;
  isLoading: boolean;
  error: string | null;
  setTrip: (trip: Trip) => void;
  clearTrip: () => void;
  setLoading: (value: boolean) => void;
  setError: (message: string | null) => void;
  updateActivity: (
    dayNumber: number,
    activityIndex: number,
    patch: Partial<TripActivity>
  ) => void;
  replaceDay: (dayNumber: number, newDay: TripDay) => void;
}

export const useTripStore = create<TripState>((set) => ({
  currentTrip: null,
  isLoading: false,
  error: null,
  setTrip: (trip) => {
    persistTripToStorage(trip);
    set({ currentTrip: trip, error: null });
  },
  clearTrip: () => set({ currentTrip: null }),
  setLoading: (value) => set({ isLoading: value }),
  setError: (message) => set({ error: message }),
  updateActivity: (dayNumber, activityIndex, patch) =>
    set((state) => {
      if (!state.currentTrip) return state;

      const updatedDays = state.currentTrip.days.map((day) => {
        if (day.day !== dayNumber) return day;
        const updatedActivities = day.activities.map((activity, index) =>
          index === activityIndex ? { ...activity, ...patch } : activity
        );
        return { ...day, activities: updatedActivities };
      });

      const updatedTrip: Trip = {
        ...state.currentTrip,
        days: updatedDays,
      };

      persistTripToStorage(updatedTrip);

      return { ...state, currentTrip: updatedTrip };
    }),
  replaceDay: (dayNumber, newDay) =>
    set((state) => {
      if (!state.currentTrip) return state;

      const updatedDays = state.currentTrip.days.map((day) =>
        day.day === dayNumber ? newDay : day
      );

      const updatedTrip: Trip = {
        ...state.currentTrip,
        days: updatedDays,
      };

      persistTripToStorage(updatedTrip);

      return { ...state, currentTrip: updatedTrip };
    }),
}));

