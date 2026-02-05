# PRD: Speaking Engagements Page

## Overview
Create a Next.js application to display speaking engagements. The data will be managed via a single `talks.md` file. The public page will display these talks chronologically, featuring links to conferences, agendas, and recordings, along with topic tags. Uniquely, the system will attempt to automatically fetch and display talk abstracts from the provided agenda links during the build process.

## Goals
- Simplify adding new talks (single file edit)
- Display talks in a chronological list
- Automate content enrichment by fetching abstracts from external links
- Provide direct access to conference details and recordings

## Quality Gates

These commands must pass for every user story:
- `npm run lint` - Code linting
- `npm run build` - Production build check
- `npm run test` - Unit tests (specifically for the scraper utility)

For UI stories, also include:
- Verify in browser using dev-browser skill

## User Stories

### US-001: Initialize Next.js Application
**Description:** As a developer, I want to set up a clean Next.js project so that I have a solid foundation for the application.

**Acceptance Criteria:**
- [ ] Initialize new Next.js project (App Router)
- [ ] Clean up default boilerplate (home page, styles)
- [ ] Ensure `npm run build` passes
- [ ] Set up basic styling framework (e.g., Tailwind CSS)

### US-002: Implement Markdown Data Source
**Description:** As a content creator, I want to manage my talks in a single `talks.md` file so that updating my portfolio is quick and simple.

**Acceptance Criteria:**
- [ ] Create `talks.md` in the project root
- [ ] Define a parsing logic for the markdown file to extract:
    - Date
    - Conference Name & Link
    - Talk Title & Link (Agenda)
    - Recording Link (optional)
    - Tags
- [ ] Implement a utility function to parse `talks.md` into a structured JSON array
- [ ] Ensure parsing handles missing optional fields gracefully

### US-003: Create Chronological Talk List
**Description:** As a visitor, I want to see a list of talks ordered by date so I can see the speaker's history and upcoming events.

**Acceptance Criteria:**
- [ ] Create a main page component to render the list
- [ ] Sort talks by date (newest first)
- [ ] Render a card/row for each talk displaying:
    - Date formatted clearly
    - Conference Name
    - Talk Title
    - Tags
    - Action buttons/links (Agenda, Recording)
- [ ] Verify visual hierarchy distinguishes between the talk title and conference name

### US-004: Implement Topic Tagging
**Description:** As a visitor, I want to see tags for each talk so I can understand the topics covered.

**Acceptance Criteria:**
- [ ] Render tags/badges for each talk based on the data
- [ ] Style tags visually to separate them from content

### US-005: Automated Abstract Retrieval
**Description:** As a content creator, I want the system to automatically find the talk abstract from the agenda link so that I don't have to manually copy it.

**Acceptance Criteria:**
- [ ] Implement a fetch utility that runs at **build time** (inside `getStaticProps` or equivalent build script)
- [ ] Scrape the "Agenda Link" URL for each talk
- [ ] Extract description using standard metadata (e.g., `<meta name="description">`, `og:description`)
- [ ] Fail silently: If the request fails or no description is found, leave the abstract blank (do not break the build)
- [ ] Display the fetched abstract in the UI (e.g., in an expandable details section or summary text)
- [ ] Write a unit test to verify the scraper extracts data correctly from a mock HTML response

## Functional Requirements
- FR-1: The system must parse a single `talks.md` file.
- FR-2: Abstract fetching must occur during the build process (Next.js Data Fetching).
- FR-3: External links must open in a new tab.
- FR-4: The layout must be responsive.

## Non-Goals
- Database integration (CMS)
- Complex manual abstract editing (fallback is just "no abstract")
- User authentication

## Technical Considerations
- **Scraping:** Use a lightweight library like `cheerio` or `jsdom` to parse the fetched HTML for metadata.
- **Performance:** Fetching abstracts for many talks might slow down the build. Consider caching results or using `Promise.all` with concurrency limits if the list grows large.

## Success Metrics
- Adding a talk takes less than 1 minute.
- Abstracts appear for supported sites without manual entry.
- Build succeeds even if external sites are down (graceful failure).

## Open Questions
- None at this stage.