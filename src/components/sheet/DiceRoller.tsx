import { useEffect, useRef, useState } from "react";
import { Dices, Sparkles } from "lucide-react";

import type { CharacterSheet, Stats } from "@/data/characters";
import { rollCheck, type CheckRoll, type RollMode } from "@/lib/dice";
import { cn } from "@/lib/utils";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const STATS: { key: keyof Stats; abbr: string }[] = [
  { key: "strength", abbr: "STR" },
  { key: "dexterity", abbr: "DEX" },
  { key: "constitution", abbr: "CON" },
  { key: "intelligence", abbr: "INT" },
  { key: "wisdom", abbr: "WIS" },
  { key: "luck", abbr: "LCK" },
];

const MODES: { key: RollMode; label: string }[] = [
  { key: "disadvantage", label: "Disadv." },
  { key: "normal", label: "Normal" },
  { key: "advantage", label: "Advantage" },
];

function Pill({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "fantasy rounded-md border px-2.5 py-2 text-sm transition-colors active:scale-95 disabled:opacity-50",
        active
          ? "border-amber-400 bg-amber-500/20 text-amber-100"
          : "border-border/60 bg-black/20 text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function DiceRoller({ character }: { character: CharacterSheet }) {
  const [open, setOpen] = useState(false);
  const [statKey, setStatKey] = useState<keyof Stats | null>(null);
  const [equip, setEquip] = useState(false);
  const [mode, setMode] = useState<RollMode>("normal");
  const [result, setResult] = useState<CheckRoll | null>(null);
  const [rolling, setRolling] = useState(false);
  const [display, setDisplay] = useState<number | null>(null);

  // Luck = rerolls per session; shared with the vitals bar via the store.
  const rerolls = usePlayerStore((s) => {
    const id = s.activeCharacterId;
    return id ? (s.byId[id]?.rerollsRemaining ?? character.stats.luck) : 0;
  });
  const setRerolls = usePlayerStore((s) => s.setRerolls);

  // Track animation timers so we can cancel on re-roll / close / unmount.
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const statMod = statKey ? character.stats[statKey] : 0;
  const modifier = statMod + (equip ? 2 : 0);

  const fmt = (n: number) => (n >= 0 ? `+${n}` : `${n}`);

  const roll = () => {
    clearTimers();
    // The actual outcome is locked in immediately (crypto random); the spin is
    // pure showmanship that lands on this value.
    const final = rollCheck(modifier, mode);
    setResult(null);
    setRolling(true);

    const steps = 16;
    let t = 0;
    for (let i = 0; i < steps; i++) {
      // Delay grows over time → the reel visibly slows down before it stops.
      const progress = i / steps;
      t += 28 + progress * progress * 130;
      timers.current.push(
        setTimeout(() => {
          setDisplay(Math.floor(Math.random() * 20) + 1 + modifier);
        }, t),
      );
    }
    // Land on the real result.
    t += 170;
    timers.current.push(
      setTimeout(() => {
        setDisplay(final.total);
        setResult(final);
        setRolling(false);
        if (navigator.vibrate) {
          navigator.vibrate(
            final.crit ? [18, 40, 70] : final.fumble ? [60] : 25,
          );
        }
      }, t),
    );
  };

  // Luck rerolls are only for a plain Normal roll. Advantage/disadvantage
  // already roll twice for free, so you can't also spend Luck on them.
  const canLuckReroll = !!result && !rolling && mode === "normal" && rerolls > 0;

  const reroll = () => {
    if (!canLuckReroll) return;
    setRerolls(rerolls - 1); // spend one Luck
    roll();
  };

  const reset = () => {
    clearTimers();
    setRolling(false);
    setResult(null);
    setDisplay(null);
  };

  const shown = rolling ? display : (result?.total ?? display);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-[calc(1.25rem+env(safe-area-inset-right))] z-30 size-14 rounded-full shadow-lg shadow-black/40"
          aria-label="Roll dice"
        >
          <Dices className="size-7" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="fantasy">Roll a d20</DialogTitle>
        </DialogHeader>

        {/* Result */}
        <div className="flex min-h-28 flex-col items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-black/30 py-3">
          {shown !== null ? (
            <>
              <div
                key={result ? "landed" : "spinning"}
                className={cn(
                  "fantasy text-6xl font-bold leading-none tabular-nums transition-all duration-150",
                  rolling && "blur-[1.5px] opacity-80",
                  result?.crit
                    ? "scale-110 text-emerald-300 drop-shadow-[0_0_14px_rgba(110,231,183,0.7)]"
                    : result?.fumble
                      ? "scale-105 text-red-400 drop-shadow-[0_0_14px_rgba(248,113,113,0.7)]"
                      : "text-amber-100",
                  result && "animate-in zoom-in-75",
                )}
              >
                {shown}
              </div>

              {/* Breakdown only after it lands */}
              {result && !rolling && (
                <div className="mt-2 animate-in fade-in text-center text-xs text-muted-foreground">
                  {result.mode !== "normal" ? (
                    <span>
                      d20 [
                      {result.dice.map((d, i) => (
                        <span
                          key={i}
                          className={
                            d === result.natural
                              ? "text-amber-200"
                              : "text-muted-foreground/50 line-through"
                          }
                        >
                          {i > 0 ? ", " : ""}
                          {d}
                        </span>
                      ))}
                      ]{" "}
                    </span>
                  ) : (
                    <span className="text-amber-200">{result.natural}</span>
                  )}
                  {result.modifier !== 0 && <> {fmt(result.modifier)} mod</>}
                </div>
              )}
              {result?.crit && !rolling && (
                <div className="fantasy mt-1 animate-in fade-in text-sm font-semibold text-emerald-300">
                  Natural 20!
                </div>
              )}
              {result?.fumble && !rolling && (
                <div className="fantasy mt-1 animate-in fade-in text-sm font-semibold text-red-400">
                  Natural 1…
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Set your modifier, then roll.
            </p>
          )}
        </div>

        {/* Stat modifier */}
        <div>
          <p className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">
            Add a stat
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            <Pill
              active={statKey === null}
              disabled={rolling}
              onClick={() => setStatKey(null)}
            >
              None
            </Pill>
            {STATS.map(({ key, abbr }) => (
              <Pill
                key={key}
                active={statKey === key}
                disabled={rolling}
                onClick={() => setStatKey(statKey === key ? null : key)}
              >
                {abbr} {fmt(character.stats[key])}
              </Pill>
            ))}
            <Pill
              active={equip}
              disabled={rolling}
              onClick={() => setEquip((v) => !v)}
            >
              Gear +2
            </Pill>
          </div>
        </div>

        {/* Mode */}
        <div className="grid grid-cols-3 gap-1.5">
          {MODES.map(({ key, label }) => (
            <Pill
              key={key}
              active={mode === key}
              disabled={rolling}
              onClick={() => setMode(key)}
            >
              {label}
            </Pill>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <Button size="lg" onClick={roll} disabled={rolling} className="w-full">
            <Dices className={cn(rolling && "animate-spin")} />
            {rolling
              ? "Rolling…"
              : `Roll${modifier !== 0 ? ` ${fmt(modifier)}` : ""}${result ? " again" : ""}`}
          </Button>
          <Button
            variant="outline"
            onClick={reroll}
            disabled={!canLuckReroll}
            className="w-full"
          >
            <Sparkles />
            {mode !== "normal"
              ? "Luck reroll — not on adv/disadv"
              : rerolls > 0
                ? `Reroll with Luck · ${rerolls} left`
                : "No rerolls left"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
