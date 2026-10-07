import { QuestResponse } from "../quests/schema";

export interface ActiveQuestState {
  id: string;
  quest: QuestResponse;
  startTimestamp: number;
  targetEndTimestamp: number;
  totalDurationSeconds: number;
  status: "in_progress" | "completed" | "abandoned";
}

const STORAGE_KEY = "irl_quest_active_mission";

export function saveActiveQuest(quest: QuestResponse): ActiveQuestState {
  const now = Date.now();
  const totalSeconds = quest.duration_minutes * 60;
  const state: ActiveQuestState = {
    id: `quest_${now}_${Math.random().toString(36).substring(2, 7)}`,
    quest,
    startTimestamp: now,
    targetEndTimestamp: now + totalSeconds * 1000,
    totalDurationSeconds: totalSeconds,
    status: "in_progress",
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  return state;
}

export function getActiveQuest(): ActiveQuestState | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ActiveQuestState;
  } catch {
    return null;
  }
}

export function clearActiveQuest(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
