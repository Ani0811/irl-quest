"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[IRL Quest Error Boundary]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0f0d] text-[#e5e7eb] p-6 text-center space-y-5">
      <div className="w-14 h-14 rounded-2xl bg-rose-950/40 border border-rose-900/60 flex items-center justify-center text-rose-400">
        <AlertCircle className="w-7 h-7" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          An Anomaly in the Digital Realm
        </h1>
        <p className="text-sm text-neutral-400 max-w-md">
          Something stumbled on the screen, but your real-world progress and journal are completely safe.
        </p>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-950"
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-5 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white font-medium text-sm transition"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
