import type { Stats } from "@/data/characters";
import { Section } from "@/components/sheet/Section";

const STAT_ORDER: { key: keyof Stats; label: string; abbr: string }[] = [
  { key: "strength", label: "Strength", abbr: "STR" },
  { key: "dexterity", label: "Dexterity", abbr: "DEX" },
  { key: "constitution", label: "Constitution", abbr: "CON" },
  { key: "intelligence", label: "Intelligence", abbr: "INT" },
  { key: "wisdom", label: "Wisdom", abbr: "WIS" },
  { key: "luck", label: "Luck", abbr: "LCK" },
];

export function StatGrid({ stats }: { stats: Stats }) {
  return (
    <Section title="Stats">
      <div className="grid grid-cols-3 gap-2">
        {STAT_ORDER.map(({ key, label, abbr }) => (
          <div
            key={key}
            className="flex flex-col items-center rounded-lg border border-border/60 bg-black/20 py-2"
          >
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {abbr}
            </span>
            <span className="fantasy text-2xl font-bold text-amber-100 leading-none">
              {stats[key] >= 0 ? `+${stats[key]}` : stats[key]}
            </span>
            <span className="mt-0.5 text-[9px] text-muted-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">
        Checks roll <span className="text-amber-200/90">d20 + stat</span>. Luck is
        your rerolls per session.
      </p>
    </Section>
  );
}
