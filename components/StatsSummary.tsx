"use client";

import React from "react";
import { UserStats } from "@/lib/storage/journal";
import { CheckCircle2, Clock, Trees, Compass, Eye, Smile, Sparkles } from "lucide-react";
import { QuestCategory } from "@/lib/quests/schema";

interface StatsSummaryProps {
  stats: UserStats;
}

const CATEGORY_ICONS: Record<QuestCategory, React.ElementType> = {
  nature: Trees,
  exploration: Compass,
  observation: Eye,
  mindfulness: Smile,
  surprise: Sparkles,
};

export function StatsSummary({ stats }: StatsSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {/* Metric 1: Quests Completed */}
      <div className="bg-[#111713] border border-[#1b251f] rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            Missions Completed
          </span>
          <div className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            {stats.totalQuests}
          </div>
        </div>
      </div>

      {/* Metric 2: Total Outdoor Minutes */}
      <div className="bg-[#111713] border border-[#1b251f] rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            Time in Real World
          </span>
          <div className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            {stats.totalMinutes} <span className="text-sm font-medium text-neutral-400">min</span>
          </div>
        </div>
      </div>

      {/* Metric 3: Category Distribution */}
      <div className="bg-[#111713] border border-[#1b251f] rounded-2xl p-5 flex flex-col justify-center sm:col-span-2 lg:col-span-1">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
          Category Footprint
        </span>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(stats.categoryDistribution) as QuestCategory[]).map((cat) => {
            const count = stats.categoryDistribution[cat];
            const Icon = CATEGORY_ICONS[cat];
            return (
              <span
                key={cat}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                  count > 0
                    ? "bg-emerald-950/60 border-emerald-800/60 text-emerald-300"
                    : "bg-[#141b16] border-[#1d2720] text-neutral-500"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="capitalize">{cat}</span>
                <span className="font-mono font-bold text-[11px]">({count})</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
