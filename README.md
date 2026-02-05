This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Talks

Create a `talks.md` file in the project root to display your speaking engagements. Talks are automatically sorted by date (newest first).

### Format

```markdown
# My Talks

## YYYY-MM-DD | [Conference Name](https://conference-url.com)

### [Talk Title](https://talk-agenda-url.com)

- Abstract: Your talk description goes here.

It can span multiple paragraphs.

- Recording: [YouTube](https://youtube.com/watch?v=...)
- LinkedIn: [Post](https://linkedin.com/posts/...)
- Location: Berlin, Germany
- Language: 🇬🇧
- Tags: Tag1, Tag2, Tag3
```

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| Date | Yes | Format: `YYYY-MM-DD` |
| Conference | Yes | `[Name](url)` format |
| Title | Yes | Can be `### Title` or `### [Title](url)` |
| Abstract | No | If not provided, fetched from talk URL's meta description |
| Recording | No | `[Label](url)` format |
| LinkedIn | No | `[Label](url)` format |
| Location | No | e.g., `Berlin, Germany` |
| Language | No | Flag emoji, e.g., `🇬🇧`, `🇩🇪` |
| Tags | No | Comma-separated list |

## Speaker Profile

Create a `speaker.md` file in the project root to display your bio and social links in the header.

### Format

```markdown
# Speaker

- Name: Your Name
- Photo: /speaker.jpg
- Bio: Your short bio goes here (2-3 sentences recommended).

## Socials

- LinkedIn: https://linkedin.com/in/your-profile
- GitHub: https://github.com/your-profile
- Twitter: https://twitter.com/your-handle
- Bluesky: https://bsky.app/profile/your-handle
- YouTube: https://youtube.com/@your-channel
- Website: https://your-website.com
```

Place your photo in the `public/` folder (e.g., `public/speaker.jpg`).

Supported social platforms: LinkedIn, GitHub, Twitter/X, Bluesky, YouTube, Website (others will show a generic link icon).
