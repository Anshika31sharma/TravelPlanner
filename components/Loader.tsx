"use client";

import { motion } from "framer-motion";

export function Loader() {
  return (
    <motion.div
      className="flex w-full max-w-2xl flex-col gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <motion.span
          className="inline-flex h-2 w-2 rounded-full bg-emerald-400"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
       We are crafting your itinerary
      </div>

      <div className="grid gap-2 sm:gap-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-14 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r from-slate-800/60 via-slate-900/40 to-slate-800/60"
            initial={{ opacity: 0.4, x: -12 }}
            animate={{ opacity: [0.6, 1, 0.6], x: [0, 4, 0] }}
            transition={{
              delay: i * 0.15,
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.4,
            }}
          >
            <div className="flex h-full items-center gap-3 sm:gap-4 px-3 sm:px-4">
              <motion.span
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-slate-700/60"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
              />
              <div className="flex-1 space-y-2">
                <span className="block h-2 w-20 sm:w-24 rounded-full bg-slate-700/60" />
                <span className="block h-2 w-32 sm:w-40 rounded-full bg-slate-700/40" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Loader;
