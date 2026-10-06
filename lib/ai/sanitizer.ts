/**
 * Sanitizes and extracts raw JSON from an LLM completion string.
 * Strips markdown code blocks, conversational preambles, and extracts the outermost JSON object.
 */
export function extractJsonFromCompletion(raw: string): unknown {
  let cleaned = raw.trim();

  // Strip Markdown code block wrappers if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  // Find outermost curly braces to ignore any conversational greetings or postambles
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("No valid JSON structure found in model completion.");
  }

  const jsonSubstring = cleaned.substring(firstBrace, lastBrace + 1);

  try {
    return JSON.parse(jsonSubstring);
  } catch (error) {
    // Attempt minor recovery: clean trailing commas before closing braces/brackets
    const sanitized = jsonSubstring
      .replace(/,\s*}/g, "}")
      .replace(/,\s*\]/g, "]");
    return JSON.parse(sanitized);
  }
}
