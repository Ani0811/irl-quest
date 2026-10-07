"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getJournalEntries,
  deleteJournalEntry,
  clearJournal,
  calculateUserStats,
  exportJournalAsJson,
  JournalEntry,
} from "@/lib/storage/journal";
import { StatsSummary } from "@/components/StatsSummary";
import { JournalFeed } from "@/components/JournalFeed";
import { ArrowLeft, Download, Trash2, Compass, AlertCircle } from "lucide-react";

export default function JournalPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const loadedEntries = getJournalEntries();
    setEntries(loadedEntries);
    setLoaded(true);
  }, []);

  const handleDelete = (id: string) => {
    const updated = deleteJournalEntry(id);
    setEntries(updated);
  };

  const handleClearAll = () => {
    clearJournal();
    setEntries([]);
    setShowClearConfirm(false);
  };

  const stats = calculateUserStats(entries);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0f0d] text-neutral-400 font-mono text-sm">
        Loading Journal...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0f0d] text-[#e5e7eb]">
      {/* Top Header */}
      <header className="border-b border-[#1b241f] bg-[#0f1411]/90 backdrop-blur sticky top-0 z-50 px-4 py-3.5 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Quests
          </button>

          <div className="flex items-center gap-2">
            {entries.length > 0 && (
              <>
                <button
                  onClick={exportJournalAsJson}
                  className="px-3 py-1.5 rounded-lg border border-[#233128] hover:border-emerald-600/50 bg-[#141b16] hover:bg-[#1a241d] text-xs font-medium text-neutral-300 hover:text-white transition flex items-center gap-1.5"
                  title="Download full JSON backup of your journal"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export JSON</span>
                </button>

                {showClearConfirm ? (
                  <div className="flex items-center gap-1.5 bg-rose-950/40 border border-rose-900/60 px-2 py-1 rounded-lg text-rose-300 text-xs">
                    <span>Clear all?</span>
                    <button
                      onClick={handleClearAll}
                      className="font-bold text-rose-400 hover:text-white transition px-1"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="text-neutral-400 hover:text-white transition px-1"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="p-1.5 rounded-lg border border-[#233128] hover:border-rose-900/60 bg-[#141b16] text-neutral-500 hover:text-rose-400 transition"
                    title="Clear entire journal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Title & Privacy Context */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
            <span>📓</span> Sovereign Local Journal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your Real-World Adventures
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            All observations, timestamps, and reflections are preserved 100% locally in your browser. Zero cloud synchronization.
          </p>
        </div>

        {/* Minimalist Stats Summary */}
        <section className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            Activity Overview
          </h2>
          <StatsSummary stats={stats} />
        </section>

        {/* Journal Feed */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Recorded Micro-Adventures ({entries.length})
            </h2>
            {entries.length > 0 && (
              <span className="text-xs text-neutral-500 font-mono">
                Sorted newest first
              </span>
            )}
          </div>

          <JournalFeed entries={entries} onDelete={handleDelete} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#19211c] py-6 px-4 text-center text-xs text-neutral-400">
        <p>
          <strong className="text-neutral-300">IRL Quest</strong> — Physical-world exploration logged locally.
        </p>
      </footer>
    </div>
  );
}
