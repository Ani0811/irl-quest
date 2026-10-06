export interface SafetyHazardRule {
  category: string;
  description: string;
  regex: RegExp;
}

export const SAFETY_HAZARD_PATTERNS: SafetyHazardRule[] = [
  // 1. Property, Trespass & Illegality
  {
    category: "property_trespass",
    description: "Entering private property, climbing fences, trespassing, or exploring abandoned/restricted sites.",
    regex: /\b(trespass|private property|private yard|private residence|climb (over|a) (fence|gate|wall)|hop (the|a) (fence|gate)|abandoned (house|building|factory|structure|warehouse)|restricted (area|zone|property)|construction (site|zone)|railroad track|train tracks|subway tracks|military zone|utility facility)\b/i,
  },
  // 2. Traffic & Road Hazards
  {
    category: "traffic_hazard",
    description: "Navigating active vehicular lanes, highways, expressways, or crossing busy roads unsafely.",
    regex: /\b(highway|freeway|expressway|busy (street|road|intersection|avenue)|cross the (highway|freeway|busy street)|run across (the|traffic)|traffic lane|jaywalk|in the middle of the road|step into traffic|active vehicular)\b/i,
  },
  // 3. Environmental & Bio Hazards (Flora / Fungi / Consumption)
  {
    category: "botanical_consumption",
    description: "Ingesting, tasting, or foraging wild flora, fungi, or handling allergenic/poisonous plants.",
    regex: /\b(eat|taste|ingest|consume|chew|swallow|forage (and eat|to eat)|pick (and eat|mushrooms|berries|wild plants to eat)|poison ivy|poison oak|poison sumac|wild mushroom|toadstool|fungus to eat|stinging nettles|toxic plant)\b/i,
  },
  // 4. Wildlife & Fauna Hazards
  {
    category: "wildlife_contact",
    description: "Interacting with, handling, feeding, or disturbing wildlife, strange domestic animals, or insect hives.",
    regex: /\b(approach (the|a) (wild|bear|snake|raccoon|coyote|stray dog|wildlife)|feed (the|a) (wild|animal|critter)|pet (the|a) (strange dog|unfamiliar dog)|disturb (the|a) (nest|hive|wasp|hornet|bee)|catch (a|the) (snake|rodent|critter|animal)|capture (a|the) (critter|animal))\b/i,
  },
  // 5. Heights & Dangerous Physical Challenges
  {
    category: "heights_physical",
    description: "Scaling high trees, balancing on ledges, cliffs, rooftops, or entering hazardous waterways.",
    regex: /\b(climb (a|the|to the top of a) tree|scale (the|a) wall|walk along (the|a) ledge|cliff edge|rooftop|roof of|perched on (a|the) ledge|swim in (the|a) (river|canal|current|reservoir|lake)|deep water|dive into|jump from (a|the|heights)|dangerous climb)\b/i,
  },
  // 6. Social & Vulnerability Risks
  {
    category: "social_vulnerability",
    description: "Interacting with unfamiliar people, following strangers, or venturing into unlit isolated spaces at night.",
    regex: /\b(approach (a|the) stranger|talk to someone you don't know|speak to strangers|follow (a|the) person|knock on (a stranger's|someone's) door|unlit (alley|street|pathway)|dark alleyway|secluded woods at night|isolated area at night)\b/i,
  },
];
