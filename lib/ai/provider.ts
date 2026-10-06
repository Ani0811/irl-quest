import { QuestRequest, QuestResponse } from "../quests/schema";

export interface ProviderHealth {
  connected: boolean;
  provider: string;
  endpoint: string;
  models?: string[];
  message?: string;
}

export interface AIProvider {
  name: string;
  checkHealth(): Promise<ProviderHealth>;
  generateQuest(params: QuestRequest): Promise<QuestResponse>;
}
