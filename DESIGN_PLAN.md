# Scouts of Lost Pine Island — Player Companion App

Design & implementation plan for a throwaway, front-end-only character-sheet app
for the homebrew TTRPG. Players open it on their phones, type their first name,
and get a mobile-first digital sheet they can use to track HP, status, Camp Clout,
luck rerolls, and ability usage during play. Everything persists in `localStorage`.

> **Scope reminder:** Not secure, not multi-device, not authoritative. It's a
> convenience screen for five known players. No backend, no auth, no sync.

---

## 1. Decisions (confirmed)

| Area                  | Decision                                                                                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Identity**          | Players type their **first name** (Luke / Cade / Cait / Blake / Katie), case-insensitive.                                                                      |
| **Tracked / mutable** | HP (±), **Camp Clout** (0–3), **Luck/rerolls remaining**, **ability-usage toggles** (once-per-scene/session powers), **status conditions** (presets + custom). |
| **Reference content** | **Rules cheat-sheet only** — no campaign story/premise in the player app (keeps GM secrets out).                                                               |
| **Editing**           | Base sheet is **read-only**; players additionally get a **personal notes** field.                                                                              |
| **Hosting**           | Static site on **GitHub Pages**.                                                                                                                               |
| **UI kit**            | **warcraftcn** (shadcn/ui-based, WoW-themed registry) for a fantasy/D&D feel.                                                                                  |

---

## 2. Tech stack

- **Vite + React + TypeScript** — fast static build, trivial GitHub Pages deploy.
- **Tailwind CSS** — required by shadcn/warcraftcn.
- **shadcn/ui + warcraftcn registry** — themed components (cards, buttons, badges,
  dialogs, tabs, sheets). warcraftcn is consumed via the shadcn CLI pointed at its
  registry, so its components land as local source we own and can restyle.
- **Zustand** (tiny state lib) **+ a `localStorage` persistence layer** — or plain
  `useState` + a custom `usePersistentState` hook if we want zero deps. Recommend
  Zustand's `persist` middleware: one store, automatic hydration, clean.
- **No router needed** — two "screens" (login / sheet) gated by a single piece of
  state. We can add `react-router` later if reference content grows, but a
  conditional render is enough.

Why this over the existing `character_sheets.ts`: we **reuse that file almost
verbatim** as the seed data. The types are already well-designed; we import them.

---

## 3. Data model

### 3.1 Static character data (read-only, shipped in the bundle)

Reuse `character_sheets.ts` directly. It already exports `characters: CharacterSheet[]`
plus the `CharacterSheet`, `Stats`, `EquipmentItem`, `SpecialAbility`, `MeritBadge`,
`CharacterFlaw`, and `rulesReference` types. Move it to `src/data/characters.ts`
unchanged (or re-export). HP max and defense are already precomputed per character.

### 3.2 Mutable per-player state (the only thing in `localStorage`)

This is the _overlay_ on top of the static sheet — the small set of values that
change during play. Keyed by character so each phone only ever holds its owner's data.

```ts
// src/types/playerState.ts
export type StatusCondition = {
  id: string; // uuid/random — for list keys & removal
  label: string; // "Scared", "Poisoned", or a custom string
  note?: string; // optional detail
};

export type AbilityUsage = {
  // keyed by a stable ability id; true = already used this scene/session
  specialAbility: boolean;
  meritBadge: boolean;
  secretItem: boolean;
};

export type PlayerState = {
  characterId: string; // matches a slug derived from characterName
  currentHp: number; // starts at maxHp
  campClout: number; // 0..3
  rerollsRemaining: number; // starts at stats.luck
  abilityUsage: AbilityUsage;
  statuses: StatusCondition[];
  notes: string; // personal free-text
  updatedAt: number;
};
```

- **Identity → character mapping:** a lookup `firstName.toLowerCase() →
characterId`. Derive `characterId` as a slug of `characterName`
  (`"brock-timber"`). Store the resolved `characterId` in `localStorage` under a
  small `activeCharacterId` key so a returning player skips the login screen.
- **Defaults / "new session":** `currentHp = maxHp`, `rerollsRemaining = luck`,
  all `abilityUsage = false`, `statuses = []`, `campClout` preserved or zeroed
  (see the **Reset** control below).
- **Persistence key:** `lpi:player:<characterId>` for the overlay,
  `lpi:active` for the remembered login. Namespaced so it's easy to wipe.

### 3.3 Reset / new-session behavior

