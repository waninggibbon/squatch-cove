import { useState } from "react";
import { LogOut, MoreVertical, RefreshCw, Trash2 } from "lucide-react";

import type { CharacterSheet } from "@/data/characters";
import { avatarUrl } from "@/lib/identity";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Badge } from "@/components/ui/warcraftcn/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/warcraftcn/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SheetHeader({ character }: { character: CharacterSheet }) {
  const logout = usePlayerStore((s) => s.logout);
  const newSession = usePlayerStore((s) => s.newSession);
  const fullReset = usePlayerStore((s) => s.fullReset);
  const [confirmNew, setConfirmNew] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <header className="mx-auto flex max-w-md flex-col gap-3 px-4 pb-2 pt-4">
      <div className="flex items-start gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
              aria-label={`View portrait of ${character.characterName}`}
            >
              <img
                src={avatarUrl(character)}
                alt={character.characterName}
                className="size-16 rounded-full border-2 border-amber-600/70 object-cover shadow-[0_0_12px_rgba(180,120,40,0.4)] transition-transform active:scale-95"
                onError={(e) => {
                  e.currentTarget.style.visibility = "hidden";
                }}
              />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-xs">
            <DialogHeader>
              <DialogTitle className="fantasy text-amber-100">
                {character.characterName}
              </DialogTitle>
              {character.nickname && (
                <DialogDescription>“{character.nickname}”</DialogDescription>
              )}
            </DialogHeader>
            <img
              src={avatarUrl(character)}
              alt={character.characterName}
              className="w-full rounded-lg border-2 border-amber-600/70 object-contain"
            />
          </DialogContent>
        </Dialog>
        <div className="min-w-0 flex-1">
          <h1 className="fantasy text-xl font-bold leading-tight text-amber-100">
            {character.characterName}
          </h1>
          {character.nickname && (
            <p className="text-sm text-amber-200/70">“{character.nickname}”</p>
          )}
          <Badge variant="outline" size="sm" className="mt-1">
            {character.archetype}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="Menu">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setConfirmNew(true)}>
              <RefreshCw /> Start new session
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setConfirmReset(true)}>
              <Trash2 /> Full reset
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => logout()}>
              <LogOut /> Switch scout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-sm text-muted-foreground">
        {character.shortDescription}
      </p>

      {/* New-session confirmation */}
      <AlertDialog open={confirmNew} onOpenChange={setConfirmNew}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="fantasy">
              Start a new session?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Restores HP and rerolls to full and clears ability uses and
              statuses. Your notes are kept.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="outline"
              onClick={() => {
                newSession({ clearClout: false });
                setConfirmNew(false);
              }}
            >
              Keep Camp Clout
            </Button>
            <AlertDialogAction
              onClick={() => newSession({ clearClout: true })}
            >
              Clear Clout too
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Full-reset confirmation */}
      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="fantasy">
              Reset this sheet?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Wipes everything tracked for {character.characterName} — HP, clout,
              statuses, ability uses and notes — back to the starting sheet. This
              can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => fullReset()}>
              Reset everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
