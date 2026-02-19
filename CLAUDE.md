# CLAUDE.md

This file provides context for Claude Code when working on this project.

## Project Overview

Open Undercover is a web-based social deduction party game built with Next.js. The app lives entirely in the `front/` directory.

## Commands

All commands should be run from the `front/` directory:

```bash
# Install dependencies
bun install

# Start dev server (http://localhost:3000)
bun run dev

# Production build
bun run build

# Start production server
bun run start
```

Use Bun instead of npm/yarn/pnpm for all operations.

## Architecture

- **Framework**: Next.js 15 with React 19, using the Pages Router (`pages/` directory)
- **Styling**: Tailwind CSS 4 via PostCSS
- **State management**: React Context + `useReducer` (not Redux despite the `helpers/redux/` directory name)
- **Storage**: LocalStorage for game state persistence (24h expiry)
- **PWA**: Service worker registered in `_app.tsx`, manifest in `public/manifest.json`

### Key directories

| Path | Purpose |
|------|---------|
| `front/components/` | React UI components organized by feature |
| `front/helpers/redux/` | Global store (Context + useReducer) and actions |
| `front/helpers/redux/round/` | Round-specific store and actions |
| `front/helpers/words/` | Word pair database (`words-raw.json` — 220+ French pairs) |
| `front/helpers/undercover/` | Core game logic (win conditions, scoring) |
| `front/helpers/player/` | Player utility functions |
| `front/types/` | TypeScript interfaces (`Player`, `PlayerRound`) |
| `front/pages/` | Next.js pages (single-page app with `index.tsx`) |
| `front/public/` | Static assets and PWA icons |

### Game flow

The app has three main steps controlled by `GAME_STEPS` enum in `helpers/redux/store.tsx`:

1. **EMPTY** → Starter screen
2. **INIT** → Player setup, undercover count, Mr. White toggle
3. **STARTED** → Round gameplay (distribution → vote → conclusion loop)

Round phases are controlled by `ROUND_STEP` in `helpers/redux/round/store.tsx`.

## Code Style

- Prettier configured in `.prettierrc.js`: 4-space indent, no semicolons, double quotes, 90 char width
- TypeScript strict mode enabled
- Arrow parens: avoid (`x => x` not `(x) => x`)
- Trailing commas: all
- Line endings: LF
