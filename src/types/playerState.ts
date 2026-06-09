/**
 * The mutable overlay on top of a (read-only) CharacterSheet. This is the only
 * thing persisted to localStorage — the values that change during play.
 */

export type StatusCondition = {
  id: string; // random — for list keys & removal
  label: string; // "Scared", "Poisoned", or a custom string
  note?: string; // optional detail
};

/** Once-per-scene / once-per-session powers, true = already spent. */
export type AbilityUsage = {
  specialAbility: boolean;
  meritBadge: boolean;
  secretItem: boolean;
};

export type PlayerState = {
  characterId: string; // slug of characterName
  currentHp: number; // starts at maxHp
  campClout: number; // 0..3
  rerollsRemaining: number; // starts at stats.luck
  abilityUsage: AbilityUsage;
  statuses: StatusCondition[];
  notes: string; // personal free-text
  updatedAt: number;
};
