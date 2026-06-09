import { useState } from "react";
import { Dices } from "lucide-react";

import type { CharacterSheet, Stats } from "@/data/characters";
import { rollCheck, type CheckRoll, type RollMode } from "@/lib/dice";
import { cn } from "@/lib/utils";
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
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "fantasy rounded-md border px-2.5 py-2 text-sm transition-colors active:scale-95",
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

  const statMod = statKey ? character.stats[statKey] : 0;
  const modifier = statMod + (equip ? 2 : 0);

  const roll = () => setResult(rollCheck(modifier, mode));

  const fmt = (n: number) => (n >= 0 ? `+${n}` : `${n}`);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setResult(null);
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-5 right-5 z-30 size-14 rounded-full shadow-lg shadow-black/40"
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
        <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-border/60 bg-black/30 py-3">
          {result ? (
            <>
              <div
                className={cn(
                  "fantasy text-6xl font-bold leading-none",
                  result.crit
                    ? "text-emerald-300 drop-shadow-[0_0_10px_rgba(110,231,183,0.6)]"
                    : result.fumble
                      ? "text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.6)]"
                      : "text-amber-100",
                )}
              >
                {result.total}
              </div>
              <div className="mt-2 text-center text-xs text-muted-foreground">
                {result.mode !== "normal" && (
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
                )}
                {result.mode === "normal" && (
                  <span className="text-amber-200">{result.natural}</span>
                )}
                {result.modifier !== 0 && <> {fmt(result.modifier)} mod</>}
              </div>
              {result.crit && (
                <div className="fantasy mt-1 text-sm font-semibold text-emerald-300">
                  Natural 20!
                </div>
              )}
              {result.fumble && (
                <div className="fantasy mt-1 text-sm font-semibold text-red-400">
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
            <Pill active={statKey === null} onClick={() => setStatKey(null)}>
              None
            </Pill>
            {STATS.map(({ key, abbr }) => (
              <Pill
                key={key}
                active={statKey === key}
                onClick={() => setStatKey(statKey === key ? null : key)}
              >
                {abbr} {fmt(character.stats[key])}
              </Pill>
            ))}
            <Pill active={equip} onClick={() => setEquip((v) => !v)}>
              Gear +2
            </Pill>
          </div>
        </div>

        {/* Mode */}
        <div className="grid grid-cols-3 gap-1.5">
          {MODES.map(({ key, label }) => (
            <Pill key={key} active={mode === key} onClick={() => setMode(key)}>
              {label}
            </Pill>
          ))}
        </div>

        <Button size="lg" onClick={roll} className="w-full">
          <Dices /> Roll{modifier !== 0 ? ` ${fmt(modifier)}` : ""}
          {result ? " again" : ""}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
