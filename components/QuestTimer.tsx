"use client";

import React, { useState, useEffect, useRef } from "react";
import { playQuestCompleteChime } from "@/lib/audio/chime";

interface QuestTimerProps {
  targetEndTimestamp: number;
  totalDurationSeconds: number;
  onComplete: () => void;
}

export function QuestTimer({
  targetEndTimestamp,
  totalDurationSeconds,
  onComplete,
}: QuestTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() =>
    Math.max(0, Math.floor((targetEndTimestamp - Date.now()) / 1000))
  );

  const completedRef = useRef<boolean>(false);

  useEffect(() => {
    const updateTimer = () => {
      const diff = Math.max(
        0,
        Math.floor((targetEndTimestamp - Date.now()) / 1000)
      );
      setRemainingSeconds(diff);

      if (diff <= 0 && !completedRef.current) {
        completedRef.current = true;
        playQuestCompleteChime();
        onComplete();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 500);

    return () => clearInterval(interval);
  }, [targetEndTimestamp, onComplete]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  // Progress percentage (100% -> 0%)
  const progressPercent = totalDurationSeconds > 0
    ? Math.min(100, Math.max(0, (remainingSeconds / totalDurationSeconds) * 100))
    : 0;

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-4">
      {/* Ambient Countdown Display */}
      <div className="relative flex items-center justify-center">
        <div className="text-6xl sm:text-7xl md:text-8xl font-mono font-bold tracking-tight text-white tabular-nums drop-shadow-[0_0_25px_rgba(16,185,129,0.15)]">
          {formattedTime}
        </div>
      </div>

      {/* Minimalist Progress Line */}
      <div className="w-48 sm:w-64 h-1 bg-neutral-800/80 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-500 ease-linear rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="text-xs font-mono text-neutral-400 tracking-wider uppercase">
        {remainingSeconds > 0 ? "Mission Countdown Active" : "Time Elapsed"}
      </p>
    </div>
  );
}
