# SHELL · A place for what you felt

SHELL is a mobile-first, local-first visual journal prototype, developed through human–AI collaboration. It connects images, short notes and fragments of memory, with collage, grid and chronological archive views.

## Why it exists

Screenshots live in photo libraries. Thoughts live in notes. The reason a moment mattered often disappears between them. SHELL explores a private space that encourages revisiting, with a quiet daily ritual and selectively shared visual cards.

These are personal design hypotheses, not validated market research.

## What works today

- Mist-like opening, a cultivation dish and date-selected daily lines.
- Local image and text capture using localStorage.
- Collage, grid and save-order archive views.
- 1080 × 1440 PNG cards, download and conditional Web Share support.
- PWA manifest and basic visit-based offline caching.
- A standalone project case study at `/showcase/` with interactive feature previews.

AI annotations, SVG doodles and recommendations are predefined examples. Movie identification, live generation, cloud sync and a growing companion are not implemented.

## Run

Node.js 22.12+ and pnpm 10 are required.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm check
```

The app is at `/`; the case study is at `/showcase/`. GitHub Actions workflows validate the code and deploy both entries to GitHub Pages, including repository subpaths.

## Data and rights

Public samples use original SVG artwork and fictional notes. Private source material is excluded from distribution. Newly added records stay in the current browser. Storage is limited, and there is no backup or cloud sync. This prototype should not be the only copy of important personal writing.

The project is source-visible for presentation and review, without a general open-source license. See [RIGHTS.md](../RIGHTS.md). Third-party dependencies retain their own licenses.

See the [Chinese case study](PRODUCT.md), [architecture](ARCHITECTURE.md) and [portfolio narrative](PORTFOLIO.md) for product decisions and limitations.