A single **"Start new session"** button (in a settings/overflow menu) that:
resets HP to max, rerolls to luck, clears ability-usage toggles and statuses,
and asks whether to also clear Camp Clout. Notes are never auto-cleared.
Plus a discrete **"Full reset"** that clears this character's `localStorage` entry.

---

## 4. Screens & UX (mobile-first)

### Screen A — Name entry (login)

- Full-screen, single centered card. App title + thematic art/border (warcraftcn
  card styling). One text input ("Enter your name") + a primary button.
- On submit: normalize, look up character. Match → store `activeCharacterId`,
  go to sheet. No match → inline error ("Hmm, no scout by that name — try your
  first name") with the list of valid first names hidden behind a "names?" hint
  for the GM, optional.
- Skipped automatically if `lpi:active` is already set (with a "Not you? Switch
  scout" link to clear it).

### Screen B — Character sheet (the app)

Mobile-first single column. Top to bottom:

1. **Header / hero band** — character name, nickname, archetype, short
   description. Small "Switch scout" + overflow (⋮) menu (reset options).
2. **Vitals row (sticky)** — the most-used controls, always reachable:
   - **HP**: big current/max readout with large `−` / `+` tap targets
     (and maybe `−5/+5` long-press or secondary buttons). Color shifts as HP drops.
   - **Defense**: static readout (derived).
   - **Camp Clout**: 3 pip toggles or a stepper (cap 3).
   - **Rerolls (Luck)**: stepper from 0..luck with a "reset to {luck}" affordance.
3. **Status conditions** — chips/badges with an "Add status" button opening a
   dialog: pick from presets (Scared, Poisoned, Hidden, Stunned, Inspired, Wet,
   On Fire…) or type a custom one. Tap a chip to remove.
4. **Stats** — 6 stat tiles (STR/DEX/CON/INT/WIS/LUCK) read-only.
5. **Abilities** (accordion or cards), each with a **"used" toggle** where a
   frequency applies:
   - Special Ability (name, description, frequency → toggle if once-per-X).
   - Merit Badge (description + once-per-session effect → toggle).
   - Flaw (description + Camp Clout trigger; no toggle, it's a prompt).
   - Secret Item, if present — a **"Reveal"** affordance (collapsed by default so
     the player can dramatically reveal it), then its effect + a use-toggle if it
     has a once-per-session special effect.
6. **Equipment** — list of cards: name, description, tag badges, example uses.
   Read-only.
7. **Notes** — a persistent free-text area (auto-saves on blur/debounced).
8. **Rules** tab/section — static cheat-sheet from `rulesReference`
   (check = d20 + stat, +2 equipment bonus, luck = rerolls/session, Camp Clout
   max 3, HP & defense formulas). No story content.

Navigation between the sheet and the rules cheat-sheet: **Tabs** at the top
(`Sheet` / `Rules`) or the rules as a bottom-sheet — Tabs are simplest on mobile.

### Visual/theming notes

- Use warcraftcn's parchment/fantasy card + border treatments for the D&D feel.
- Large tap targets (≥44px), thumb-reachable primary controls, sticky vitals bar.
- Per-character accent color (derive from archetype) to make sheets feel distinct.
- Respect dark mode; default to the warcraftcn dark fantasy palette.

---

## 5. warcraftcn / shadcn component mapping

| Need                           | Component                               |
| ------------------------------ | --------------------------------------- |
| Page/section containers        | `Card`, `CardHeader/Content`            |
| HP ± , Reset buttons           | `Button` (icon + size variants)         |
| Camp Clout / rerolls           | `Button` steppers or custom pip toggles |
| Status chips                   | `Badge` (+ removable variant)           |
| Add-status / reset confirm     | `Dialog` / `AlertDialog`                |
| Sheet vs Rules                 | `Tabs`                                  |
| Abilities                      | `Accordion` or `Collapsible`            |
| Overflow menu                  | `DropdownMenu`                          |
| Notes                          | `Textarea`                              |
| Toast on save/reset (optional) | `Sonner`/`Toast`                        |

All pulled into `src/components/ui/` via the shadcn CLI against the warcraftcn
registry, then composed into feature components under `src/components/sheet/`.

---

## 6. Proposed file structure

```
dnd2026/
├─ index.html
├─ package.json
├─ vite.config.ts            # base: '/<repo>/' for GitHub Pages
├─ tailwind.config.ts
├─ components.json           # shadcn config (registry → warcraftcn)
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx                # login-gate → Sheet
│  ├─ data/
│  │  └─ characters.ts       # = existing character_sheets.ts (moved/reused)
│  ├─ types/
│  │  └─ playerState.ts
│  ├─ lib/
│  │  ├─ identity.ts         # firstName → character lookup, slug()
│  │  └─ defaults.ts         # build default PlayerState from a CharacterSheet
│  ├─ store/
│  │  └─ usePlayerStore.ts   # Zustand + persist(localStorage)
│  ├─ components/
│  │  ├─ ui/                 # shadcn/warcraftcn primitives
│  │  ├─ Login.tsx
│  │  └─ sheet/
│  │     ├─ SheetScreen.tsx
│  │     ├─ VitalsBar.tsx      # HP, defense, clout, rerolls
│  │     ├─ StatusConditions.tsx
│  │     ├─ StatGrid.tsx
│  │     ├─ Abilities.tsx
│  │     ├─ Equipment.tsx
│  │     ├─ Notes.tsx
│  │     └─ RulesTab.tsx
│  └─ index.css
└─ .github/workflows/deploy.yml   # build + publish to gh-pages
```

---

## 7. Implementation phases

**Phase 0 — Scaffold (≈30 min)**

- `npm create vite@latest` (react-ts), add Tailwind, init shadcn (`components.json`),
  wire warcraftcn registry, add `Button/Card/Badge/Tabs` to prove the pipeline.
- Set `vite.config.ts` `base` to the repo name for Pages.

**Phase 1 — Data + identity**

- Move `character_sheets.ts` → `src/data/characters.ts`. Add `slug()` + a
  `findCharacterByName(input)` in `lib/identity.ts`. Unit-check all five names map.

**Phase 2 — Store + persistence**

- `usePlayerStore` (Zustand `persist`). Actions: `loginByName`, `logout`,
  `adjustHp`, `setCampClout`, `setRerolls`, `toggleAbility`, `addStatus`,
  `removeStatus`, `setNotes`, `newSession`, `fullReset`. Hydrate `lpi:active`.

**Phase 3 — Login screen**

- `Login.tsx` + the gate in `App.tsx`. Error states. Auto-skip when remembered.

**Phase 4 — Sheet read-only render**

- Header, StatGrid, Abilities (with secret-item reveal), Equipment, RulesTab.
  Pure display from static data — no mutation yet.

**Phase 5 — Mutable controls**

- VitalsBar (HP ±, defense, Camp Clout pips, reroll stepper), StatusConditions
  (presets + custom via Dialog), Notes (debounced save), overflow menu with
  New-session / Full-reset (AlertDialog confirm).

**Phase 6 — Polish & mobile pass**

- Sticky vitals, tap-target sizing, per-character accent, HP color states, dark
  theme, empty/edge states (HP can't exceed max or go below 0; clout 0–3;
  rerolls 0–luck). Quick pass on a real phone / device emulation.

**Phase 7 — Deploy**

- GitHub repo + `deploy.yml` (build on push to `main`, publish `dist/` to Pages).
  Verify the `base` path so assets resolve under `username.github.io/<repo>/`.

---

## 8. Deployment notes (GitHub Pages)

- Vite needs `base: '/<repo-name>/'` or assets 404 on the subpath.
- Use the official `actions/deploy-pages` flow (build artifact → Pages), or the
  simpler `peaceiris/actions-gh-pages` to push `dist/` to a `gh-pages` branch.
- SPA is fine — single entry, no client routing that needs a 404 fallback (if we
  later add routing, add a `404.html` copy of `index.html`).
- Share the URL with the family; each phone remembers its scout after first login.

---

## 9. Open / deferred (not blocking the build)

- **Cross-device sync** — explicitly out of scope (localStorage only).
- **GM dashboard** — none; GM keeps using `GM_BIBLE.md`.
- **Editing equipment/stats** — out, per decision (read-only + notes only).
- **Story/premise in-app** — out, per decision (rules cheat-sheet only).
- Possible nice-to-haves later: dice roller (d20 + stat with equipment +2),
  "spend Camp Clout" quick actions, export/import a sheet as JSON for backup.

---

## 10. Risks / watch-items

- **warcraftcn registry availability/version** — if a component is missing, fall
  back to base shadcn/ui and restyle; both share the same primitives.
- **localStorage cleared by the player** — acceptable; New-session/Full-reset and
  re-login regenerate defaults from static data. No data loss that matters.
- **Name collisions** — none among the five first names; lookup is unambiguous.
