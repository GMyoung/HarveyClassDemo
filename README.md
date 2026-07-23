# Building Beyond the Brick

An interactive, remote-friendly LEGO entertainment strategy presentation by Harvey Yang and team.

## Website experience

- A 20-step story designed for a presentation remote: click any non-interactive area, or use Space, Enter, Arrow Right/Down, or Page Down to advance.
- Strategy steps 04–17 are semantic React/CSS scenes rather than full-slide screenshots.
- React Three Fiber powers the opening crew, the three interactive case-study laptops, and the closing story theater.
- NINJAGO, The LEGO Movie, and LEGO Fortnite use individual supporting visuals extracted from the supplied presentation.
- Every story step includes a transparent, page-entry SVG motion cue powered by [AnimateIcons](https://github.com/Avijit07x/animateicons). Motion is short-lived and respects reduced-motion preferences.

## Temporary hero calibration panel

After the first presentation click, page 1 shows a compact **Crew tuner**. It can adjust the XYZ position of all five crew members and the XYZ position, Y rotation, and scale of each hairstyle. Values are saved only in this browser under `lego-hero-calibration-v3`; **Copy JSON** exports the complete result to send back for source-code calibration. Panel interactions never advance the presentation, and the panel will be removed after the final values are confirmed.

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
npx eslint src/features/hero/index.tsx src/features/hero/heroCalibrationState.ts src/features/hero/HeroCalibrationProvider.tsx src/features/hero/HeroCalibrationPanel.tsx src/features/interaction/StoryMotion.tsx src/features/interaction/StrategySlide.tsx src/features/interaction/NarrativeDeck.tsx src/features/interaction/InteractionArea.tsx src/features/workProjects/Laptop.tsx
```

The production site is deployed to GitHub Pages from `.github/workflows/deploy.yml`.

## Presentation materials

The source files used for the class presentation are stored in [`materials/`](materials/):

- `presentations/LEGO-Entertainment-Strategy-Interactive-EN.pptx`
- `presentations/LEGO-Entertainment-Strategy-Storyline-EN.pptx`
- `brief/source-storyline-brief.txt`

These files are supporting materials and are not included in the GitHub Pages production bundle.

Third-party licenses and attribution are listed in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) and copied into the production site as `/THIRD_PARTY_NOTICES.txt`.
