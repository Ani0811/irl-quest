import { NextResponse } from "next/server";
import { LMStudioProvider } from "@/lib/ai/lmstudio";

export const dynamic = "force-dynamic";

export async function GET() {
  const provider = new LMStudioProvider();
  const health = await provider.checkHealth();
  
  return NextResponse.json(health, {
    status: health.connected ? 200 : 200, // Return 200 so UI can parse status cleanly
  });
}
