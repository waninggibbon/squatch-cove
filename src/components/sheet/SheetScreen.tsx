import { usePlayerStore, useActivePlayer } from "@/store/usePlayerStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SheetHeader } from "@/components/sheet/SheetHeader";
import { VitalsBar } from "@/components/sheet/VitalsBar";
import { PersonalityTraits } from "@/components/sheet/PersonalityTraits";
import { StatusConditions } from "@/components/sheet/StatusConditions";
import { StatGrid } from "@/components/sheet/StatGrid";
import { Abilities } from "@/components/sheet/Abilities";
import { Equipment } from "@/components/sheet/Equipment";
import { Notes } from "@/components/sheet/Notes";
import { RulesTab } from "@/components/sheet/RulesTab";
import { DiceRoller } from "@/components/sheet/DiceRoller";

export function SheetScreen() {
  const active = useActivePlayer();
  const toggleAbility = usePlayerStore((s) => s.toggleAbility);

  // Should never happen (the gate only renders this when logged in), but keeps
  // the types honest and avoids a crash if storage is in a weird state.
  if (!active) return null;
  const { character, state } = active;

  return (
    <div className="min-h-dvh pb-24">
      <VitalsBar character={character} state={state} />
      <SheetHeader character={character} />

      <Tabs defaultValue="sheet" className="mx-auto max-w-md gap-3 px-3">
        <TabsList className="w-full">
          <TabsTrigger value="sheet" className="flex-1">
            Sheet
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex-1">
            Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sheet" className="flex flex-col gap-3">
          <PersonalityTraits character={character} />
          <StatusConditions state={state} />
          <StatGrid stats={character.stats} />
          <Abilities
            character={character}
            usage={state.abilityUsage}
            onToggle={toggleAbility}
          />
          <Equipment
            items={character.equipment}
            secretItem={character.secretItem}
            secretUsed={state.abilityUsage.secretItem}
            onToggleSecret={() => toggleAbility("secretItem")}
          />
          <Notes key={character.characterName} initialNotes={state.notes} />
        </TabsContent>

        <TabsContent value="rules">
          <RulesTab />
        </TabsContent>
      </Tabs>

      <DiceRoller character={character} />
    </div>
  );
}
