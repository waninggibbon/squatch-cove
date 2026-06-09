import type { CharacterSheet } from "@/data/characters";
import { characterId } from "@/lib/identity";
import type { PlayerState } from "@/types/playerState";

/** A fresh overlay for a character: full HP, full rerolls, nothing spent. */
export function defaultPlayerState(c: CharacterSheet): PlayerState {
  return {
    characterId: characterId(c),
    currentHp: c.maxHp,
    campClout: 0,
    rerollsRemaining: c.stats.luck,
    abilityUsage: {
      specialAbility: false,
      meritBadge: false,
      secretItem: false,
    },
    statuses: [],
    notes: "",
    updatedAt: Date.now(),
  };
}
