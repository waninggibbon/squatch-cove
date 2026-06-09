/**
 * Scouts of Squatch Cove - Character Sheets
 *
 * Lightweight TypeScript structure for pre-generated scout characters.
 * This is intended as a design/reference file, not necessarily production code.
 */

export type StatName =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "luck";

export type Stats = Record<StatName, number>;

export type GearTag =
  | "melee"
  | "ranged"
  | "defense"
  | "bind"
  | "climb"
  | "reach"
  | "observe"
  | "record"
  | "signal"
  | "reflect"
  | "repair"
  | "light"
  | "fire"
  | "medical"
  | "track"
  | "navigate"
  | "distract"
  | "stealth"
  | "speed"
  | "impact"
  | "trap"
  | "weird";

export type EquipmentItem = {
  name: string;
  description: string;
  tags: GearTag[];
  exampleUses?: string[];

  /** Optional special rule for unusually important items. */
  specialEffect?: string;
};

export type MeritBadge = {
  name: string;
  description: string;

  /**
   * Once per session, the player may invoke this badge
   * to automatically succeed at something clearly related.
   */
  oncePerSessionEffect: string;
};

export type SpecialAbility = {
  name: string;
  description: string;
  frequency: "always active" | "once per scene" | "once per session" | string;
};

export type CharacterFlaw = {
  name: string;
  description: string;

  /** When the player leans into this flaw, they may gain 1 Camp Clout. */
  campCloutTrigger: string;
};

export type CharacterSheet = {
  playerName: string;
  characterName: string;
  nickname?: string;

  archetype: string;
  shortDescription: string;

  stats: Stats;

  /** Formula: 20 * constitution */
  maxHp: number;

  /** Formula: 10 + dexterity */
  defense: number;

  specialAbility: SpecialAbility;
  meritBadge: MeritBadge;
  flaw: CharacterFlaw;

  equipment: EquipmentItem[];

  /** One hidden/funny item the player can reveal later. */
  secretItem?: EquipmentItem;

  roleplayNotes?: {
    wants: string;
    fears: string;
    attitude: string;
  };
};

export type RulesReference = {
  maxHpFormula: "20 * constitution";
  defenseFormula: "10 + dexterity";
  checkFormula: "d20 + relevant stat";
  equipmentBonus: "+2 when an equipment tag clearly applies";
  luckRule: "Luck score equals rerolls per session";
  campCloutMax: 3;
};

export const rulesReference: RulesReference = {
  maxHpFormula: "20 * constitution",
  defenseFormula: "10 + dexterity",
  checkFormula: "d20 + relevant stat",
  equipmentBonus: "+2 when an equipment tag clearly applies",
  luckRule: "Luck score equals rerolls per session",
  campCloutMax: 3,
};

