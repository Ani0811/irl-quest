export const SAFETY_HAZARD_PATTERNS: { category: string; regex: RegExp }[] = [
  // 1. Property, Trespass & Illegality
  {
    category: "property_trespass",
    regex: /\b(trespass|private property|private yard|climb (over|a) (fence|gate|wall)|hop the fence|abandoned (house|building|factory|structure)|restricted area|construction (site|zone)|railroad|train tracks|subway tracks)\b/i,
  },
  // 2. Traffic & Road Hazards
  {
    category: "traffic_hazard",
    regex: /\b(highway|freeway|busy (street|road|intersection)|cross the (highway|freeway)|run across|traffic lane|jaywalk)\b/i,
  },
  // 3. Environmental & Bio Hazards (Flora / Fungi / Water)
  {
    category: "botanical_consumption",
    regex: /\b(eat|taste|ingest|consume|chew|swallow|forage|pick (and eat|mushrooms|berries)|poison ivy|poison oak|wild mushroom|fungus to eat)\b/i,
  },
  // 4. Wildlife Hazards
  {
    category: "wildlife_contact",
    regex: /\b(approach (the|a) (wild|bear|snake|raccoon|coyote|stray)|feed (the|a) wild|pet (the|a) strange dog|disturb (the|a) (nest|hive|wasp|bee)|catch (a|the) (snake|rodent|animal))\b/i,
  },
  // 5. Heights & Dangerous Physical Challenges
  {
    category: "heights_physical",
    regex: /\b(climb (a|to the top of a) tree|scale the wall|walk along the ledge|cliff edge|roof|rooftop|swim in (the|a) (river|canal|current)|deep water|dive into|jump from)\b/i,
  },
  // 6. Social & Interaction Risks
  {
    category: "social_vulnerability",
    regex: /\b(approach a stranger|talk to someone you don't know|follow (a|the) person|knock on (a stranger's|someone's) door|unlit alley|dark alleyway|secluded woods at night)\b/i,
  },
];
