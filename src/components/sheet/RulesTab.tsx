import { rulesReference } from "@/data/characters";
import { Section } from "@/components/sheet/Section";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/40 py-1.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="fantasy text-right text-sm text-amber-100">{value}</span>
    </div>
  );
}

export function RulesTab() {
  return (
    <div className="flex flex-col gap-3">
      <Section title="Core Rules">
        <div className="flex flex-col">
          <Row label="Make a check" value={rulesReference.checkFormula} />
          <Row label="Equipment bonus" value={rulesReference.equipmentBonus} />
          <Row label="Max HP" value={rulesReference.maxHpFormula} />
          <Row label="Defense" value={rulesReference.defenseFormula} />
          <Row label="Luck" value={rulesReference.luckRule} />
          <Row label="Advantage" value="Roll twice, take the better" />
          <Row label="Disadvantage" value="Roll twice, take the worse" />
        </div>
      </Section>

      <Section title="Camp Clout">
        <p className="text-sm text-muted-foreground">
          Shared narrative currency. Hold up to{" "}
          <span className="text-amber-200/90">
            {rulesReference.campCloutMax}
          </span>{" "}
          at a time.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-amber-200/80">
              Earn by
            </h3>
            <ul className="mt-1 list-disc pl-4 text-[12px] text-muted-foreground">
              <li>Making the table laugh</li>
              <li>Great roleplay</li>
              <li>Leaning into your flaw</li>
              <li>Creative solutions</li>
              <li>Memorable moments</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-amber-200/80">
              Spend to
            </h3>
            <ul className="mt-1 list-disc pl-4 text-[12px] text-muted-foreground">
              <li>Reroll a check</li>
              <li>Reduce incoming damage</li>
              <li>Introduce a minor item</li>
              <li>Create a lucky coincidence</li>
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
}
