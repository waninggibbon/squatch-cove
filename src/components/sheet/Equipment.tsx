import { useState } from "react";

import type { EquipmentItem } from "@/data/characters";
import { Section } from "@/components/sheet/Section";
import { Badge } from "@/components/ui/warcraftcn/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function GearCard({ item }: { item: EquipmentItem }) {
  return (
    <div className="rounded-lg border border-border/60 bg-black/20 p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
        <h3 className="fantasy font-semibold text-amber-100">{item.name}</h3>
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline" size="sm">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
      {item.exampleUses && item.exampleUses.length > 0 && (
        <p className="mt-1.5 text-[11px] text-muted-foreground/80">
          <span className="text-amber-200/70">e.g. </span>
          {item.exampleUses.join(" · ")}
        </p>
      )}
      {item.specialEffect && (
        <p className="mt-1.5 rounded border border-amber-700/40 bg-amber-950/30 p-2 text-[11px] text-amber-100/90">
          {item.specialEffect}
        </p>
      )}
    </div>
  );
}

function SecretItem({
  item,
  used,
  onToggle,
}: {
  item: EquipmentItem;
  used: boolean;
  onToggle: () => void;
}) {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <div className="rounded-lg border border-dashed border-amber-700/50 bg-black/20 p-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setRevealed(true)}
        >
          Reveal secret item…
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-amber-700/50 bg-black/20 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-amber-300/70">
            Secret item
          </span>
          <h3 className="fantasy font-semibold text-amber-100">{item.name}</h3>
        </div>
        {item.specialEffect && (
          <div className="flex shrink-0 items-center gap-1.5">
            <Switch id="use-secret" checked={used} onCheckedChange={onToggle} />
            <Label
              htmlFor="use-secret"
              className={
                used
                  ? "text-muted-foreground text-xs"
                  : "text-amber-200/80 text-xs"
              }
            >
              {used ? "Used" : "Ready"}
            </Label>
          </div>
        )}
      </div>
      <div className="mt-1 flex flex-wrap gap-1">
        {item.tags.map((tag) => (
          <Badge key={tag} variant="outline" size="sm">
            {tag}
          </Badge>
        ))}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
      {item.specialEffect && (
        <p className="mt-1.5 rounded border border-amber-700/40 bg-amber-950/30 p-2 text-[11px] text-amber-100/90">
          {item.specialEffect}
        </p>
      )}
    </div>
  );
}

export function Equipment({
  items,
  secretItem,
  secretUsed,
  onToggleSecret,
}: {
  items: EquipmentItem[];
  secretItem?: EquipmentItem;
  secretUsed: boolean;
  onToggleSecret: () => void;
}) {
  return (
    <Section title="Equipment">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] text-muted-foreground">
          Gear gives <span className="text-amber-200/90">+2</span> when a tag
          clearly applies to what you're attempting.
        </p>
        {items.map((item) => (
          <GearCard key={item.name} item={item} />
        ))}
        {secretItem && (
          <SecretItem
            item={secretItem}
            used={secretUsed}
            onToggle={onToggleSecret}
          />
        )}
      </div>
    </Section>
  );
}
