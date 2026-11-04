# misanthropic.codes

Portfolio site for Abhishek Kumar. Next.js 15 (App Router), no UI framework: the design system
lives in `app/globals.css` as tokens with a dark and a light theme.

All content comes from the portfolio backend (`portfolio-backend`). If the API is unreachable,
pages fall back to `data/data.json`, so the site still builds and renders.

## Setup

```bash
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5001/api" > .env.local
npm run dev
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend base URL, e.g. `https://<backend-host>/api` |

## Scripts

```bash
npm run dev        # local dev server
npm run build      # production build (type checked)
npm test           # unit tests for lib/ (search, replay, contributions, highlight, format, stack)
npm run typecheck
```

## Where things are

| Feature | Code | Data from the backend |
| --- | --- | --- |
| Stack graph with commit replay | `components/home/StackGraph.tsx`, `lib/replay.ts` | `/projects`, `/projects/:slug/metrics` (repo created date) |
| Project log, code reviews | `components/home/GitLog.tsx`, `components/home/CodeReviews.tsx` | `/snippets` |
| Case study, metrics, request playground | `app/projects/[id]/page.tsx`, `components/project/*` | `/projects/:slug`, `/projects/:slug/metrics` |
| GitHub activity | `components/about/GithubActivity.tsx`, `lib/contributions.ts` | `/github/contributions?year=` |
| Now page | `app/now/page.tsx` | `/now` |
| Recruiter mode and PDF | `app/cv/page.tsx` | `/resume/pdf` |
| Ask my portfolio (search) | `components/site/CommandPalette.tsx`, `lib/search.ts` | built from the page data, no AI service |
| Project brief and messages | `components/contact/ContactWidgets.tsx` | `POST /quotations`, `POST /messages` |
| Custom pointer | `components/site/Cursor.tsx` | none |
