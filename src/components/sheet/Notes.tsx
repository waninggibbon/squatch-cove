import { useEffect, useRef, useState } from "react";

import { usePlayerStore } from "@/store/usePlayerStore";
import { Section } from "@/components/sheet/Section";
import { Textarea } from "@/components/ui/warcraftcn/textarea";

/**
 * Free-text notes. Mounted with a `key` of the character id by the parent, so
 * the initial value is correct per character and resets handle themselves.
 */
export function Notes({ initialNotes }: { initialNotes: string }) {
  const setNotes = usePlayerStore((s) => s.setNotes);
  const [value, setValue] = useState(initialNotes);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Debounced persist; flush any pending write on unmount.
  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  const onChange = (next: string) => {
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotes(next), 300);
  };

  return (
    <Section title="Notes">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => {
          clearTimeout(timer.current);
          setNotes(value);
        }}
        placeholder="Clues, plans, suspicions, doodles…"
        className="min-h-28 w-full resize-y"
      />
    </Section>
  );
}
