/**
 * Sanitizes and extracts raw JSON from an LLM completion string.
 * Strips markdown code blocks, conversational preambles, and extracts the outermost JSON object.
 */
export function extractJsonFromCompletion(raw: string): unknown {
  if (!raw || typeof raw !== "string") {
    throw new Error("Invalid or empty raw completion provided.");
  }

  let cleaned = raw.trim();

  // Strip Markdown code block wrappers if present (e.g., ```json ... ``` or ``` ... ```)
  if (cleaned.includes("```")) {
    cleaned = cleaned.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
  }

  // Find outermost curly braces to isolate the JSON object from preamble/postscript
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("No valid JSON structure found in model completion.");
  }

  const jsonSubstring = cleaned.substring(firstBrace, lastBrace + 1);

  try {
    return JSON.parse(jsonSubstring);
  } catch {
    // Attempt recovery: remove trailing commas before closing braces/brackets
    const sanitized = jsonSubstring
      .replace(/,\s*([}\]])/g, "$1")
      .trim();

    return JSON.parse(sanitized);
  }
}
