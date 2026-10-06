"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  TreePine,
  Eye,
  Smile,
  Sparkles,
  Clock,
  Gauge,
  ShieldCheck,
  Cpu,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { QuestCategory, QuestDuration, QuestDifficulty, QuestResponse } from "@/lib/quests/schema";

interface HealthStatus {
  connected: boolean;
  provider?: string;
  endpoint?: string;
  models?: string[];
  message?: string;
}

interface GenerateResponse {
  quest: QuestResponse;
  source: string;
  model?: string;
  notice?: string;
  error?: string;
}

const CATEGORIES: {
  id: QuestCategory;
  label: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  {
    id: "nature",
    label: "Nature",
    desc: "Flora, textures, weather, natural elements",
    icon: TreePine,
  },
  {
    id: "exploration",
    label: "Exploration",
    desc: "Unfamiliar corners, streets, paths",
    icon: Compass,
  },
  {
    id: "observation",
    label: "Observation",
    desc: "Patterns, shadows, colors in plain sight",
    icon: Eye,
  },
  {
    id: "mindfulness",
    label: "Mindfulness",
    desc: "Sound horizons, breath, sensory presence",
    icon: Smile,
  },
  {
    id: "surprise",
    label: "Surprise",
    desc: "Serendipitous & thought-provoking prompts",
    icon: Sparkles,
  },
];

const DURATIONS: QuestDuration[] = [5, 10, 20, 30];
const DIFFICULTIES: { id: QuestDifficulty; label: string }[] = [
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
];

