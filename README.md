// Projekt-Y: Part 1 (TypeScript)
The top-level README's table marks this part
as "No" AI assistance, while the task file itself (`p1_typescript.ts`)
explicitly allows it if disclosed. I followed the stricter reading:
Claude never wrote or solved any part of the actual assignment. I asked
Claude for separate, unrelated practice exercises to learn concepts I
didn't know yet — discriminated unions, exhaustiveness checking with
`never`, type guards, the Result pattern, generics — practiced on those
first, and then applied the logic myself to the real tasks in
`p1_typescript.ts`. Every line in that file is code I wrote and
debugged myself; Claude reviewed it afterwards and pointed out mistakes
without rewriting it for me. This was the most demanding part of the
exercise — learning this material from scratch under time pressure.
Task 6 (typed path access) turned out too advanced to complete in the
time I had, exactly as the prompt warned — I left a comment on my
understanding instead of a working solution. Task 4 (the async
rewrite) also took longer than expected, since concurrency control was
new territory for me.

// Projekt Y — Part 2: Frontend

// Running it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

// What this is

The Projekt Y homepage: header with responsive navigation, a breaking-news
bar, a hero article, and a grid of article cards in five visual variants
(standard image card, "dagens tal" stat card, Ritzau quote card, headline
list card, and a wide "guide" card).

// Decisions where the Figma was open or silent

- **Card variants as a discriminated union.** `ArticleCard` is a union
  tagged by `kind`, rendered with a `switch` + `assertNever` — the same
  pattern used in the Part 1 TypeScript exercise.
- **Loading / empty / error / saving states**, none of which the Figma
  shows, are all implemented and reachable for review.
- **Mobile navigation** collapses into a dropdown menu behind a hamburger
  button below 700px; the hamburger is hidden entirely on desktop.
- **Bookmark button** on every card goes through idle → saving (disabled,
  spinner) → saved, simulating a real save-to-server request.

// What I skipped

- The hamburger menu doesn't link anywhere beyond toggling the nav.
- No automated tests.

// AI assistance

I wrote the initial type definitions myself (the `ArticleCard`
discriminated union, `HeroArticle`, `BreakingNews`), following the same
`kind`-tagged pattern from Part 1, and built the `Header`, `BreakingBar`,
and `HeroArticle` components myself, debugging issues as they came up
(e.g. a Vite dev-server caching issue that repeatedly served a stale
module). With time running short, Claude then wrote the remaining
components (`ArticleCard`, `ArticleGrid`, `BookmarkButton`), the CSS, and
the responsive header logic, based on my decisions about layout and
states. I tested the result in the browser myself and iterated on the
responsive behavior, which took several rounds to get right.


// Projekt-Y Part 3 (MCP server)

Claude wrote most of the implementation code (the OData client, tool
registration, flattening logic) based on my decisions about which
entities to expose and how errors should be handled. I reviewed the
generated code, caught and had it fix the hardcoded vote-type mapping
issue described in `03-mcp/PROCESS.md`, and did all the live testing
against Claude Desktop myself, verifying all four tools with real
queries. See `03-mcp/PROCESS.md` for the full breakdown of what I handed
to the model versus decided myself.