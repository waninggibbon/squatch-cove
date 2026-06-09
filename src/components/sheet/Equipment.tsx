import type { EquipmentItem } from "@/data/characters";
import { Section } from "@/components/sheet/Section";
import { Badge } from "@/components/ui/warcraftcn/badge";

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

export function Equipment({ items }: { items: EquipmentItem[] }) {
  return (
    <Section title="Equipment">
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <GearCard key={item.name} item={item} />
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">
        Gear gives <span className="text-amber-200/90">+2</span> when a tag clearly
        applies to what you're attempting.
      </p>
    </Section>
  );
}
