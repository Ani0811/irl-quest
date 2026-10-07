"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getActiveQuest, clearActiveQuest, ActiveQuestState } from "@/lib/storage/activeQuest";
import { saveJournalEntry, JournalEntry } from "@/lib/storage/journal";
import { CheckCircle2, BookOpen, RotateCcw, Sparkles, ArrowRight } from "lucide-react";

export default function CompleteQuestPage() {
  const router = useRouter();
  const [questState, setQuestState] = useState<ActiveQuestState | null>(null);
  const [reflectionText, setReflectionText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const active = getActiveQuest();
    setQuestState(active);
  }, []);

  const handleSaveJournal = (skip = false) => {
    if (!questState) return;

    const entry: JournalEntry = {
      id: questState.id,
      quest: questState.quest,
      completedAt: Date.now(),
      actualDurationMinutes: questState.quest.duration_minutes,
      reflection: skip ? "(No reflection recorded)" : reflectionText.trim(),
    };

    saveJournalEntry(entry);
    clearActiveQuest();
    setSaved(true);
  };

  if (!questState && !saved) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0f0d] text-neutral-300 p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">No Active Mission Found</h2>
        <p className="text-sm text-neutral-400 max-w-sm">
          Start a micro-adventure from the home screen first!
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

  if (saved) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0f0d] text-neutral-300 p-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Mission Logged to Journal
          </h1>
          <p className="text-sm text-neutral-400 max-w-md">
            Your reflection and physical-world adventure have been securely archived in your local browser storage.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => router.push("/journal")}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
          >
            <BookOpen className="w-4 h-4" /> View in Journal
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white font-medium text-sm transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Start New Quest
          </button>
        </div>
      </div>
    );
  }

  const quest = questState!.quest;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0c0f0d] text-[#e5e7eb] px-4 py-8 sm:px-8">
      <main className="max-w-xl w-full mx-auto my-auto space-y-8 bg-[#111713] border border-[#1e2a22] rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* Completion Header */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Quest Complete
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome Back to Reality.
          </h1>
          <p className="text-sm text-neutral-400">
            You stepped away from the screen and explored the physical world.
          </p>
        </div>

        {/* Quest Summary Snippet */}
        <div className="p-4 rounded-2xl bg-[#141d17] border border-[#1d2720] space-y-1.5">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span className="uppercase tracking-wider text-emerald-400">
              {quest.category}
            </span>
            <span>{quest.duration_minutes} min duration</span>
          </div>
          <h3 className="text-base font-bold text-white">{quest.title}</h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {quest.objective}
          </p>
        </div>

        {/* Reflection Form */}
        <div className="space-y-3">
          <label className="block text-xs font-mono uppercase tracking-wider text-emerald-400">
            Reflection Prompt
          </label>
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-sm text-emerald-100 italic leading-relaxed">
            &ldquo;{quest.reflection_prompt}&rdquo;
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs text-neutral-400 font-medium">
              Your Observations (1–3 sentences)
            </label>
            <textarea
              rows={4}
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="What caught your eye? What textures, sounds, or unexpected details did you perceive?"
              className="w-full rounded-xl bg-[#0a0e0b] border border-[#1f2b23] focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80 text-sm text-white p-3.5 placeholder-neutral-600 outline-none transition resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => handleSaveJournal(false)}
            disabled={!reflectionText.trim()}
            className={`w-full sm:flex-1 py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
              reflectionText.trim()
                ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-950"
                : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Save to Journal
          </button>

          <button
            onClick={() => handleSaveJournal(true)}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white text-sm font-medium transition"
          >
            Skip Reflection
          </button>
        </div>
      </main>
    </div>
  );
}
