import { describe, it, expect } from "vitest";
import { extractJsonFromCompletion } from "../lib/ai/sanitizer";

describe("extractJsonFromCompletion", () => {
  it("extracts valid raw JSON directly", () => {
    const raw = JSON.stringify({
      title: "Test Quest",
      objective: "Explore nearby surroundings.",
    });
    const result = extractJsonFromCompletion(raw) as { title: string; objective: string };
    expect(result.title).toBe("Test Quest");
    expect(result.objective).toBe("Explore nearby surroundings.");
  });

  it("extracts JSON wrapped in markdown code fence with json tag", () => {
    const raw = `Here is your quest:
\`\`\`json
{
  "title": "Fenced Quest",
  "category": "nature"
}
\`\`\`
Hope you enjoy it!`;
    const result = extractJsonFromCompletion(raw) as { title: string; category: string };
    expect(result.title).toBe("Fenced Quest");
    expect(result.category).toBe("nature");
  });

  it("extracts JSON wrapped in markdown code fence without language tag", () => {
    const raw = `\`\`\`
{
  "title": "No Language Fence",
  "category": "exploration"
}
\`\`\``;
    const result = extractJsonFromCompletion(raw) as { title: string; category: string };
    expect(result.title).toBe("No Language Fence");
    expect(result.category).toBe("exploration");
  });

  it("strips conversational preambles and postscripts outside braces", () => {
    const raw = `Hello human! I have generated your outdoor mission:
{
  "title": "Unnoticed Patterns",
  "category": "observation"
}
Remember to leave your phone at home!`;
    const result = extractJsonFromCompletion(raw) as { title: string; category: string };
    expect(result.title).toBe("Unnoticed Patterns");
    expect(result.category).toBe("observation");
  });

  it("cleans trailing commas before closing braces/brackets", () => {
    const raw = `{
  "title": "Comma Fix",
  "rules": [
    "Rule 1",
    "Rule 2",
  ],
}`;
    const result = extractJsonFromCompletion(raw) as { title: string; rules: string[] };
    expect(result.title).toBe("Comma Fix");
    expect(result.rules).toHaveLength(2);
  });

  it("throws an error when no JSON braces exist", () => {
    expect(() => extractJsonFromCompletion("Just some text without any JSON.")).toThrow(
      "No valid JSON structure found in model completion."
    );
  });

  it("throws an error on empty or invalid input", () => {
    expect(() => extractJsonFromCompletion("")).toThrow("Invalid or empty raw completion provided.");
  });
});
