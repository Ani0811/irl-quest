import { describe, it, expect } from "vitest";
import { QuestResponseSchema, QuestRequestSchema } from "../lib/quests/schema";

describe("Quest Schema Validation", () => {
  const validQuest = {
    title: "The Palette of Earth",
    category: "nature",
    duration_minutes: 10,
    difficulty: "easy",
    objective: "Find five distinctly different shades of natural green and two unique organic textures without picking any living foliage.",
    rules: [
      "Keep your device in your pocket for the duration.",
      "Do not pull, break, or remove leaves or flowers.",
      "Inspect textures using gentle fingertips only."
    ],
    success_condition: "Mentally identify five distinct greens and two unique leaf or bark textures.",
    reflection_prompt: "Which green hue was the most unexpected, and where did you find it?"
  };

  it("accepts a completely valid quest payload", () => {
    const result = QuestResponseSchema.safeParse(validQuest);
    expect(result.success).toBe(true);
  });

  it("accepts all valid categories", () => {
    const categories = ["nature", "exploration", "observation", "mindfulness", "surprise"];
    for (const cat of categories) {
      const q = { ...validQuest, category: cat };
      expect(QuestResponseSchema.safeParse(q).success).toBe(true);
    }
  });

  it("accepts all valid durations (5, 10, 20, 30)", () => {
    const durations = [5, 10, 20, 30];
    for (const d of durations) {
      const q = { ...validQuest, duration_minutes: d };
      expect(QuestResponseSchema.safeParse(q).success).toBe(true);
    }
  });

  it("rejects an invalid duration (e.g., 15 or 45)", () => {
    const q = { ...validQuest, duration_minutes: 15 };
    expect(QuestResponseSchema.safeParse(q).success).toBe(false);
  });

  it("rejects an invalid category", () => {
    const q = { ...validQuest, category: "shopping" };
    expect(QuestResponseSchema.safeParse(q).success).toBe(false);
  });

  it("rejects missing required fields", () => {
    const { objective, ...missingObjective } = validQuest;
    expect(QuestResponseSchema.safeParse(missingObjective).success).toBe(false);
  });

  it("rejects rules array with fewer than 2 items", () => {
    const q = { ...validQuest, rules: ["Only one rule."] };
    expect(QuestResponseSchema.safeParse(q).success).toBe(false);
  });

  it("validates request schema parameters", () => {
    expect(
      QuestRequestSchema.safeParse({
        category: "nature",
        duration_minutes: 10,
        difficulty: "easy"
      }).success
    ).toBe(true);

    expect(
      QuestRequestSchema.safeParse({
        category: "invalid",
        duration_minutes: 10,
        difficulty: "easy"
      }).success
    ).toBe(false);
  });
});