export const brockTimber: CharacterSheet = {
  playerName: "Luke",
  characterName: "Brock Timber",
  nickname: "Big Boots",

  archetype: "Wrestler Jock / Secret Cryptid Nerd",
  shortDescription:
    "A varsity wrestler who pretends he is just here for the outdoor exercise, but absolutely owns a laminated Bigfoot field guide.",

  stats: {
    strength: 4,
    dexterity: 3,
    constitution: 3,
    intelligence: 1,
    wisdom: 1,
    luck: 2,
  },

  maxHp: 16,
  defense: 13,

  specialAbility: {
    name: "Varsity Headlock",
    description:
      "When Brock grapples, pins, tackles, restrains, or physically controls a creature, he rolls twice and takes the better result.",
    frequency: "always active",
  },

  meritBadge: {
    name: "Cryptid Research Badge",
    description:
      "Brock has read way too many library books, forum posts, and photocopied zines about creatures that definitely probably exist.",
    oncePerSessionEffect:
      "Ask the GM one question about a cryptid's weakness, behavior, or origin. The GM must answer truthfully.",
  },

  flaw: {
    name: "Secret Monster Nerd",
    description:
      "Brock tries to act cool, but gets visibly excited by monster tracks, weird hair samples, strange noises, and anything labeled 'unexplained.'",
    campCloutTrigger:
      "Gain 1 CC when Brock risks embarrassment or danger because he cannot resist investigating cryptid evidence.",
  },

  equipment: [
    {
      name: "Compass",
      description: "A reliable old compass clipped to Brock's belt.",
      tags: ["navigate", "track"],
      exampleUses: [
        "Find north",
        "follow a trail",
        "avoid getting turned around",
      ],
    },
    {
      name: "Cryptid Guidebook",
      description:
        "A battered paperback full of blurry photos, questionable diagrams, and surprisingly useful monster notes.",
      tags: ["observe", "weird"],
      exampleUses: [
        "Identify monster habits",
        "spot fake Bigfoot evidence",
        "guess a creature weakness",
      ],
    },
    {
      name: "Trail Markers",
      description: "Bright cloth strips and chalk for marking trails.",
      tags: ["navigate", "signal", "trap"],
      exampleUses: [
        "Mark a safe route",
        "create a warning line",
        "leave messages for others",
      ],
    },
    {
      name: "50ft Paracord",
      description: "Strong utility cord Brock carries everywhere.",
      tags: ["bind", "climb", "reach"],
      exampleUses: [
        "Tie up a creature",
        "lower someone safely",
        "make a tripwire",
      ],
    },
    {
      name: "Wrestling Headgear",
      description:
        "Brock insists it is protective equipment. Everyone else thinks it looks ridiculous.",
      tags: ["defense", "weird"],
      exampleUses: [
        "Soften a blow",
        "look ridiculous",
        "prove he is taking this very seriously",
      ],
    },
  ],

  secretItem: {
    name: "Homemade Bigfoot Call",
    description:
      "A wooden whistle Brock carved after watching six online videos about Sasquatch vocalizations.",
    tags: ["signal", "distract", "weird"],
    exampleUses: [
      "Get Bigfoot's attention",
      "scare someone in the woods",
      "make a deeply upsetting noise",
    ],
  },

  roleplayNotes: {
    wants: "To prove he is brave, useful, and definitely not scared.",
    fears: "Everyone finding out how much he cares about cryptids.",
    attitude:
      "Acts tough, but becomes a giddy little scholar around monster evidence.",
  },
};

export const jettRivers: CharacterSheet = {
  playerName: "Cade",
  characterName: "Jett Rivers",
  nickname: "Crash",

  archetype: "Extreme Sports Daredevil",
  shortDescription:
    "A walking bad idea whose mother forced him into Scouts in a desperate attempt to teach him caution. It has not worked.",

  stats: {
    strength: 3,
    dexterity: 4,
    constitution: 2,
    intelligence: 0,
    wisdom: 1,
    luck: 4,
  },

  maxHp: 14,
  defense: 14,

  specialAbility: {
    name: "Full Commit",
    description:
      "Once per scene, when attempting something reckless, dangerous, or obviously stupid, Jett may immediately move to any reachable location involved in the stunt before making the roll.",
    frequency: "once per scene",
  },

  meritBadge: {
    name: "Extreme Sports Badge",
    description:
      "Jett has survived enough terrible decisions that normal people have stopped questioning how.",
    oncePerSessionEffect:
      "Automatically succeed at one stunt, jump, climb, escape, or other physical feat that should realistically be impossible.",
  },

  flaw: {
    name: "No Self Preservation",
    description:
      "Jett has never encountered a warning sign he considered useful.",
    campCloutTrigger:
      "Gain 1 CC when Jett makes a situation worse by rushing in, accepting a challenge, ignoring obvious danger, or acting before thinking.",
  },

  equipment: [
    {
      name: "Heavy Duty Flashlight",
      description:
        "A large metal flashlight. Jett primarily uses it as a club.",
      tags: ["light", "impact"],
    },
    {
      name: "Waterproof Lighter",
      description: "For campfires, fireworks, and future mistakes.",
      tags: ["fire"],
    },
    {
      name: "Action Camera",
      description: "Records every terrible decision in glorious HD.",
      tags: ["record", "observe"],
    },
    {
      name: "Energy Drink Multipack",
      description: "An irresponsible amount of caffeine.",
      tags: ["speed", "weird"],
    },
    {
      name: "Pocket Slingshot",
      description: "Technically not approved scouting equipment.",
      tags: ["ranged", "distract"],
    },
  ],

  secretItem: {
    name: "Illegal Amount of Fireworks",
    description:
      "Jett insists they're for emergencies. Everyone else suspects he defines emergencies very broadly.",
    tags: ["fire", "impact", "distract", "weird"],
  },

  roleplayNotes: {
    wants: "To avoid being bored.",
    fears: "Being forced to sit still and think.",
    attitude:
      "If a plan takes longer than ten seconds to explain, Jett has already started doing something else.",
  },
};

