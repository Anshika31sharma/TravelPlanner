"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MOOD_TAGS: Record<number, string> = {
  0: "beach ∙ food ∙ sunsets",
  1: "rooftops ∙ clubs",
  2: "matcha ∙ wifi ∙ chill",
  3: "treks ∙ views ∙ air",
  4: "romantic ∙ dinner ∙ views",
  5: "monuments ∙ heritage",
  6: "temples ∙ peace ∙ darshan",
  7: "views ∙ nature ∙ pics",
};

const cards = [
  {
    id: "beach",
    label: "Beach days",
    searchQuery: "beaches",
    image:
      "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJlYWNofGVufDB8fDB8fHww",
  },
  {
    id: "city",
    label: "City nights",
    searchQuery: "nightlife rooftop bars",
    image:
      "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG5pZ2h0JTIwY2l0eXxlbnwwfDB8MHx8fDA%3D",
  },
  {
    id: "cafe",
    label: "Café hopping",
    searchQuery: "cafes coffee",
    image:
      "https://images.unsplash.com/photo-1652180126225-403b102484b0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3V0ZSUyMGNhZmVzfGVufDB8MHwwfHx8MA%3D%3D",
  },
  {
    id: "mountain",
    label: "Mountain treks",
    searchQuery: "trekking hiking",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW5zfGVufDB8MHwwfHx8MA%3D%3D",
  },
  {
    id: "date",
    label: "Date night",
    searchQuery: "romantic dinner restaurants",
    image:
      "https://plus.unsplash.com/premium_photo-1661724211648-26005ccb34a6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjV8fHJvbWFudGljJTIwZGlubmVyJTIwbmlnaHR8ZW58MHwwfDB8fHww",
  },
  {
    id: "architectural",
    label: "Architectural",
    searchQuery: "heritage monuments architecture",
    image:
      "https://plus.unsplash.com/premium_photo-1661963200491-c9e52f12de89?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "holy",
    label: "Holy & temples",
    searchQuery: "temples religious places",
    image:
      "https://plus.unsplash.com/premium_photo-1697730353332-5584bed18fdf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDMyfHx8ZW58MHx8fHx8",
  },
  {
    id: "scenic",
    label: "Scenic spots",
    searchQuery: "scenic viewpoints photography",
    image:
      "https://images.unsplash.com/photo-1764344859522-c38af2e61127?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNjZW5pYyUyMHNwb3RzfGVufDB8MHwwfHx8MA%3D%3D",
  },
];

export function HeroCollage() {
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loadingCard, setLoadingCard] = useState<string | null>(null);

  const handleMoodClick = useCallback(
    (card: (typeof cards)[0]) => {
      setLocationError(null);
      setLoadingCard(card.id);

      if (!navigator.geolocation) {
        setLocationError("Location is not supported by your browser.");
        setLoadingCard(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://www.google.com/maps/search/${encodeURIComponent(card.searchQuery)}/@${latitude},${longitude},12z`;
          window.open(url, "_blank", "noopener,noreferrer");
          setLoadingCard(null);
        },
        (err) => {
          setLoadingCard(null);
          if (err.code === err.PERMISSION_DENIED) {
            setLocationError(`Turn on location to see ${card.searchQuery} near you. Allow location access and try again.`);
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            setLocationError("Location unavailable. Please turn on location and try again.");
          } else {
            setLocationError("Could not get your location. Please turn on location and try again.");
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    },
    []
  );

  return (
    <div className="relative h-full w-full min-h-[200px] sm:min-h-[240px] md:min-h-[280px]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.35),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(248,113,113,0.35),_transparent_55%)]" />

      <AnimatePresence mode="wait">
        {locationError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="mb-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-[11px] text-amber-200"
          >
            <p className="font-medium">Location needed</p>
            <p className="mt-0.5 text-amber-200/90">{locationError}</p>
            <button
              type="button"
              onClick={() => setLocationError(null)}
              className="mt-2 rounded-full bg-amber-500/20 px-2.5 py-1 text-[10px] font-medium hover:bg-amber-500/30 active:scale-95 transition"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 h-full w-full">
        {cards.map((card, index) => (
          <motion.button
            key={card.id}
            type="button"
            onClick={() => handleMoodClick(card)}
            disabled={!!loadingCard}
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-slate-900/60 text-left shadow-xl shadow-black/40 backdrop-blur focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-70 transition-shadow hover:shadow-violet-500/10"
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.05 + index * 0.05,
              duration: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            whileHover={!loadingCard ? { scale: 1.04, y: -6, transition: { duration: 0.2 } } : undefined}
            whileTap={!loadingCard ? { scale: 0.97, transition: { duration: 0.1 } } : undefined}
          >
            <div className="relative h-20 w-full sm:h-24 md:h-32">
              <img
                src={card.image}
                alt={card.label}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              {loadingCard === card.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm"
                >
                  <span className="flex items-center gap-2 text-xs font-medium text-slate-200">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
                    Getting location…
                  </span>
                </motion.div>
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-0.5 px-2 py-1.5 sm:px-3 sm:pb-2">
              <p className="rounded-full bg-slate-950/80 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-slate-100 shadow-md line-clamp-1">
                {card.label}
              </p>
              <span className="hidden sm:inline text-[5px] md:text-[6px] uppercase tracking-[0.15em] text-slate-400">
                {MOOD_TAGS[index]}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default HeroCollage;
