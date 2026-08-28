Projekt Y — Part 3: MCP server for oda.ft.dk

An MCP server that gives an LLM agent access to the Danish parliament's
(Folketinget) open data API (oda.ft.dk) — legislative cases, MPs/committees,
and voting results.

Running it

```bash
npm install
npm run build
```

This produces `dist/index.js`, which speaks MCP over stdio.

No API key or credentials are needed — oda.ft.dk is a fully public,
unauthenticated OData API.

Offline / fixture mode

For a deterministic demo that doesn't depend on the live API being
reachable, set:

```bash
ODA_MCP_OFFLINE=1
```

as an environment variable before starting the server. All four tools then
return small, hand-written fixture datasets instead of calling oda.ft.dk.

Connecting it to Claude Desktop

1. Open Claude Desktop → Settings → Developer → Edit Config.
2. Add an entry to `mcpServers`:

```json
{
  "mcpServers": {
    "oda-ft": {
      "command": "node",
      "args": ["/absolute/path/to/03-mcp/dist/index.js"]
    }
  }
}
```

3. Restart Claude Desktop. The four tools (`search_cases`, `get_case_details`,
   `search_actors`, `get_case_votes`) should appear as available tools in a
   new conversation.

Tools

| Tool | What it does |
|---|---|
| `search_cases` | Search legislative cases/bills by keyword in the Danish title |
| `get_case_details` | Fetch one case's full summary by numeric id |
| `search_actors` | Search MPs/committees/ministries by name |
| `get_case_votes` | Fetch voting session(s) and tallies for a case |

Design decisions

- **Which endpoints are exposed**: `Sag` (cases), `Aktør` (people/committees),
  and the `Sagstrin` → `Afstemning` → `Stemme` chain (votes), because these
  are what a journalist would actually want to ask about — "what bills exist
  on topic X", "who is this person", "how did the vote on case Y go".
  oda.ft.dk has ~50 entities; most (meeting minutes formatting metadata,
  internal role-junction tables) aren't useful to expose directly to a model.
- **Flattening**: raw OData rows are mapped into small, renamed objects
  (`title` instead of `titel`, etc.) before being returned, dropping
  OData bookkeeping fields the model doesn't need.
- **Error handling**: every upstream call goes through a single `odaFetch`
  wrapper with a 10s timeout, and returns a `Result`-shaped value
  (`{ok: true, value} | {ok: false, error}`) instead of throwing — the same
  pattern used in Part 1's `verifyClaim`. A malformed, empty, or slow
  response becomes a normal tool result the model can read and react to
  ("no results found", "the service timed out") rather than a crashed
  process.
- **No hardcoded vote-type mapping**: see the comment in `odaClient.ts` —
  I initially guessed the Stemmetype id→label mapping and caught myself
  not being able to verify it; the final version resolves labels from the
  live `Stemmetype` endpoint instead of guessing. Documented in
  `PROCESS.md`.

What I skipped

- Document (`Dokument`) search/retrieval — a fifth tool, cut for time.
- Pagination beyond a single `top` page (no `$skip`/cursor support).
- Caching beyond the in-process `Stemmetype` label cache.

Verified working, live

All four tools were tested against the live oda.ft.dk API, connected
through Claude Desktop:

- `search_cases` — searched for "udlændinge" (immigration), returned 20
  real bills (L 15, L 16, L 17, L 21, etc.) with correct titles and dates.
- `get_case_votes` — fetched the vote tally for case L 15; also surfaced
  a real discrepancy between the API's numeric `totals` and the case's
  official narrative conclusion (see `PROCESS.md`).
- `get_case_details` — fetched case id 1, a minimal committee record with
  no case number or summary, correctly showing that not every case is a
  full bill. Screenshot: `screenshots/get-case-details-example.png`.
- `search_actors` — searched for "Frederiksen", correctly returned the
  current PM (Mette Frederiksen) plus several unrelated historical MPs
  sharing the surname. Screenshot: `screenshots/search-actors-frederiksen.png`.

AI assistance

Claude wrote most of the implementation code (the OData client, tool
registration, flattening logic) based on my decisions about which
entities to expose and how errors should be handled. I reviewed the
generated code, caught and had it fix the hardcoded vote-type mapping
issue described above and in PROCESS.md, and did all the live testing
against Claude Desktop myself. See PROCESS.md for the full breakdown of
what I handed to the model versus decided myself.