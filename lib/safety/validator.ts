import { SAFETY_HAZARD_PATTERNS } from "./dictionary";
import { QuestResponse } from "../quests/schema";

export interface SafetyValidationResult {
  isSafe: boolean;
  violatedCategory?: string;
  matchedPattern?: string;
  description?: string;
}

/**
 * Inspects all narrative fields of a Quest against the deterministic safety dictionary.
 * Guarantees zero unhandled hazard patterns pass into user-facing screens.
 */
export function validateQuestSafety(quest: QuestResponse): SafetyValidationResult {
  const textCorpus = [
    quest.title,
    quest.objective,
    ...quest.rules,
    quest.success_condition,
    quest.reflection_prompt,
  ].join(" ");

  for (const { category, regex, description } of SAFETY_HAZARD_PATTERNS) {
    const match = textCorpus.match(regex);
    if (match) {
      return {
        isSafe: false,
        violatedCategory: category,
        matchedPattern: match[0],
        description,
      };
    }
  }

  return { isSafe: true };
}

/**
 * Formats a safety validation violation into an actionable feedback prompt for AI retry.
 */
export function formatSafetyDirective(result: SafetyValidationResult): string {
  if (result.isSafe) return "";
  return `Detected prohibited hazard '${result.matchedPattern}' in category '${result.violatedCategory}': ${result.description}`;
}
