import { useState, type FormEvent } from "react";
import { Plus, X } from "lucide-react";

import type { PlayerState } from "@/types/playerState";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Section } from "@/components/sheet/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/warcraftcn/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PRESETS = [
  "Scared",
  "Hidden",
  "Poisoned",
  "Bleeding",
  "Stunned",
  "Restrained",
  "Exhausted",
  "Wet",
  "On Fire",
  "Inspired",
];

export function StatusConditions({ state }: { state: PlayerState }) {
  const addStatus = usePlayerStore((s) => s.addStatus);
  const removeStatus = usePlayerStore((s) => s.removeStatus);
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");

  const activeLabels = new Set(
    state.statuses.map((s) => s.label.toLowerCase()),
  );

  const addCustom = (e: FormEvent) => {
    e.preventDefault();
    if (!custom.trim()) return;
    addStatus(custom);
    setCustom("");
    setOpen(false);
  };

  return (
    <Section
      title="Status"
      action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus /> Add
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="fantasy">Add a status</DialogTitle>
              <DialogDescription>
                Tap a common one, or type your own.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((label) => (
                <Button
                  key={label}
                  size="sm"
                  variant="outline"
                  disabled={activeLabels.has(label.toLowerCase())}
                  onClick={() => {
                    addStatus(label);
                    setOpen(false);
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
            <form onSubmit={addCustom} className="flex gap-2">
              <Input
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="Custom status…"
                className="w-full"
                autoComplete="off"
              />
              <Button type="submit" disabled={!custom.trim()}>
                Add
              </Button>
            </form>
            <DialogFooter />
          </DialogContent>
        </Dialog>
      }
    >
      {state.statuses.length === 0 ? (
        <p className="text-sm text-muted-foreground">No active conditions.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {state.statuses.map((status) => (
            <button
              key={status.id}
              type="button"
              onClick={() => removeStatus(status.id)}
              className="fantasy inline-flex items-center gap-1 rounded-full border border-amber-700/60 bg-amber-950/40 py-1 pl-3 pr-2 text-sm text-amber-100 active:scale-95"
              aria-label={`Remove ${status.label}`}
            >
              {status.label}
              <X className="size-3.5 opacity-70" />
            </button>
          ))}
        </div>
      )}
    </Section>
  );
}
