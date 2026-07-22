# Building Beyond the Brick

An interactive, remote-friendly LEGO entertainment strategy presentation by Harvey Yang and team.

## Website experience

- A 20-step story designed for a presentation remote: click any non-interactive area, or use Space, Enter, Arrow Right/Down, or Page Down to advance.
- Strategy steps 04–17 are semantic React/CSS scenes rather than full-slide screenshots.
- React Three Fiber powers the opening crew, the three interactive case-study laptops, and the closing story theater.
- NINJAGO, The LEGO Movie, and LEGO Fortnite use individual supporting visuals extracted from the supplied presentation.

## Run locally

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Validate

```bash
pnpm build
npx eslint src/features/hero/index.tsx src/features/interaction/StrategySlide.tsx src/features/interaction/NarrativeDeck.tsx src/features/interaction/InteractionArea.tsx src/features/workProjects/Laptop.tsx
```

The production site is deployed to GitHub Pages from `.github/workflows/deploy.yml`.

## Presentation materials

The source files used for the class presentation are stored in [`materials/`](materials/):

- `presentations/LEGO-Entertainment-Strategy-Interactive-EN.pptx`
- `presentations/LEGO-Entertainment-Strategy-Storyline-EN.pptx`
- `brief/source-storyline-brief.txt`

These files are supporting materials and are not included in the GitHub Pages production bundle.
