import { NextRequest, NextResponse } from "next/server";
import { LMStudioProvider } from "@/lib/ai/lmstudio";
import { QuestRequestSchema } from "@/lib/quests/schema";
import { getFallbackQuest } from "@/lib/quests/fallback";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedRequest = QuestRequestSchema.safeParse(body);

    if (!parsedRequest.success) {
      return NextResponse.json(
        { error: "Invalid quest configuration parameters", details: parsedRequest.error.issues },
        { status: 400 }
      );
    }

    const provider = new LMStudioProvider();
    const health = await provider.checkHealth();

    // If LM Studio is not active on localhost:1234, gracefully serve the curated safe fallback
    if (!health.connected) {
      const fallbackQuest = getFallbackQuest(parsedRequest.data);
      return NextResponse.json({
        quest: fallbackQuest,
        source: "fallback-catalog",
        notice: `LM Studio is not reachable on ${health.endpoint}. Serving verified safe catalog quest.`
      });
    }

    // LM Studio is running! Proceed with full local open-weight generation
    const quest = await provider.generateQuest(parsedRequest.data);
    return NextResponse.json({
      quest,
      source: "local-open-weight-ai",
      model: health.models?.[0] || "Open-Weight Instruct Model"
    });
  } catch (error: unknown) {
    console.error("[API Generate Error]", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
