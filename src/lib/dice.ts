/**
 * Dice utilities. Randomness comes from the Web Crypto CSPRNG
 * (`crypto.getRandomValues`) with rejection sampling to remove modulo bias —
 * the closest to "true random" available in the browser, and far better than
 * `Math.random()`.
 */

/** Unbiased cryptographically-strong integer in [min, max] inclusive. */
export function secureRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  if (range <= 0) throw new Error("secureRandomInt: max must be >= min");

  // Largest multiple of `range` that fits in a uint32; reject anything above it
  // so every outcome is equally likely.
  const maxUint = 0xffffffff;
  const limit = Math.floor((maxUint + 1) / range) * range;
  const buf = new Uint32Array(1);
  let x: number;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return min + (x % range);
}

export function rollDie(sides = 20): number {
  return secureRandomInt(1, sides);
}

export type RollMode = "normal" | "advantage" | "disadvantage";

export type CheckRoll = {
  dice: number[]; // the d20 face(s) actually rolled (2 for adv/dis)
  natural: number; // the chosen face after advantage/disadvantage
  modifier: number; // stat (+ equipment) total added to the roll
  total: number; // natural + modifier
  mode: RollMode;
  crit: boolean; // natural 20
  fumble: boolean; // natural 1
};

/** Roll a d20 check: d20 + modifier, honoring advantage/disadvantage. */
export function rollCheck(modifier = 0, mode: RollMode = "normal"): CheckRoll {
  const dice = mode === "normal" ? [rollDie(20)] : [rollDie(20), rollDie(20)];
  const natural =
    mode === "advantage"
      ? Math.max(...dice)
      : mode === "disadvantage"
        ? Math.min(...dice)
        : dice[0];

  return {
    dice,
    natural,
    modifier,
    total: natural + modifier,
    mode,
    crit: natural === 20,
    fumble: natural === 1,
  };
}
