import { z } from "zod";

export const QuestCategorySchema = z.enum([
  "nature",
  "exploration",
  "observation",
  "mindfulness",
  "surprise",
]);

export type QuestCategory = z.infer<typeof QuestCategorySchema>;

export const QuestDurationSchema = z.union([
  z.literal(5),
  z.literal(10),
  z.literal(20),
  z.literal(30),
]);

export type QuestDuration = z.infer<typeof QuestDurationSchema>;

export const QuestDifficultySchema = z.enum(["easy", "medium", "hard"]);

export type QuestDifficulty = z.infer<typeof QuestDifficultySchema>;

export const QuestRequestSchema = z.object({
  category: QuestCategorySchema,
  duration_minutes: QuestDurationSchema,
  difficulty: QuestDifficultySchema,
});

export type QuestRequest = z.infer<typeof QuestRequestSchema>;

export const QuestResponseSchema = z.object({
  title: z.string().min(3).max(80),
  category: QuestCategorySchema,
  duration_minutes: QuestDurationSchema,
  difficulty: QuestDifficultySchema,
  objective: z.string().min(10).max(400),
  rules: z.array(z.string().min(5).max(300)).min(2).max(5),
  success_condition: z.string().min(8).max(300),
  reflection_prompt: z.string().min(8).max(300),
});

export type QuestResponse = z.infer<typeof QuestResponseSchema>;
