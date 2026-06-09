import type { CharacterSheet } from "@/data/characters";
import { Section } from "@/components/sheet/Section";

function Trait({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-wider text-amber-200/80">
        {label}
      </h3>
      <p className="mt-0.5 text-sm text-muted-foreground">{value}</p>
    </div>
  );
}

export function PersonalityTraits({ character }: { character: CharacterSheet }) {
  const notes = character.roleplayNotes;
  if (!notes) return null;

  return (
    <Section title="Personality Traits">
      <Trait label="Wants" value={notes.wants} />
      <Trait label="Fears" value={notes.fears} />
      <Trait label="Attitude" value={notes.attitude} />
    </Section>
  );
}
