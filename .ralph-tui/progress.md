# Ralph Progress Log

This file tracks progress across iterations. Agents update this file
after each iteration and it's included in prompts for context.

## Codebase Patterns (Study These First)

*Add reusable patterns discovered during development here.*

---

## 2026-02-05 - US-001
- Initialized Next.js application with TypeScript, Tailwind CSS, and App Router.
- Cleaned up default boilerplate in `src/app/page.tsx` and `src/app/globals.css`.
- Removed unused SVG assets from `public/`.
- **Learnings:**
  - `create-next-app` requires an empty directory. Had to initialize in a temp folder and move files because `.ralph-tui` and `tasks` directories existed.
  - Next.js 16.1.6 uses Tailwind v4 by default with `@import "tailwindcss";` in CSS.
---

## 2026-02-05 - US-002
- Implemented `talks.md` as a single source of truth for talk data.
- Created `src/lib/talks.ts` with `getTalks` utility to parse markdown content into structured JSON.
- Handled optional fields (Recording, Tags) and robust error handling for malformed entries.
- **Learnings:**
  - TypeScript's `filter` needs a type predicate (`talk is Talk`) to correctly narrow `(Talk | null)[]` to `Talk[]`.
  - Next.js server-side file reading (`fs`) works well with `process.cwd()` to locate files in the project root.
---
