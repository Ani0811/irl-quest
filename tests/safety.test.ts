import { describe, it, expect } from "vitest";
import { validateQuestSafety, formatSafetyDirective } from "../lib/safety/validator";
import { QuestResponse } from "../lib/quests/schema";

describe("Deterministic Safety Engine", () => {
  const baseSafeQuest: QuestResponse = {
    title: "Shadows in Motion",
    category: "observation",
    duration_minutes: 5,
    difficulty: "easy",
    objective: "Step outside onto a porch or sidewalk and observe three moving shadows cast by wind or light.",
    rules: [
      "Keep phone in your pocket.",
      "Stay in one stationary location.",
      "Observe with natural vision."
    ],
    success_condition: "Notice the vibration or movement of three distinct shadows.",
    reflection_prompt: "How did your perception of stillness change once you focused on moving shadows?"
  };

  it("approves completely benign physical quests", () => {
    const result = validateQuestSafety(baseSafeQuest);
    expect(result.isSafe).toBe(true);
    expect(result.violatedCategory).toBeUndefined();
  });

  // Hazard Domain 1: Property & Trespass
  describe("Property & Trespass Hazards", () => {
    it("flags trespassing into private property", () => {
      const q: QuestResponse = {
        ...baseSafeQuest,
        objective: "Trespass into the neighbor's private property to inspect their garden."
      };
      const result = validateQuestSafety(q);
      expect(result.isSafe).toBe(false);
      expect(result.violatedCategory).toBe("property_trespass");
    });

    it("flags hopping fences and abandoned buildings", () => {
      const q: QuestResponse = {
        ...baseSafeQuest,
        rules: ["Hop the fence into the abandoned building nearby."]
      };
      const result = validateQuestSafety(q);
      expect(result.isSafe).toBe(false);
      expect(result.violatedCategory).toBe("property_trespass");
    });

    it("flags exploring railroad tracks", () => {
      const q: QuestResponse = {
        ...baseSafeQuest,
        objective: "Walk down along the train tracks to find old iron spikes."
      };
      const result = validateQuestSafety(q);
      expect(result.isSafe).toBe(false);
      expect(result.violatedCategory).toBe("property_trespass");
    });
  });

  // Hazard Domain 2: Traffic & Road Hazards
  describe("Traffic & Road Hazards", () => {
    it("flags crossing busy highways", () => {
      const q: QuestResponse = {
        ...baseSafeQuest,
        objective: "Run across the highway and see what is on the other median."
      };
      const result = validateQuestSafety(q);
      expect(result.isSafe).toBe(false);
      expect(result.violatedCategory).toBe("traffic_hazard");
    });

    it("flags stepping into traffic lanes", () => {
      const q: QuestResponse = {
        ...baseSafeQuest,
        rules: ["Stand in the traffic lane while looking at street signs."]
      };
      const result = validateQuestSafety(q);
      expect(result.isSafe).toBe(false);
      expect(result.violatedCategory).toBe("traffic_hazard");
    });
  });

  // Hazard Domain 3: Botanical & Mycological Hazards
  describe("Botanical & Ingestion Hazards", () => {
    it("flags eating wild berries or mushrooms", () => {
      const q: QuestResponse = {
        ...baseSafeQuest,
        objective: "Forage to eat wild mushrooms and taste the berries on the hedge."
      };
      const result = validateQuestSafety(q);
      expect(result.isSafe).toBe(false);
      expect(result.violatedCategory).toBe("botanical_consumption");
    });

    it("flags handling poison ivy or poison oak", () => {
      const q: QuestResponse = {
        ...baseSafeQuest,
        objective: "Find some poison ivy and inspect its oily leaf surface."
      };
      const result = validateQuestSafety(q);
      expect(result.isSafe).toBe(false);
      expect(result.violatedCategory).toBe("botanical_consumption");
    });
  });

  // Hazard Domain 4: Wildlife & Fauna Hazards
  describe("Wildlife & Fauna Hazards", () => {
    it("flags approaching wild snakes or bears", () => {
      const q: QuestResponse = {
        ...baseSafeQuest,
        objective: "Approach the snake coiled near the stone wall."
      };
      const result = validateQuestSafety(q);
      expect(result.isSafe).toBe(false);
      expect(result.violatedCategory).toBe("wildlife_contact");
    });

    it("flags disturbing insect hives", () => {
      const q: QuestResponse = {
        ...baseSafeQuest,
        rules: ["Disturb the wasp hive gently with a long twig."]
      };
      const result = validateQuestSafety(q);
      expect(result.isSafe).toBe(false);
      expect(result.violatedCategory).toBe("wildlife_contact");
    });
  });

  // Hazard Domain 5: Heights & Physical Peril
  describe("Heights & Dangerous Challenges", () => {
    it("flags climbing trees or scaling walls", () => {
      const q: QuestResponse = {
        ...baseSafeQuest,
        objective: "Climb to the top of a tree to get a wide vantage point."
      };
      const result = validateQuestSafety(q);
      expect(result.isSafe).toBe(false);
      expect(result.violatedCategory).toBe("heights_physical");
    });

    it("flags walking along cliff edges or rooftops", () => {
      const q: QuestResponse = {
        ...baseSafeQuest,
        objective: "Walk along the ledge of the cliff edge."
      };
      const result = validateQuestSafety(q);
      expect(result.isSafe).toBe(false);
      expect(result.violatedCategory).toBe("heights_physical");
    });

    it("flags swimming in river currents", () => {
      const q: QuestResponse = {
        ...baseSafeQuest,
        rules: ["Swim in the river current until you reach the opposite bank."]
      };
      const result = validateQuestSafety(q);
      expect(result.isSafe).toBe(false);
      expect(result.violatedCategory).toBe("heights_physical");
    });
  });

  // Hazard Domain 6: Social & Vulnerability Risks
  describe("Social & Vulnerability Risks", () => {
    it("flags approaching strangers or knocking on doors", () => {
      const q: QuestResponse = {
        ...baseSafeQuest,
        objective: "Approach a stranger and ask them for three facts about their day."
      };
      const result = validateQuestSafety(q);
      expect(result.isSafe).toBe(false);
      expect(result.violatedCategory).toBe("social_vulnerability");
    });

    it("flags walking into dark alleys at night", () => {
      const q: QuestResponse = {
        ...baseSafeQuest,
        rules: ["Walk down the dark alleyway to see what shadows form."]
      };
      const result = validateQuestSafety(q);
      expect(result.isSafe).toBe(false);
      expect(result.violatedCategory).toBe("social_vulnerability");
    });
  });

  it("generates an actionable feedback string for model retry", () => {
    const q: QuestResponse = {
      ...baseSafeQuest,
      objective: "Climb to the top of a tree to observe leaves."
    };
    const result = validateQuestSafety(q);
    const directive = formatSafetyDirective(result);
    expect(directive).toContain("Detected prohibited hazard");
    expect(directive).toContain("heights_physical");
  });
});
