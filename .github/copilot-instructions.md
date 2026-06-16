# Copilot Instructions

## Project

Personal speaker portfolio for Julia Kordick ("Accidental Thought Leadership"). A statically-exported Next.js site that renders a unified, date-sorted timeline of public appearances (talks, podcasts, livestreams, workshops, blogs) sourced from markdown files in the repo root.

## Stack

- **Next.js 16** (App Router) with `output: 'export'` — static site, no server runtime.
- **React 19**, **TypeScript 5**, **Tailwind CSS v4** (via `@tailwindcss/postcss`).
- **cheerio** for parsing markdown-linked pages (abstract fallback fetching).
- **Vitest** for tests, **ESLint 9** (`eslint-config-next`) for linting.
- Deployed to **GitHub Pages** via `.github/workflows/nextjs.yml`. `basePath` is `/accidental-thought-leadership` in production (set via `NEXT_PUBLIC_BASE_PATH`).

## Commands

- `npm run dev` — local dev server (http://localhost:3000)
- `npm run build` — static export to `out/`
- `npm run lint` — ESLint
- `npm run test` — Vitest

Always run `npm run lint` and `npm run test` before declaring a change done. Run `npm run build` when changing anything that touches static export, routing, or `next.config.ts`.

## Repository layout

- `src/app/` — App Router pages, root `layout.tsx`, `page.tsx`, global CSS.
- `src/components/` — React components (`SpeakerHeader`, `TalkCard`).
- `src/lib/` — Markdown loaders, one per appearance type: `talks.ts`, `podcasts.ts`, `livestreams.ts`, `workshops.ts`, `blogs.ts`, `upcoming.ts`, plus `speaker.ts`. Tests live next to source (e.g. `talks.test.ts`).
- Root-level content files (consumed at build time via `fs` + `process.cwd()`):
  - `talks.md`, `podcasts.md`, `livestreams.md`, `workshops.md`, `blogs.md`, `upcoming.md`, `speaker.md`
- `public/` — static assets (speaker photo, favicon).
- `.github/workflows/nextjs.yml` — Pages deploy pipeline.

## Conventions

- **Content is data.** Never hardcode appearances in TSX; they come from the root markdown files parsed in `src/lib/*.ts`. The README documents the exact markdown schema — keep parser changes backward-compatible with the documented format, and update the README whenever the schema changes.
- **One `Appearance` timeline + side sections.** `page.tsx` merges all past loaders and sorts by `date` descending. New past-appearance types should follow the existing loader pattern (export an interface with a `type` discriminator and a `get<Type>s()` async function) and be merged into the `Appearance` union in `TalkCard.tsx`. Forward-looking content (like `upcoming`) is rendered in a separate section above the timeline and is **not** part of the `Appearance` union.
- **Static export only.** No server actions, route handlers, `dynamic`, `revalidate`, or runtime env vars. All data must be readable at build time via `fs`. Any image must work with `images: { unoptimized: true }`.
- **Asset URLs must respect `basePath`.** Use `process.env.NEXT_PUBLIC_BASE_PATH` (or Next's built-in handling) when constructing links to files in `public/`, otherwise GitHub Pages deploys will 404.
- **Fail silently when enriching from the network.** Helpers like `fetchAbstract` must `try/catch` and return `undefined` on failure — the build must never break because an external page is down.
- **TypeScript strict, no `any`.** Define interfaces in the loader that owns the data.
- **Tailwind v4** via PostCSS; style with utility classes, support dark mode (`dark:` variants are used throughout).
- **Commit style.** Keep commits focused. Include the `Co-authored-by: Copilot` trailer.

## When adding a new appearance type

1. Create `src/lib/<type>.ts` exporting an interface with `type: '<type>'` and a `get<Type>s()` loader that reads `<type>.md` from `process.cwd()`.
2. Add a Vitest spec next to it.
3. Import and merge it in `src/app/page.tsx`'s `Promise.all` and the `appearances` array.
4. Extend the `Appearance` union and rendering in `src/components/TalkCard.tsx`.
5. Document the markdown schema in `README.md`.