export const grantCompass: CharacterSheet = {
  playerName: "Cait",
  characterName: "Grant Compass",
  nickname: "Sarge",

  archetype: "ROTC Cadet / Tactical Planner",
  shortDescription:
    "A scout who approaches every situation like a field exercise and every conversation like a mission briefing.",

  stats: {
    strength: 1,
    dexterity: 2,
    constitution: 2,
    intelligence: 4,
    wisdom: 3,
    luck: 1,
  },

  maxHp: 14,
  defense: 12,

  specialAbility: {
    name: "Actually, There Is a Protocol",
    description:
      "Once per scene, Grant may propose a plan for overcoming a challenge. If at least one other scout follows the plan, that scout gains Advantage on their next related roll.",
    frequency: "once per scene",
  },

  meritBadge: {
    name: "Emergency Preparedness Badge",
    description:
      "Grant packed for every emergency he could think of and several that nobody else has ever considered.",
    oncePerSessionEffect:
      "Reveal that Grant packed one reasonable emergency item the group needs right now.",
  },

  flaw: {
    name: "Operation: Calm Down",
    description:
      "Grant insists on assigning mission names, establishing chain of command, and creating procedures for situations that absolutely do not need them.",
    campCloutTrigger:
      "Gain 1 CC when Grant complicates a situation by insisting on rules, protocols, formations, or an official plan.",
  },

  equipment: [
    {
      name: "Laminated Island Map",
      description: "A waterproof map with notes and route markings.",
      tags: ["navigate", "observe"],
    },
    {
      name: "Whistle",
      description:
        "A loud emergency whistle that can be heard across the island.",
      tags: ["signal", "distract"],
    },
    {
      name: "Signal Mirror",
      description: "A polished mirror used for communication and signaling.",
      tags: ["reflect", "signal"],
    },
    {
      name: "Scout Handbook",
      description:
        "A heavily highlighted handbook full of procedures and survival information.",
      tags: ["medical", "navigate", "repair"],
    },
    {
      name: "Survival Knife",
      description: "A practical utility knife carried for field use.",
      tags: ["melee", "repair"],
    },
    {
      name: "Emergency Flares",
      description: "A pair of bright emergency flares.",
      tags: ["light", "fire", "signal"],
    },
  ],

  secretItem: {
    name: "Cipher Wheel",
    description:
      "A homemade cipher wheel Grant created for secure communications. Nobody asked him to make it.",
    tags: ["observe", "weird"],
  },

  roleplayNotes: {
    wants: "To prove that preparation and discipline matter.",
    fears: "Losing control of a situation.",
    attitude:
      'Every problem can be solved with proper planning, teamwork, and a clearly defined objective. Doesn\'t realize that the other kids call him "Sarge" ironically.',
  },
};

