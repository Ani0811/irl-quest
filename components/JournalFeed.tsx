"use client";

import React, { useState } from "react";
import { JournalEntry } from "@/lib/storage/journal";
import { Trash2, Calendar, BookOpen, Quote, Sparkles } from "lucide-react";

interface JournalFeedProps {
  entries: JournalEntry[];
  onDelete: (id: string) => void;
}

export function JournalFeed({ entries, onDelete }: JournalFeedProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (entries.length === 0) {
    return (
      <div className="bg-[#111713] border border-[#1b251f] rounded-2xl p-10 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mx-auto">
          <BookOpen className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-white">Your Journal is Empty</h3>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
          When you complete a micro-adventure and enter your reflections, your physical-world discoveries will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => {
        const dateStr = new Date(entry.completedAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        const isConfirming = confirmDeleteId === entry.id;

        return (
          <article
            key={entry.id}
            className="bg-[#111713] border border-[#1b251f] rounded-2xl p-6 space-y-4 transition hover:border-[#26352c] shadow-lg"
          >
            {/* Header: Category Badge & Timestamp */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#18221b] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                  {entry.quest.category}
                </span>
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  {dateStr}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-[#161f19] border border-[#223026] text-neutral-400">
                  ⏱️ {entry.actualDurationMinutes || entry.quest.duration_minutes} min
                </span>

                {isConfirming ? (
                  <div className="flex items-center gap-1.5 bg-rose-950/40 border border-rose-900/60 px-2 py-0.5 rounded-lg text-rose-300">
                    <span className="text-[11px]">Delete?</span>
                    <button
                      onClick={() => {
                        onDelete(entry.id);
                        setConfirmDeleteId(null);
                      }}
                      className="font-bold text-rose-400 hover:text-white transition px-1"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-neutral-400 hover:text-white transition px-1"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(entry.id)}
                    title="Delete Entry"
                    className="text-neutral-600 hover:text-rose-400 transition p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Mission Details */}
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {entry.quest.title}
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                {entry.quest.objective}
              </p>
            </div>

            {/* User Reflection Block */}
            <div className="bg-[#0b0f0c] border border-[#17221a] rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-emerald-500/80">
                <Quote className="w-3 h-3" /> Discovery &bull; Reflection
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed italic">
                {entry.reflection}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
