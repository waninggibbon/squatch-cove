import type { CharacterSheet } from "@/data/characters";
import type { AbilityUsage } from "@/types/playerState";
import { Section } from "@/components/sheet/Section";
import { Badge } from "@/components/ui/warcraftcn/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function UsedToggle({
  id,
  checked,
  onCheckedChange,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label
        htmlFor={id}
        className={
          checked ? "text-muted-foreground text-xs" : "text-amber-200/80 text-xs"
        }
      >
        {checked ? "Used" : "Ready"}
      </Label>
    </div>
  );
}

function AbilityCard({
  name,
  frequency,
  description,
  effect,
  effectLabel,
  toggle,
}: {
  name: string;
  frequency?: string;
  description: string;
  effect?: string;
  effectLabel?: string;
  toggle?: { id: string; checked: boolean; onChange: (v: boolean) => void };
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-black/20 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="fantasy font-semibold text-amber-100">{name}</h3>
          {frequency && (
            <Badge variant="outline" size="sm" className="mt-1">
              {frequency}
            </Badge>
          )}
        </div>
        {toggle && (
          <UsedToggle
            id={toggle.id}
            checked={toggle.checked}
            onCheckedChange={toggle.onChange}
          />
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {effect && (
        <p className="mt-1.5 rounded border border-amber-700/40 bg-amber-950/30 p-2 text-[11px] text-amber-100/90">
          {effectLabel && (
            <span className="font-semibold text-amber-200">{effectLabel} </span>
          )}
          {effect}
        </p>
      )}
    </div>
  );
}

export function Abilities({
  character,
  usage,
  onToggle,
}: {
  character: CharacterSheet;
  usage: AbilityUsage;
  onToggle: (key: keyof AbilityUsage) => void;
}) {
  const { specialAbility, meritBadge, flaw } = character;
  const abilityIsToggleable = specialAbility.frequency !== "always active";

  return (
    <Section title="Abilities">
      <div className="flex flex-col gap-2">
        <AbilityCard
          name={specialAbility.name}
          frequency={specialAbility.frequency}
          description={specialAbility.description}
          toggle={
            abilityIsToggleable
              ? {
                  id: "use-special",
                  checked: usage.specialAbility,
                  onChange: () => onToggle("specialAbility"),
                }
              : undefined
          }
        />

        <AbilityCard
          name={meritBadge.name}
          frequency="once per session"
          description={meritBadge.description}
          effect={meritBadge.oncePerSessionEffect}
          effectLabel="Invoke:"
          toggle={{
            id: "use-badge",
            checked: usage.meritBadge,
            onChange: () => onToggle("meritBadge"),
          }}
        />

        <AbilityCard
          name={flaw.name}
          frequency="flaw"
          description={flaw.description}
          effect={flaw.campCloutTrigger}
          effectLabel="+1 Camp Clout:"
        />
      </div>
    </Section>
  );
}
