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

## Tools

| Tool | What it does |
|---|---|
| `search_cases` | Search legislative cases/bills by keyword in the Danish title |
| `get_case_details` | Fetch one case's full summary by numeric id |
| `search_actors` | Search MPs/committees/ministries by name |
| `get_case_votes` | Fetch voting session(s) and tallies for a case |

## Design decisions

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

## What I skipped

- Document (`Dokument`) search/retrieval — a fifth tool, cut for time.
- Pagination beyond a single `top` page (no `$skip`/cursor support).
- Caching beyond the in-process `Stemmetype` label cache.
