import { describe, it, expect } from "vitest";
import { calculateUserStats, JournalEntry } from "../lib/storage/journal";

describe("Journal Storage & Stats Engine", () => {
  it("calculates zero stats when journal is empty", () => {
    const stats = calculateUserStats([]);
    expect(stats.totalQuests).toBe(0);
    expect(stats.totalMinutes).toBe(0);
    expect(stats.lastCompletedAt).toBeNull();
    expect(stats.categoryDistribution.nature).toBe(0);
    expect(stats.categoryDistribution.exploration).toBe(0);
  });

  it("accurately calculates aggregate statistics across multiple entries", () => {
    const mockEntries: JournalEntry[] = [
      {
        id: "1",
        completedAt: 1728300000000,
        actualDurationMinutes: 10,
        reflection: "Saw yellow lichen on stone.",
        quest: {
          title: "Stone Lichen",
          category: "nature",
          duration_minutes: 10,
          difficulty: "easy",
          objective: "Find yellow lichen.",
          rules: ["Put phone in pocket."],
          success_condition: "Locate lichen.",
          reflection_prompt: "How did it look?",
        },
      },
      {
        id: "2",
        completedAt: 1728310000000,
        actualDurationMinutes: 20,
        reflection: "Turned down a hidden alley.",
        quest: {
          title: "The Narrow Alley",
          category: "exploration",
          duration_minutes: 20,
          difficulty: "medium",
          objective: "Explore a new pathway.",
          rules: ["Stay on sidewalks."],
          success_condition: "Inspect an alley.",
          reflection_prompt: "What did you feel?",
        },
      },
      {
        id: "3",
        completedAt: 1728320000000,
        actualDurationMinutes: 5,
        reflection: "Noticed a long shadow.",
        quest: {
          title: "Evening Shadows",
          category: "observation",
          duration_minutes: 5,
          difficulty: "easy",
          objective: "Observe moving shadows.",
          rules: ["Keep screen dark."],
          success_condition: "Detect shadow shifts.",
          reflection_prompt: "How fast did it shift?",
        },
      },
    ];

    const stats = calculateUserStats(mockEntries);
    expect(stats.totalQuests).toBe(3);
    expect(stats.totalMinutes).toBe(35);
    expect(stats.lastCompletedAt).toBe(1728320000000);
    expect(stats.categoryDistribution.nature).toBe(1);
    expect(stats.categoryDistribution.exploration).toBe(1);
    expect(stats.categoryDistribution.observation).toBe(1);
    expect(stats.categoryDistribution.mindfulness).toBe(0);
  });
});
