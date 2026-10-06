import { AIProvider, ProviderHealth } from "./provider";
import { QuestRequest, QuestResponse, QuestResponseSchema } from "../quests/schema";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts";
import { extractJsonFromCompletion } from "./sanitizer";
import { validateQuestSafety } from "../safety/validator";
import { getFallbackQuest } from "../quests/fallback";

export class LMStudioProvider implements AIProvider {
  name = "LM Studio (Local Open-Weight)";
  private endpoint: string;
  private defaultModel: string;
  private timeoutMs: number;

  constructor(
    endpoint = process.env.LOCAL_AI_BASE_URL || "http://localhost:1234/v1",
    defaultModel = process.env.LOCAL_AI_MODEL || "Meta-Llama-3.1-8B-Instruct",
    timeoutMs = Number(process.env.LOCAL_AI_TIMEOUT_MS) || 20000
  ) {
    this.endpoint = endpoint.replace(/\/+$/, "");
    this.defaultModel = defaultModel;
    this.timeoutMs = timeoutMs;
  }

  async checkHealth(): Promise<ProviderHealth> {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${this.endpoint}/models`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        return {
          connected: false,
          provider: "LM Studio",
          endpoint: this.endpoint,
          message: `Endpoint responded with status ${res.status}`,
        };
      }

      const data = await res.json();
      const models = Array.isArray(data.data)
        ? data.data.map((m: { id?: string }) => m.id || "unknown")
        : [];

      return {
        connected: true,
        provider: "LM Studio",
        endpoint: this.endpoint,
        models,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return {
        connected: false,
        provider: "LM Studio",
        endpoint: this.endpoint,
        message: `Unable to reach LM Studio on ${this.endpoint}: ${errorMessage}`,
      };
    }
  }

  async generateQuest(params: QuestRequest): Promise<QuestResponse> {
    const health = await this.checkHealth();
    
    // If LM Studio is not running, and local mode cannot connect, fall back if permitted or throw
    if (!health.connected) {
      if (process.env.NEXT_PUBLIC_APP_MODE === "demo" || process.env.ENABLE_FALLBACK === "true") {
        return getFallbackQuest(params);
      }
      throw new Error(
        `Local LM Studio server is not running on ${this.endpoint}. Please start LM Studio, load an instruct model, and start the local server on port 1234.`
      );
    }

    const targetModel = health.models && health.models.length > 0 ? health.models[0] : this.defaultModel;

    let retryCount = 0;
    const maxRetries = 2;
    let safetyDirective = "";

    while (retryCount <= maxRetries) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);

        const promptWithDirective = safetyDirective
          ? `${buildUserPrompt(params)}\n\nCRITICAL SAFETY WARNING: Your previous output was rejected for: ${safetyDirective}. You MUST completely avoid this concept and ensure the quest is 100% benign and safe.`
          : buildUserPrompt(params);

        const res = await fetch(`${this.endpoint}/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            model: targetModel,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: promptWithDirective },
            ],
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 500,
            stream: false,
          }),
        });

        clearTimeout(timer);

        if (!res.ok) {
          throw new Error(`LM Studio returned HTTP ${res.status}: ${await res.text()}`);
        }

        const data = await res.json();
        const rawText = data?.choices?.[0]?.message?.content;

        if (!rawText) {
          throw new Error("Empty completion returned from local model.");
        }

        // 1. Sanitize & extract JSON
        const rawJson = extractJsonFromCompletion(rawText);

        // 2. Validate against Zod schema
        const parsedQuest = QuestResponseSchema.parse(rawJson);

        // 3. Deterministic Safety Validation
        const safetyResult = validateQuestSafety(parsedQuest);

        if (!safetyResult.isSafe) {
          console.warn(`[Safety Warning] Quest rejected: ${safetyResult.violatedCategory} ('${safetyResult.matchedPattern}')`);
          safetyDirective = `Detected unsafe pattern '${safetyResult.matchedPattern}' in category '${safetyResult.violatedCategory}'.`;
          retryCount++;
          continue;
        }

        // Passed all validation stages
        return parsedQuest;
      } catch (err) {
        retryCount++;
        if (retryCount > maxRetries) {
          console.warn("[LM Studio] Retries exhausted, serving safe fallback quest.", err);
          return getFallbackQuest(params);
        }
      }
    }

    // Default safe fallback if retries expired
    return getFallbackQuest(params);
  }
}
