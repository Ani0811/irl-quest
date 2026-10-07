import { QuestResponse, QuestCategory } from "../quests/schema";

export interface JournalEntry {
  id: string;
  quest: QuestResponse;
  completedAt: number;
  actualDurationMinutes: number;
  reflection: string;
}

export interface UserStats {
  totalQuests: number;
  totalMinutes: number;
  categoryDistribution: Record<QuestCategory, number>;
  lastCompletedAt: number | null;
}

const JOURNAL_STORAGE_KEY = "irl_quest_journal_history";

export function getJournalEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as JournalEntry[]) : [];
  } catch (err) {
    console.warn("[Journal Storage] Failed to load entries:", err);
    return [];
  }
}

export function saveJournalEntry(entry: JournalEntry): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getJournalEntries();
    // Prepend so newest appears first
    const updated = [entry, ...current.filter((e) => e.id !== entry.id)];
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn("[Journal Storage] Failed to save entry:", err);
    return [];
  }
}

export function deleteJournalEntry(id: string): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getJournalEntries();
    const updated = current.filter((e) => e.id !== id);
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn("[Journal Storage] Failed to delete entry:", err);
    return [];
  }
}

export function clearJournal(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(JOURNAL_STORAGE_KEY);
}

export function calculateUserStats(entries: JournalEntry[]): UserStats {
  const distribution: Record<QuestCategory, number> = {
    nature: 0,
    exploration: 0,
    observation: 0,
    mindfulness: 0,
    surprise: 0,
  };

  let totalMinutes = 0;
  let lastCompletedAt: number | null = null;

  for (const entry of entries) {
    totalMinutes += entry.actualDurationMinutes || entry.quest.duration_minutes || 0;
    if (entry.quest.category in distribution) {
      distribution[entry.quest.category]++;
    }
    if (!lastCompletedAt || entry.completedAt > lastCompletedAt) {
      lastCompletedAt = entry.completedAt;
    }
  }

  return {
    totalQuests: entries.length,
    totalMinutes,
    categoryDistribution: distribution,
    lastCompletedAt,
  };
}

export function exportJournalAsJson(): void {
  if (typeof window === "undefined") return;
  const entries = getJournalEntries();
  const jsonString = JSON.stringify(entries, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().split("T")[0];
  link.href = url;
  link.download = `irl-quest-journal-${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
