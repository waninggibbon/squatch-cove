import { create } from "zustand";
import { persist } from "zustand/middleware";

import { rulesReference, type CharacterSheet } from "@/data/characters";
import { defaultPlayerState } from "@/lib/defaults";
import {
  characterId,
  findCharacterById,
  findCharacterByName,
} from "@/lib/identity";
import type { AbilityUsage, PlayerState } from "@/types/playerState";

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

const randomId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

type State = {
  /** Slug of the logged-in character, or null when on the login screen. */
  activeCharacterId: string | null;
  /** Overlay state per character. Each phone usually holds just one. */
  byId: Record<string, PlayerState>;
};

type Actions = {
  login: (input: string) => boolean;
  logout: () => void;
  adjustHp: (delta: number) => void;
  setCampClout: (value: number) => void;
  setRerolls: (value: number) => void;
  toggleAbility: (key: keyof AbilityUsage) => void;
  addStatus: (label: string, note?: string) => void;
  removeStatus: (id: string) => void;
  setNotes: (notes: string) => void;
  newSession: (opts?: { clearClout?: boolean }) => void;
  fullReset: () => void;
};

export type PlayerStore = State & Actions;

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => {
      /** Apply an immutable update to the active character's overlay. */
      const withActive = (
        recipe: (ps: PlayerState, c: CharacterSheet) => PlayerState,
      ) => {
        const { activeCharacterId, byId } = get();
        if (!activeCharacterId) return;
        const c = findCharacterById(activeCharacterId);
        if (!c) return;
        const current = byId[activeCharacterId] ?? defaultPlayerState(c);
        const next = recipe({ ...current }, c);
        next.updatedAt = Date.now();
        set({ byId: { ...byId, [activeCharacterId]: next } });
      };

      return {
        activeCharacterId: null,
        byId: {},

        login: (input) => {
          const c = findCharacterByName(input);
          if (!c) return false;
          const id = characterId(c);
          const { byId } = get();
          set({
            activeCharacterId: id,
            byId: byId[id] ? byId : { ...byId, [id]: defaultPlayerState(c) },
          });
          return true;
        },

        logout: () => set({ activeCharacterId: null }),

        adjustHp: (delta) =>
          withActive((ps, c) => {
            ps.currentHp = clamp(ps.currentHp + delta, 0, c.maxHp);
            return ps;
          }),

        setCampClout: (value) =>
          withActive((ps) => {
            ps.campClout = clamp(value, 0, rulesReference.campCloutMax);
            return ps;
          }),

        setRerolls: (value) =>
          withActive((ps, c) => {
            ps.rerollsRemaining = clamp(value, 0, c.stats.luck);
            return ps;
          }),

        toggleAbility: (key) =>
          withActive((ps) => {
            ps.abilityUsage = {
              ...ps.abilityUsage,
              [key]: !ps.abilityUsage[key],
            };
            return ps;
          }),

        addStatus: (label, note) =>
          withActive((ps) => {
            const trimmed = label.trim();
            if (!trimmed) return ps;
            ps.statuses = [
              ...ps.statuses,
              { id: randomId(), label: trimmed, note: note?.trim() || undefined },
            ];
            return ps;
          }),

        removeStatus: (id) =>
          withActive((ps) => {
            ps.statuses = ps.statuses.filter((s) => s.id !== id);
            return ps;
          }),

        setNotes: (notes) =>
          withActive((ps) => {
            ps.notes = notes;
            return ps;
          }),

        newSession: (opts) =>
          withActive((ps, c) => {
            const fresh = defaultPlayerState(c);
            fresh.notes = ps.notes; // notes survive a new session
            fresh.campClout = opts?.clearClout ? 0 : ps.campClout;
            return fresh;
          }),

        fullReset: () =>
          withActive((_ps, c) => defaultPlayerState(c)),
      };
    },
    {
      name: "lpi:store",
      version: 1,
      partialize: (s) => ({
        activeCharacterId: s.activeCharacterId,
        byId: s.byId,
      }),
    },
  ),
);

/** Convenience selector: the active character + its overlay, or null. */
export function useActivePlayer(): {
  character: CharacterSheet;
  state: PlayerState;
} | null {
  const activeCharacterId = usePlayerStore((s) => s.activeCharacterId);
  const overlay = usePlayerStore((s) =>
    s.activeCharacterId ? s.byId[s.activeCharacterId] : undefined,
  );
  if (!activeCharacterId) return null;
  const character = findCharacterById(activeCharacterId);
  if (!character) return null;
  return { character, state: overlay ?? defaultPlayerState(character) };
}
