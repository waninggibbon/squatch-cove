import { characters, type CharacterSheet } from "@/data/characters";

/** Lowercase, hyphenated, alphanumeric-only slug. */
export function slug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Stable id for a character, derived from their character name. */
export function characterId(c: CharacterSheet): string {
  return slug(c.characterName);
}

const normalize = (s: string) => s.trim().toLowerCase();

/**
 * Resolve a typed-in name to a character. Players are told to enter their first
 * name, but we also accept the character name and nickname to be forgiving.
 */
export function findCharacterByName(input: string): CharacterSheet | undefined {
  const q = normalize(input);
  if (!q) return undefined;
  return characters.find(
    (c) =>
      normalize(c.playerName) === q ||
      normalize(c.characterName) === q ||
      (c.nickname ? normalize(c.nickname) === q : false),
  );
}

export function findCharacterById(id: string): CharacterSheet | undefined {
  return characters.find((c) => characterId(c) === id);
}

/**
 * Portrait lives in /public as `<firstname>.png`. Built with Vite's BASE_URL so
 * it resolves under the GitHub Pages subpath (/dnd2026/) in production.
 */
export function avatarUrl(c: CharacterSheet): string {
  return `${import.meta.env.BASE_URL}${slug(c.playerName)}.png`;
}
