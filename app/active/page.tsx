"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getActiveQuest, ActiveQuestState } from "@/lib/storage/activeQuest";
import { TouchGrassMode } from "@/components/TouchGrassMode";
import { Compass } from "lucide-react";

export default function ActiveQuestPage() {
  const router = useRouter();
  const [questState, setQuestState] = useState<ActiveQuestState | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const active = getActiveQuest();
    setQuestState(active);
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050806] text-neutral-400 font-mono text-sm">
        Loading quest state...
      </div>
    );
  }

  if (!questState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050806] text-neutral-300 p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400">
          <Compass className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">No Active Quest Found</h2>
        <p className="text-sm text-neutral-400 max-w-sm">
          You haven&apos;t started a quest yet. Configure your preferences and generate a mission to enter Touch Grass Mode.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition"
        >
          Return to Setup
        </button>
      </div>
    );
  }

  return <TouchGrassMode questState={questState} />;
}
