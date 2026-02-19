# Open Undercover

Open-source web implementation of the party game **Undercover** — a social deduction game where players try to identify hidden undercover agents and the elusive Mr. White among them.

Live example: [https://undercover.tamtanguy.com/](https://undercover.tamtanguy.com/)

## How to Play

1. **Add players** (minimum 3) and configure the number of undercovers and whether Mr. White is enabled.
2. **Each round**, every player secretly receives a word:
   - **Civilians** all receive the same word.
   - **Undercovers** receive a similar but different word.
   - **Mr. White** receives no word at all.
3. Players take turns **describing their word** without saying it directly.
4. After discussion, players **vote** to eliminate who they think is undercover.
5. The game ends when:
   - **Civilians win** — all undercovers (and Mr. White) are eliminated.
   - **Undercovers win** — they outnumber the remaining civilians.
   - **Mr. White wins** — if eliminated, Mr. White gets one chance to guess the civilian word. A correct guess wins the game for Mr. White.

## Tech Stack

- [Next.js 15](https://nextjs.org/) — React framework
- [React 19](https://react.dev/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [Tailwind CSS 4](https://tailwindcss.com/) — styling
- [Bun](https://bun.sh/) — JavaScript runtime and package manager
- PWA support — installable and works offline

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed

### Install

```bash
cd front
bun install
```

### Development

```bash
cd front
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
cd front
bun run build
bun run start
```

## Project Structure

```
open-undercover/
├── front/                      # Next.js application
│   ├── components/             # React components
│   │   ├── dark-mode/          # Dark mode toggle
│   │   ├── game-init/          # Player setup & game configuration
│   │   ├── header/             # App header
│   │   ├── round/              # Round logic (distribution, voting, conclusion)
│   │   └── starter/            # Start screen
│   ├── helpers/                # Utilities & state management
│   │   ├── redux/              # Global store (React Context + useReducer)
│   │   ├── player/             # Player helpers
│   │   ├── undercover/         # Game logic (win conditions, etc.)
│   │   └── words/              # Word pair database
│   ├── pages/                  # Next.js pages
│   ├── public/                 # Static assets & PWA manifest
│   ├── styles/                 # Global styles
│   └── types/                  # TypeScript type definitions
├── .prettierrc.js              # Prettier configuration
└── README.md
```

## Features

- **Dark mode** — toggle between light and dark themes
- **PWA** — installable as a standalone app on mobile and desktop
- **Persistent state** — game progress saved to localStorage (expires after 24h)
- **Configurable** — adjust number of undercovers, enable/disable Mr. White
- **220+ word pairs** — built-in French word database
- **Score tracking** — tracks player scores across multiple rounds

## License

Open source.
