"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ActiveQuestState, clearActiveQuest } from "@/lib/storage/activeQuest";
import { QuestTimer } from "./QuestTimer";
import { AlertTriangle, CheckCircle, ArrowLeft, Volume2 } from "lucide-react";
import { playQuestCompleteChime } from "@/lib/audio/chime";

interface TouchGrassModeProps {
  questState: ActiveQuestState;
}

export function TouchGrassMode({ questState }: TouchGrassModeProps) {
  const router = useRouter();
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);

  const handleComplete = () => {
    // Navigate to completion and reflection view
    router.push("/complete");
  };

  const handleAbandon = () => {
    clearActiveQuest();
    router.push("/");
  };

  const quest = questState.quest;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#050806] text-[#e5e7eb] px-4 py-6 sm:p-8 select-none">
      {/* Top Bar: Minimal Quest Metadata */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between text-xs border-b border-neutral-900 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            QUEST ACTIVE
          </span>
          <span className="text-neutral-600">•</span>
          <span className="capitalize text-neutral-400 font-mono">
            {quest.category}
          </span>
        </div>

        <button
          onClick={() => playQuestCompleteChime()}
          title="Test Chime"
          className="text-neutral-600 hover:text-emerald-400 transition p-1"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Centerpiece: The Anti-Screen Mandate */}
      <main className="max-w-xl w-full mx-auto my-auto flex flex-col items-center text-center space-y-8 py-8">
        {/* Urgent Call to Action */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase drop-shadow-sm">
            PUT YOUR PHONE AWAY.
          </h1>
          <p className="text-lg sm:text-xl font-medium text-emerald-400 tracking-wide">
            Go explore the physical world.
          </p>
        </div>

        {/* The Ambient Timer */}
        <QuestTimer
          targetEndTimestamp={questState.targetEndTimestamp}
          totalDurationSeconds={questState.totalDurationSeconds}
          onComplete={handleComplete}
        />

        {/* Mission Briefing Card */}
        <div className="w-full bg-[#090d0a] border border-[#141c16] rounded-2xl p-5 sm:p-6 text-left space-y-4 shadow-xl">
          <div>
            <span className="text-[11px] font-mono text-emerald-500/80 uppercase tracking-wider">
              Mission
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
              {quest.title}
            </h2>
            <p className="text-sm text-neutral-200 mt-2 font-medium leading-relaxed">
              {quest.objective}
            </p>
          </div>

          <div className="border-t border-[#131a15] pt-3">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-2">
              Rules of Engagement
            </h3>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              {quest.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Bottom Bar: Manual Override Controls */}
      <footer className="max-w-2xl w-full mx-auto pt-4 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {showAbandonConfirm ? (
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start bg-rose-950/30 border border-rose-900/50 p-2 rounded-xl text-rose-300">
            <span className="text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Abandon this quest?
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAbandon}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition"
              >
                Yes, Abandon
              </button>
              <button
                onClick={() => setShowAbandonConfirm(false)}
                className="px-2.5 py-1 rounded-lg text-neutral-400 hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAbandonConfirm(true)}
            className="text-neutral-500 hover:text-neutral-300 transition flex items-center gap-1 py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Abandon Quest
          </button>
        )}

        <button
          onClick={handleComplete}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-neutral-900 hover:bg-emerald-950/60 border border-neutral-800 hover:border-emerald-700/60 text-neutral-300 hover:text-emerald-200 transition font-medium flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          I&apos;ve Returned / Complete Early
        </button>
      </footer>
    </div>
  );
}