export const reedStatic: CharacterSheet = {
  playerName: "Blake",
  characterName: "Reed Static",
  nickname: "Tarantiny",

  archetype: "AV Club Filmmaker",
  shortDescription:
    "An aspiring documentary filmmaker determined to capture proof of the supernatural.",

  stats: {
    strength: 0,
    dexterity: 2,
    constitution: 1,
    intelligence: 3,
    wisdom: 4,
    luck: 3,
  },

  maxHp: 12,
  defense: 12,

  specialAbility: {
    name: "Wait, Roll Back The Footage",
    description:
      "Once per scene, Reed may reveal that he recorded something important. The recording contains a clue, detail, or observation the group missed.",
    frequency: "once per scene",
  },

  meritBadge: {
    name: "Communications Badge",
    description:
      "Reed knows how to make equipment work when it really shouldn't.",
    oncePerSessionEffect:
      "Automatically establish communication, receive a message, or recover useful information from a device.",
  },

  flaw: {
    name: "Everything Is Content",
    description:
      "Reed constantly prioritizes getting footage over personal safety.",
    campCloutTrigger:
      "Gain 1 CC when Reed puts himself in danger or creates a complication because he wanted to get a better shot.",
  },

  equipment: [
    {
      name: "Camcorder",
      description: "His prized possession.",
      tags: ["record", "observe"],
    },
    {
      name: "Boom Microphone",
      description:
        "Excellent audio equipment and a surprisingly effective polearm.",
      tags: ["reach", "record"],
    },
    {
      name: "Extension Cable",
      description: "Useful for both filming and restraining cryptids.",
      tags: ["bind", "reach"],
    },
    {
      name: "Tripod",
      description: "Camera support or improvised weapon.",
      tags: ["impact", "observe"],
    },
    {
      name: "Duct Tape",
      description: "Fixes almost anything.",
      tags: ["repair", "bind"],
    },
    {
      name: "Binoculars",
      description: "Used to spot wildlife and investigate distant locations.",
      tags: ["observe", "track"],
    },
  ],

  secretItem: {
    name: "Night Vision Lens",
    description:
      "An expensive lens attachment Reed definitely wasn't supposed to bring camping.",
    tags: ["observe", "weird"],
  },

  roleplayNotes: {
    wants: "To make the greatest cryptid documentary ever filmed.",
    fears: "Missing the shot.",
    attitude:
      "If something weird happens and nobody records it, did it even happen? If nothing happened and I recorded it anyways, can I fix it in post?",
  },
};

export const ollieBanks: CharacterSheet = {
  playerName: "Katie",
  characterName: "Ollie Banks",
  nickname: "Sad Boy",

  archetype: "Sad Boy Skater / Amateur Poet",
  shortDescription:
    "A whiny hopeless romantic skater who acts like nothing matters while secretly caring about everything.",

  stats: {
    strength: 2,
    dexterity: 3,
    constitution: 2,
    intelligence: 1,
    wisdom: 4,
    luck: 3,
  },

  maxHp: 14,
  defense: 13,

  specialAbility: {
    name: "Trust Me, I Have An Idea",
    description:
      "Once per scene, Ollie may propose an unconventional use for an item. If the GM agrees it is remotely plausible, Ollie gains Advantage on the roll.",
    frequency: "once per scene",
  },

  meritBadge: {
    name: "Street Survival Badge",
    description: "Ollie always seems to find something useful nearby.",
    oncePerSessionEffect:
      "Automatically locate a useful item, shortcut, hiding spot, or escape route.",
  },

  flaw: {
    name: "Too Cool To Care",
    description:
      "Ollie avoids sincerity whenever possible and often hides his real feelings behind jokes, sarcasm, or indifference.",
    campCloutTrigger:
      "Gain 1 CC when Ollie's refusal to be honest about how he feels creates a complication.",
  },

  equipment: [
    {
      name: "Skateboard",
      description: "Transportation, weapon, shield, and lifestyle.",
      tags: ["speed", "impact"],
    },
    {
      name: "Spray Paint",
      description: "Marks trails, leaves messages, and blinds enemies.",
      tags: ["distract", "signal"],
    },
    {
      name: "Multi-tool",
      description: "Small but useful.",
      tags: ["repair", "melee"],
    },
    {
      name: "Bearings",
      description: "A handful of loose skateboard bearings.",
      tags: ["trap", "distract"],
    },
    {
      name: "Wax Block",
      description: "Makes things unexpectedly slippery.",
      tags: ["weird", "repair"],
    },
    {
      name: "Messenger Bag",
      description: "Contains a concerning amount of random junk.",
      tags: ["weird"],
    },
  ],

  secretItem: {
    name: "Notebook of Extremely Private Poetry",
    description:
      "A battered notebook full of melodramatic poems about loneliness, sunsets, heartbreak, and how nobody understands him. Ollie will deny owning it if asked.",
    tags: ["observe", "weird"],
    specialEffect:
      "Once per session, Ollie may read between the lines and ask the GM one question about a character's true feelings or intentions: What do they really want? What are they afraid of? Are they lying? What emotion are they hiding?",
  },

  roleplayNotes: {
    wants: "To be understood.",
    fears: "Being vulnerable or sincere.",
    attitude:
      "Acts like nothing matters while secretly caring about almost everything.",
  },
};

export const characters: CharacterSheet[] = [
  brockTimber,
  jettRivers,
  grantCompass,
  reedStatic,
  ollieBanks,
];
