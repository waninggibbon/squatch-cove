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

      <Section title="Combat">
        <div className="flex flex-col">
          <Row label="Initiative" value="d20 + DEX" />
          <Row label="Attack" value="d20 + relevant stat" />
          <Row label="Defense" value="10 + DEX" />
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-wider text-amber-200/80">
            Damage
          </h3>
          <ul className="mt-1 list-disc pl-4 text-[12px] text-muted-foreground">
            <li>
              <span className="text-amber-200/90">Heavy</span> weapons don't
              modify the roll
            </li>
            <li>
              <span className="text-amber-200/90">Medium</span> weapons subtract
              5 from the roll
            </li>
            <li>
              <span className="text-amber-200/90">Light</span> weapons subtract
              10 from the roll
            </li>
          </ul>
          <ul className="mt-2 list-disc pl-4 text-[12px] text-muted-foreground">
            <li>
              Add <span className="text-amber-200/90">STR</span> to melee damage
            </li>
            <li>
              Add <span className="text-amber-200/90">INT</span> to ranged
              damage
            </li>
            <li>
              Add <span className="text-amber-200/90">WIS</span> if you found a
              way to attack with something that really shouldn't be a weapon
            </li>
          </ul>
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
              <li>Roll with advantage</li>
              <li>Reduce incoming damage</li>
              <li>Introduce a minor item</li>
              <li>Create a lucky coincidence</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Secret Items">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Your secret item can be used anytime (unless otherwise noted) but
            only works when others do not know you have it.
          </p>
          <p className="text-sm text-muted-foreground">
            If someone discovers the existence of your item, you must use it
            within 15 minutes or it loses effectiveness.
          </p>
          <p className="text-sm text-muted-foreground">
            To use it without drawing attention, text the DM.
          </p>
        </div>
      </Section>
    </div>
  );
}
