<file>
00001| <file>
00002| 00001| # Ralph Progress Log
00003| 00002| 
00004| 00003| This file tracks progress across iterations. Agents update this file
00005| 00004| after each iteration and it's included in prompts for context.
00006| 00005| 
00007| 00006| ## Codebase Patterns (Study These First)
00008| 00007| 
00009| 00008| *Add reusable patterns discovered during development here.*
00010| 00009| 
00011| 00010| ---
00012| 00011| 
00013| 00012| ## 2026-02-05 - US-001
00014| 00013| - Initialized Next.js application with TypeScript, Tailwind CSS, and App Router.
00015| 00014| - Cleaned up default boilerplate in `src/app/page.tsx` and `src/app/globals.css`.
00016| 00015| - Removed unused SVG assets from `public/`.
00017| 00016| - **Learnings:**
00018| 00017|   - `create-next-app` requires an empty directory. Had to initialize in a temp folder and move files because `.ralph-tui` and `tasks` directories existed.
00019| 00018|   - Next.js 16.1.6 uses Tailwind v4 by default with `@import "tailwindcss";` in CSS.
00020| 00019| ---
00021| 00020| 
00022| 00021| ## 2026-02-05 - US-002
00023| 00022| - Implemented `talks.md` as a single source of truth for talk data.
00024| 00023| - Created `src/lib/talks.ts` with `getTalks` utility to parse markdown content into structured JSON.
00025| 00024| - Handled optional fields (Recording, Tags) and robust error handling for malformed entries.
00026| 00025| - **Learnings:**
00027| 00026|   - TypeScript's `filter` needs a type predicate (`talk is Talk`) to correctly narrow `(Talk | null)[]` to `Talk[]`.
00028| 00027|   - Next.js server-side file reading (`fs`) works well with `process.cwd()` to locate files in the project root.
00029| 00028| ---
00030| 00029| 
00031| 00030| ## 2026-02-05 - US-003
00032| 00031| - Created `src/components/TalkCard.tsx` to render individual talk details with proper visual hierarchy.
00033| 00032| - Updated `src/app/page.tsx` to fetch talks and render the chronological list.
00034| 00033| - Implemented responsive layout using Tailwind CSS.
00035| 00034| - **Learnings:**
00036| 00035|   - When formatting "YYYY-MM-DD" dates parsed from strings using `Intl.DateTimeFormat`, always specify `timeZone: 'UTC'` to prevent timezone shifts from displaying the previous day.
00037| 00036|   - Next.js App Router defaults to Server Components, allowing direct `fs` access in `page.tsx` without API routes.
00038| 00037| ---
00039| 00038| 
00040| 00039| ## 2026-02-05 - US-004
00041| 00040| - Verified that topic tagging was already implemented in `TalkCard.tsx` and `src/lib/talks.ts` during previous steps.
00042| 00041| - Confirmed that tags are parsed from `talks.md` and rendered as styled badges.
00043| 00042| - Verified lint and build pass.
00044| 00043| - **Learnings:**
00045| 00044|   - Sometimes features are implemented ahead of schedule when they are tightly coupled with data parsing logic.
00046| 00045|   - Validated that existing implementation met all acceptance criteria without new code.
00047| 00046| ---
00048| 00047| 
00049| </file>
00050| 
00051| ## 2026-02-05 - US-005
00052| - Implemented `fetchAbstract` utility in `src/lib/talks.ts` using `cheerio` to scrape meta descriptions.
00053| - Updated `getTalks` to be asynchronous and fetch abstracts in parallel.
00054| - Updated `src/app/page.tsx` to await `getTalks`.
00055| - Updated `src/components/TalkCard.tsx` to display the abstract.
00056| - Added `vitest` and wrote unit tests for `fetchAbstract`.
00057| - **Learnings:**
00058|   - Migrating a synchronous data utility to asynchronous in Next.js App Router requires updating the consuming Server Components to be `async`.
00059|   - `cheerio` provides a robust and familiar jQuery-like API for parsing HTML in Node.js environments.
00060|   - Added `vitest` for unit testing as it supports TypeScript out of the box.
00061| ---
00062| 