export default function HomePage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(true);

  const [category, setCategory] = useState<QuestCategory>("exploration");
  const [duration, setDuration] = useState<QuestDuration>(10);
  const [difficulty, setDifficulty] = useState<QuestDifficulty>("easy");

  const [generating, setGenerating] = useState<boolean>(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showJson, setShowJson] = useState<boolean>(false);

  // Check LM Studio health on mount
  const checkHealth = async () => {
    setHealthLoading(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealth(data);
    } catch {
      setHealth({
        connected: false,
        message: "Could not connect to /api/health endpoint",
      });
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch("/api/quest/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          duration_minutes: duration,
          difficulty,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate quest");
      }

      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0f0d] text-[#e5e7eb]">
      {/* Top Header */}
      <header className="border-b border-[#1b241f] bg-[#0f1411]/90 backdrop-blur sticky top-0 z-50 px-4 py-3 sm:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-lg tracking-tight text-white">
                  IRL Quest
                </h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300">
                  Day 1 Gate: Foundation
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                AI that gives you a reason to put your phone down
              </p>
            </div>
          </div>

          {/* Local LM Studio Status Badge */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono w-full sm:w-auto justify-between sm:justify-start ${
                health?.connected
                  ? "bg-emerald-950/40 border-emerald-800/50 text-emerald-300"
                  : "bg-amber-950/30 border-amber-800/40 text-amber-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    health?.connected
                      ? "bg-emerald-400 animate-pulse"
                      : "bg-amber-400"
                  }`}
                />
                <span>
                  {healthLoading
                    ? "Checking Local AI..."
                    : health?.connected
                    ? `LM Studio Active (${
                        health.models?.[0]?.split("/").pop() || "Loaded Model"
                      })`
                    : "LM Studio Offline (Catalog Mode)"}
                </span>
              </div>

              <button
                onClick={checkHealth}
                title="Refresh connection"
                disabled={healthLoading}
                className="hover:text-white transition p-0.5 ml-1"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    healthLoading ? "animate-spin text-neutral-400" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Day 1 Setup & Architecture Banner */}
        <div className="p-4 rounded-xl border border-[#1e2a22] bg-[#121814] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 uppercase tracking-wider">
              <Cpu className="w-4 h-4" /> Local-First Sovereign Inference
            </div>
            <p className="text-sm text-neutral-300">
              Quests are generated on your local machine via{" "}
              <code className="font-mono text-emerald-300 text-xs bg-emerald-950/60 px-1 py-0.5 rounded border border-emerald-900">
                http://localhost:1234/v1
              </code>
              . When offline or unlaunched, verified safe catalog quests ensure uninterrupted development.
            </p>
          </div>

          <a
            href="https://lmstudio.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white border border-[#233128] hover:border-emerald-600/50 bg-[#151d18] px-3 py-1.5 rounded-lg transition whitespace-nowrap"
          >
            LM Studio Setup <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Quest Setup Form */}
        <section className="space-y-6 bg-[#111713] border border-[#1b251f] rounded-2xl p-6 sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              Configure Micro-Adventure
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Define the physical-world parameters for your upcoming outdoor mission.
            </p>
          </div>

          {/* Category Picker */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              1. Quest Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between h-24 ${
                      isSelected
                        ? "bg-emerald-950/50 border-emerald-500/60 text-white shadow-sm shadow-emerald-950"
                        : "bg-[#141b16] border-[#1d2720] text-neutral-400 hover:border-[#2a382e] hover:text-neutral-200"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-sm text-neutral-200">
                        {cat.label}
                      </span>
                      <Icon
                        className={`w-4 h-4 ${
                          isSelected ? "text-emerald-400" : "text-neutral-500"
                        }`}
                      />
                    </div>
                    <span className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                      {cat.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration & Difficulty Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-500" /> 2. Target Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-2 rounded-lg text-xs font-medium border text-center transition ${
                      duration === d
                        ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-200"
                        : "bg-[#141b16] border-[#1d2720] text-neutral-400 hover:border-[#2a382e] hover:text-neutral-200"
                    }`}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-neutral-500" /> 3. Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => setDifficulty(diff.id)}
                    className={`py-2 rounded-lg text-xs font-medium border text-center transition ${
                      difficulty === diff.id
                        ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-200"
                        : "bg-[#141b16] border-[#1d2720] text-neutral-400 hover:border-[#2a382e] hover:text-neutral-200"
                    }`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#1a231d]">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Deterministic Safety Inspection Active (Regex Hazard Filter)
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 ${
                generating
                  ? "bg-emerald-800/50 text-neutral-300 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-400 text-[#0c0f0d] font-semibold shadow-lg shadow-emerald-950"
              }`}
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Local Quest...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Structured Quest
                </>
              )}
            </button>
          </div>
        </section>

        {/* Error Notice */}
        {errorMsg && (
          <div className="p-4 rounded-xl border border-rose-900/40 bg-rose-950/20 text-rose-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Generation Error</p>
              <p className="text-xs text-rose-300/80 mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Generated Quest Output Card */}
        {result?.quest && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-medium text-neutral-200">
                  Generated Quest
                </span>
                <span className="text-neutral-500">•</span>
                <span className="font-mono text-emerald-400">
                  {result.source === "local-open-weight-ai"
                    ? `Local Model (${result.model || "LM Studio"})`
                    : "Deterministic Safe Fallback Pool"}
                </span>
              </div>
            </div>

            <div className="bg-[#111713] border border-[#1e2a22] rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1b251f] pb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-900/60 px-2.5 py-1 rounded-full">
                    {result.quest.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white tracking-tight mt-2">
                    {result.quest.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
                  <span className="px-2.5 py-1 rounded-md bg-[#161f19] border border-[#223026]">
                    ⏱️ {result.quest.duration_minutes} min
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#161f19] border border-[#223026] capitalize">
                    ⚡ {result.quest.difficulty}
                  </span>
                </div>
              </div>

              {/* Objective */}
              <div className="space-y-1.5">
                <h4 className="text-xs uppercase font-medium tracking-wider text-neutral-400">
                  Core Mission Objective
                </h4>
                <p className="text-base sm:text-lg text-emerald-100 font-medium leading-relaxed">
                  {result.quest.objective}
                </p>
              </div>

              {/* Rules & Success Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[#1a231d]">
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-medium tracking-wider text-neutral-400">
                    Rules of Engagement
                  </h4>
                  <ul className="space-y-1.5 text-xs text-neutral-300">
                    {result.quest.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-medium tracking-wider text-neutral-400">
                    Completion Signal
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed bg-[#141b16] p-3 rounded-xl border border-[#1e2721]">
                    {result.quest.success_condition}
                  </p>
                </div>
              </div>

              {/* Reflection Prompt Preview */}
              <div className="bg-emerald-950/30 border border-emerald-900/40 rounded-xl p-4">
                <h4 className="text-xs uppercase font-medium tracking-wider text-emerald-400">
                  Post-Quest Reflection Preview
                </h4>
                <p className="text-xs sm:text-sm text-neutral-200 mt-1 italic">
                  &ldquo;{result.quest.reflection_prompt}&rdquo;
                </p>
              </div>

              {/* Notice if any */}
              {result.notice && (
                <p className="text-xs text-amber-400/90 italic bg-amber-950/20 border border-amber-900/40 p-2.5 rounded-lg">
                  ℹ️ {result.notice}
                </p>
              )}
            </div>

            {/* Structured JSON Inspector Toggle */}
            <div className="border border-[#1b251f] bg-[#0e1310] rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowJson(!showJson)}
                className="w-full px-4 py-2.5 text-xs font-mono text-neutral-400 hover:text-neutral-200 flex items-center justify-between transition"
              >
                <span>🔍 Day 1 Structured JSON Data Contract Inspector</span>
                {showJson ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showJson && (
                <div className="p-4 border-t border-[#1b251f] bg-[#090c0a]">
                  <pre className="font-mono text-[11px] text-emerald-400/90 overflow-x-auto leading-relaxed">
                    {JSON.stringify(result.quest, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#19211c] py-6 px-4 text-center text-xs text-neutral-400 space-y-1">
        <p>
          <strong className="text-neutral-300">IRL Quest</strong> — Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass
        </p>
        <p className="text-neutral-400 text-[11px]">
          MIT Licensed • Sovereign Local Open-Weight Intelligence • 100% Zero-Cloud Storage
        </p>
      </footer>
    </div>
  );
}
