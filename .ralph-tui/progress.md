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
