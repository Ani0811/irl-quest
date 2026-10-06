import { QuestRequest, QuestResponse } from "./schema";

export const FALLBACK_QUESTS: Record<QuestRequest["category"], QuestResponse> = {
  nature: {
    title: "The Palette of Natural Textures",
    category: "nature",
    duration_minutes: 10,
    difficulty: "easy",
    objective: "Find three different natural textures (such as rough tree bark, smooth river stone, or soft moss) in your immediate outdoor area without pulling or damaging any living foliage.",
    rules: [
      "Keep your phone stored in your pocket.",
      "Do not pick, tear, or disturb living plants.",
      "Explore textures using gentle fingertips only."
    ],
    success_condition: "Identify three distinct organic, non-synthetic surface textures.",
    reflection_prompt: "Which natural texture felt the most grounding under your fingertips, and why?"
  },
  exploration: {
    title: "The Way You Never Turn",
    category: "exploration",
    duration_minutes: 20,
    difficulty: "medium",
    objective: "Walk out your door and make your first two turns in directions you normally avoid during your everyday routine, remaining entirely on public sidewalks.",
    rules: [
      "Place your device on silent and put it away.",
      "Stay strictly on well-lit public sidewalks and footpaths.",
      "Do not check digital maps or street navigations."
    ],
    success_condition: "Reach a street corner or vantage point you have never consciously inspected.",
    reflection_prompt: "What was the very first unfamiliar architectural or environmental detail you noticed?"
  },
  observation: {
    title: "Five Unnoticed Hues",
    category: "observation",
    duration_minutes: 5,
    difficulty: "easy",
    objective: "Stand outdoors or on a balcony for five minutes and locate five objects reflecting subtle shades of brown, green, gray, and ochre.",
    rules: [
      "Remain standing or seated in one spot for the duration.",
      "Keep your screen dark and off.",
      "Rely purely on natural human visual focus."
    ],
    success_condition: "Spot five distinct gradations of color in everyday physical materials.",
    reflection_prompt: "Which color was hiding in plain sight directly in front of you?"
  },
  mindfulness: {
    title: "The Acoustic Horizon",
    category: "mindfulness",
    duration_minutes: 10,
    difficulty: "easy",
    objective: "Sit or stand quietly outside with eyes softly focused and distinguish three distinct sound layers: your immediate breathing, ambient neighborhood hum, and the furthest sound on the horizon.",
    rules: [
      "No headphones or audio devices.",
      "Screen completely locked and out of hand.",
      "Do not label sounds as pleasant or unpleasant; simply note their presence."
    ],
    success_condition: "Hear and separate at least one sound that was undetectable when you first began.",
    reflection_prompt: "How did the perceived volume of your environment shift once your attention settled?"
  },
  surprise: {
    title: "Older Than Your Ancestors",
    category: "surprise",
    duration_minutes: 20,
    difficulty: "medium",
    objective: "Look closely at your outdoor surroundings and find the single object, geological feature, or mature tree that has undeniably existed longer than your entire lifespan.",
    rules: [
      "Stay on safe, public ground.",
      "No online lookups or historical searches on your phone.",
      "Deduce age from physical patina, weathering, and organic growth rings."
    ],
    success_condition: "Locate one physical anchor that has witnessed decades of continuous history.",
    reflection_prompt: "What physical signs told you this entity was older than you, and how did standing beside it feel?"
  }
};

export function getFallbackQuest(params: QuestRequest): QuestResponse {
  const base = FALLBACK_QUESTS[params.category];
  return {
    ...base,
    duration_minutes: params.duration_minutes,
    difficulty: params.difficulty
  };
}
