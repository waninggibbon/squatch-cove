import { Heart, Minus, Plus, RotateCcw, Shield, Sparkles } from "lucide-react";

import type { CharacterSheet } from "@/data/characters";
import type { PlayerState } from "@/types/playerState";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function hpColor(ratio: number) {
  if (ratio <= 0) return "text-muted-foreground";
  if (ratio < 0.25) return "text-red-400";
  if (ratio < 0.5) return "text-amber-400";
  return "text-emerald-300";
}

export function VitalsBar({
  character,
  state,
}: {
  character: CharacterSheet;
  state: PlayerState;
}) {
  const adjustHp = usePlayerStore((s) => s.adjustHp);
  const setCampClout = usePlayerStore((s) => s.setCampClout);
  const setRerolls = usePlayerStore((s) => s.setRerolls);

  const ratio = state.currentHp / character.maxHp;
  const maxClout = 3;

  return (
    <div className="sticky top-0 z-20 border-b border-amber-900/40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-md flex-col gap-3 px-3 py-3">
        {/* HP */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              aria-label="Lose 5 HP"
              onClick={() => adjustHp(-5)}
              className="font-semibold"
            >
              -5
            </Button>
            <Button
              size="icon"
              variant="outline"
              aria-label="Lose 1 HP"
              onClick={() => adjustHp(-1)}
            >
              <Minus />
            </Button>
          </div>

          <div className="flex flex-col items-center leading-none">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="size-3" /> HP
            </div>
            <div className="fantasy font-bold">
              <span className={cn("text-3xl", hpColor(ratio))}>
                {state.currentHp}
              </span>
              <span className="text-muted-foreground text-lg">
                {" "}
                / {character.maxHp}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              aria-label="Heal 1 HP"
              onClick={() => adjustHp(1)}
            >
              <Plus />
            </Button>
            <Button
              size="icon"
              variant="outline"
              aria-label="Heal 5 HP"
              onClick={() => adjustHp(5)}
              className="font-semibold"
            >
              +5
            </Button>
          </div>
        </div>

        {/* Defense · Camp Clout · Rerolls */}
        <div className="grid grid-cols-3 items-center gap-2 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              <Shield className="size-3" /> Defense
            </div>
            <div className="fantasy text-xl font-bold text-amber-100">
              {character.defense}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Camp Clout
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              {Array.from({ length: maxClout }, (_, i) => {
                const filled = i < state.campClout;
                return (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Set Camp Clout to ${i + 1}`}
                    onClick={() =>
                      setCampClout(state.campClout === i + 1 ? i : i + 1)
                    }
                    className={cn(
                      "size-4 rounded-full border transition-colors",
                      filled
                        ? "border-amber-400 bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                        : "border-muted-foreground/50 bg-transparent",
                    )}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              <Sparkles className="size-3" /> Rerolls
            </div>
            <div className="mt-0.5 flex items-center gap-1">
              <Button
                size="icon-xs"
                variant="ghost"
                aria-label="Use a reroll"
                disabled={state.rerollsRemaining <= 0}
                onClick={() => setRerolls(state.rerollsRemaining - 1)}
              >
                <Minus />
              </Button>
              <span className="fantasy min-w-8 text-lg font-bold text-amber-100">
                {state.rerollsRemaining}
                <span className="text-xs text-muted-foreground">
                  /{character.stats.luck}
                </span>
              </span>
              <Button
                size="icon-xs"
                variant="ghost"
                aria-label="Restore a reroll"
                disabled={state.rerollsRemaining >= character.stats.luck}
                onClick={() => setRerolls(state.rerollsRemaining + 1)}
              >
                <Plus />
              </Button>
              <Button
                size="icon-xs"
                variant="ghost"
                aria-label="Reset rerolls"
                disabled={state.rerollsRemaining >= character.stats.luck}
                onClick={() => setRerolls(character.stats.luck)}
              >
                <RotateCcw />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
