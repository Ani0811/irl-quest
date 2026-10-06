import { SAFETY_HAZARD_PATTERNS } from "./dictionary";
import { QuestResponse } from "../quests/schema";

export interface SafetyValidationResult {
  isSafe: boolean;
  violatedCategory?: string;
  matchedPattern?: string;
}

export function validateQuestSafety(quest: QuestResponse): SafetyValidationResult {
  const textCorpus = [
    quest.title,
    quest.objective,
    ...quest.rules,
    quest.success_condition,
    quest.reflection_prompt,
  ].join(" ");

  for (const { category, regex } of SAFETY_HAZARD_PATTERNS) {
    const match = textCorpus.match(regex);
    if (match) {
      return {
        isSafe: false,
        violatedCategory: category,
        matchedPattern: match[0],
      };
    }
  }

  return { isSafe: true };
}
