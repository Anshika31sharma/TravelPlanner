import "./globals.css";
import type { Metadata } from "next";
import TripBootstrap from "../components/TripBootstrap";

export const metadata: Metadata = {
  title: "Travel Planner",
  description:
    "Gen-Z native travel planner that turns chaotic prompts into clean itineraries.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-full bg-slate-950 text-slate-50 antialiased">
        <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 overflow-x-hidden">
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-40 top-[-10%] h-72 w-72 rounded-full bg-violet-500/15 blur-3xl animate-pulse-slow" />
            <div className="absolute right-[-10%] top-1/3 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
          </div>
          <TripBootstrap />
          {children}
        </div>
      </body>
    </html>
  );
}

