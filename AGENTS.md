# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, Cursor, Copilot, Gemini, …)
working on this repository. Human contributors: see [README.md](README.md).

## Project

Open Undercover is a client-only web version of the social deduction party game
_Undercover_. Next.js 15 app, Pages Router, React 19, TypeScript (strict), Tailwind
CSS 4, installable PWA. There is no backend, no API route and no database: all state
lives in the browser.

**The whole app lives in `front/`.** Run every command from there.

## Commands

Use **Bun** for everything (never npm / yarn / pnpm / npx):

```bash
cd front
bun install           # install dependencies
bun run dev           # dev server on http://localhost:3000
bun run build         # production build (also type-checks)
bun run typecheck     # tsc --noEmit
bun run test          # bun test (unit tests, *.test.ts)
bun run format        # prettier --write .
bun run format:check  # prettier --check .
bun run check         # typecheck + format:check + test (run this before committing)
```

There is no ESLint setup: `eslint-config-next` is in `package.json` but not configured.

## Definition of done

1. `bun run check` passes.
2. For UI changes, `bun run build` passes too, and you have looked at the result in
   the dev server, ideally at a mobile viewport. The UI is mobile-first.
3. New pure logic in `helpers/` comes with tests.
4. Docs (`AGENTS.md`, `README.md`, `helpers/words/README.md`) are updated if you changed
   something they describe.

## Architecture

| Path                         | Purpose                                                       |
| ---------------------------- | ------------------------------------------------------------- |
| `front/pages/`               | `_app.tsx` (providers, SW registration), `index.tsx` (router) |
| `front/components/<feature>` | UI by feature: `starter`, `game-init`, `round`, `game-settings`, `header`, `dark-mode`; shared primitives in `ui/` |
| `front/helpers/redux/`       | Global store: React Context + `useReducer`. **Not Redux**, despite the name |
| `front/helpers/redux/round/` | Per-round store (roles, words, votes, Mr. White guess)        |
| `front/helpers/undercover/`  | Pure game rules: win conditions, max undercovers, setup validation |
| `front/helpers/player/`      | Pure player helpers: initials, name validation, avatar colors |
| `front/helpers/words/`       | Word pair database `words-i18n.json` (360 pairs, FR/EN/ES) + guide |
| `front/types/`               | `Player` (persisted across rounds), `PlayerRound` (one round) |
| `front/styles/globals.css`   | Tailwind 4 entry point: theme tokens, dark variant, keyframes |
| `front/public/`              | PWA manifest, service worker (`sw.js`), icons                 |

### Game flow

`pages/index.tsx` switches on `GAME_STEPS` (`helpers/redux/store.tsx`):

1. `EMPTY`: starter screen
2. `INIT`: player setup, undercover count, Mr. White toggle
3. `STARTED`: rounds, cycling through `ROUND_STEP` (`helpers/redux/round/actions.ts`):
   `INITIALISATION → DISTRIBUTION → VOTE → CONCLUSION → INITIALISATION…`

`components/round/Round.tsx` picks a random pair and randomly decides which of its two
words is the civilian one. The round store keeps `wordPairIndex` / `validWordIndex`, so
`Distribution.tsx` can show each player the word in their own language
(`Player.language`, default `fr`).

## Conventions and gotchas

- **Imports** are absolute from `front/` (via `baseUrl`): `helpers/undercover`,
  `types/player`, `components/ui/Avatar`. Each helper folder re-exports from `index.ts`.
- **State changes** go through a typed action in `actions.ts` plus a `case` in the
  matching reducer. Do not mutate state or add another state library.
- **Persisted state:** the global store is saved to `localStorage` under
  `OPEN_UNDERCOVER_STATE` and restored for 24h. `HYDRATE` merges the saved state over
  `initialState`, so **every new `State` field needs a default in `initialState`**, and
  renaming or retyping a field must still work with old saved data.
- **Keep game rules pure.** Put them in `helpers/undercover/` and test them there.
  Components should not re-implement win or setup checks.
- **Styling:** Tailwind 4 is configured in CSS. There is no `tailwind.config.js`. Theme
  tokens and `@keyframes` live in `@theme` blocks in `styles/globals.css`, and keyframes
  must stay inside `@theme` or the animations get dropped. Dark mode is class-based
  (`.dark`, `dark:` variant). Use the existing tokens (`bg-paper`, `text-fg`, `brand-*`)
  rather than hard-coded colors.
- **UI copy** is in English. The word pairs are translated into FR / EN / ES.
- **Service worker:** `public/sw.js` only registers in production (not on Vercel
  previews). Bump `CACHE_NAME` when you change what it caches.
- **Existing typos are part of the API:** `voteNuber`, `initalState`. Do not rename them
  as a side effect of another change.

## Word pairs

Before touching `helpers/words/words-i18n.json`, read
[`front/helpers/words/README.md`](front/helpers/words/README.md). It covers what makes a
good pair and the file format: one pair per line, all three languages, sorted by the
French word, no duplicates, no trailing comma after the last entry. Prettier ignores
the file on purpose, so keep its hand formatting. `helpers/words/words.test.ts` enforces
the structural rules.

## Code style

Prettier (`.prettierrc.js` at the repo root) is the source of truth: 4-space indent, no
semicolons, double quotes, 90-column width, trailing commas everywhere, `x => x` arrow
parens, LF line endings. Run `bun run format` rather than formatting by hand. JSON and
Markdown files are excluded (see `front/.prettierignore`).

## Tests

- `bun test` with `bun:test` (`describe` / `test` / `expect`). Test files sit next to
  the code as `*.test.ts`.
- Only pure modules are covered (`helpers/undercover`, `helpers/player`,
  `helpers/words`). There is no React or DOM test setup. Verify UI changes in the
  browser.

## Git

- Small, focused commits with imperative messages ("Add …", "Fix …"), matching the
  existing history.
- Do not commit `.next/`, `node_modules/` or `.claude/settings.local.json`.
