<file>
00001| # Ralph Progress Log
00002| 
00003| This file tracks progress across iterations. Agents update this file
00004| after each iteration and it's included in prompts for context.
00005| 
00006| ## Codebase Patterns (Study These First)
00007| 
00008| *Add reusable patterns discovered during development here.*
00009| 
00010| ---
00011| 
00012| ## 2026-02-05 - US-001
00013| - Initialized Next.js application with TypeScript, Tailwind CSS, and App Router.
00014| - Cleaned up default boilerplate in `src/app/page.tsx` and `src/app/globals.css`.
00015| - Removed unused SVG assets from `public/`.
00016| - **Learnings:**
00017|   - `create-next-app` requires an empty directory. Had to initialize in a temp folder and move files because `.ralph-tui` and `tasks` directories existed.
00018|   - Next.js 16.1.6 uses Tailwind v4 by default with `@import "tailwindcss";` in CSS.
00019| ---
00020| 
00021| ## 2026-02-05 - US-002
00022| - Implemented `talks.md` as a single source of truth for talk data.
00023| - Created `src/lib/talks.ts` with `getTalks` utility to parse markdown content into structured JSON.
00024| - Handled optional fields (Recording, Tags) and robust error handling for malformed entries.
00025| - **Learnings:**
00026|   - TypeScript's `filter` needs a type predicate (`talk is Talk`) to correctly narrow `(Talk | null)[]` to `Talk[]`.
00027|   - Next.js server-side file reading (`fs`) works well with `process.cwd()` to locate files in the project root.
00028| ---
00029| 
00030| ## 2026-02-05 - US-003
00031| - Created `src/components/TalkCard.tsx` to render individual talk details with proper visual hierarchy.
00032| - Updated `src/app/page.tsx` to fetch talks and render the chronological list.
00033| - Implemented responsive layout using Tailwind CSS.
00034| - **Learnings:**
00035|   - When formatting "YYYY-MM-DD" dates parsed from strings using `Intl.DateTimeFormat`, always specify `timeZone: 'UTC'` to prevent timezone shifts from displaying the previous day.
00036|   - Next.js App Router defaults to Server Components, allowing direct `fs` access in `page.tsx` without API routes.
00037| ---
00038| 
00039| ## 2026-02-05 - US-004
00040| - Verified that topic tagging was already implemented in `TalkCard.tsx` and `src/lib/talks.ts` during previous steps.
00041| - Confirmed that tags are parsed from `talks.md` and rendered as styled badges.
00042| - Verified lint and build pass.
00043| - **Learnings:**
00044|   - Sometimes features are implemented ahead of schedule when they are tightly coupled with data parsing logic.
00045|   - Validated that existing implementation met all acceptance criteria without new code.
00046| ---
00047| 
</file>