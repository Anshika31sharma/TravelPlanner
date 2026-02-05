"use client";

import { create } from "zustand";
import type { Trip } from "../types/trip";

export interface HistoryState {
  trips: Trip[];
  hasMore: boolean;
  /**
   * Cursor representing the createdAt timestamp of the last loaded trip.
   * Used for subsequent pagination calls.
   */
  nextCursor: string | null;
  isFetching: boolean;
  setInitialPage: (trips: Trip[], nextCursor: string | null) => void;
  appendPage: (trips: Trip[], nextCursor: string | null) => void;
  addTripToTop: (trip: Trip) => void;
  resetHistory: () => void;
  setIsFetching: (value: boolean) => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  trips: [],
  hasMore: true,
  nextCursor: null,
  isFetching: false,

  setInitialPage: (trips, nextCursor) =>
    set({
      trips,
      nextCursor,
      hasMore: Boolean(nextCursor),
    }),

  appendPage: (trips, nextCursor) =>
    set((state) => ({
      trips: [...state.trips, ...trips],
      nextCursor,
      hasMore: Boolean(nextCursor),
    })),

  addTripToTop: (trip) =>
    set((state) => {
      const existingIndex = state.trips.findIndex((t) => t.id === trip.id);
      const withoutDuplicate =
        existingIndex >= 0
          ? [
              trip,
              ...state.trips.slice(0, existingIndex),
              ...state.trips.slice(existingIndex + 1),
            ]
          : [trip, ...state.trips];

      return {
        trips: withoutDuplicate,
      };
    }),

  resetHistory: () =>
    set({
      trips: [],
      hasMore: true,
      nextCursor: null,
    }),

  setIsFetching: (value) => set({ isFetching: value }),
}));

