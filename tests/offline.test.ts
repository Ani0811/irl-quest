import { describe, it, expect } from "vitest";
import { getFallbackQuest, FALLBACK_QUESTS } from "../lib/quests/fallback";
import { QuestResponseSchema, QuestCategory, QuestDuration, QuestDifficulty } from "../lib/quests/schema";
import { validateQuestSafety } from "../lib/safety/validator";

describe("Offline Resilience & Fallback Catalog Guarantee", () => {
  const categories: QuestCategory[] = ["nature", "exploration", "observation", "mindfulness", "surprise"];
  const durations: QuestDuration[] = [5, 10, 20, 30];
  const difficulties: QuestDifficulty[] = ["easy", "medium", "hard"];

  it("guarantees every fallback quest in the catalog passes Zod schema validation", () => {
    for (const cat of categories) {
      const baseQuest = FALLBACK_QUESTS[cat];
      const parsed = QuestResponseSchema.safeParse(baseQuest);
      expect(parsed.success).toBe(true);
    }
  });

  it("guarantees every fallback quest in the catalog passes the deterministic safety filter", () => {
    for (const cat of categories) {
      const baseQuest = FALLBACK_QUESTS[cat];
      const safetyResult = validateQuestSafety(baseQuest);
      expect(safetyResult.isSafe).toBe(true);
      expect(safetyResult.violatedCategory).toBeUndefined();
    }
  });

  it("correctly parameterizes duration and difficulty without corrupting the quest schema", () => {
    for (const cat of categories) {
      for (const dur of durations) {
        for (const diff of difficulties) {
          const quest = getFallbackQuest({
            category: cat,
            duration_minutes: dur,
            difficulty: diff,
          });

          expect(quest.category).toBe(cat);
          expect(quest.duration_minutes).toBe(dur);
          expect(quest.difficulty).toBe(diff);

          const schemaCheck = QuestResponseSchema.safeParse(quest);
          expect(schemaCheck.success).toBe(true);

          const safetyCheck = validateQuestSafety(quest);
          expect(safetyCheck.isSafe).toBe(true);
        }
      }
    }
  });
});
