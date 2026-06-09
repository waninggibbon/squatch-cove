# Scouts of Squatch Cove

A little phone-friendly character app for my homebrew family TTRPG. Players pop in
their first name and get their scout's sheet — HP, status, abilities, gear, dice,
the works. No login, no backend, everything just lives in the phone's local
storage. Throwaway by design.

Big warning that I am a massive pantser who makes up rules on the fly and goes with
the flow so this is not nearly fleshed out enough for general use.

**Play here:** https://waninggibbon.github.io/squatch-cove/

## What players can do

- Type their first name to load their scout (it remembers them after that)
- Track HP, Camp Clout, Luck rerolls, status conditions
- Toggle their once-per-scene/session abilities as they're used
- Roll a (properly random) d20 with stat + gear bonuses, advantage/disadvantage
- Jot notes, tap their portrait to see it big
- Peek at the rules cheat-sheet

The base sheets are read-only — only the live stuff (HP, statuses, etc.) changes.

It's also a PWA — open it on a phone and "Add to Home Screen" for a full-screen
app icon that works offline.

## Running it locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
```

Stack: Vite + React + TS + Tailwind, with [warcraftcn](https://www.warcraftcn.com)
on top of shadcn/ui for the fantasy look.

## Deploy

Pushing to `main` auto-deploys to GitHub Pages (see `.github/workflows/deploy.yml`).
The Vite `base` is `/squatch-cove/`, so if you rename the repo, update that too.

## App icon

`public/app_icon.png` (1024×1024) is the source. The PWA/home-screen sizes are
generated from it with the built-in macOS `sips`:

```bash
cd public
sips -z 192 192 app_icon.png --out pwa-192x192.png
sips -z 512 512 app_icon.png --out pwa-512x512.png
sips -z 180 180 app_icon.png --out apple-touch-icon.png
```

## Files worth knowing

- `src/data/characters.ts` — the five scouts + all the base types
- `gm_doc.md` / `GM_BIBLE.md` — **GM stuff, spoilers, don't read if you're playing**
- `DESIGN_PLAN.md` — how the app is put together
