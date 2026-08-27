# PROCESS.md

## 1. What I wrote down before I started prompting

- The tools needed to answer real journalist questions: "what bills exist
  on topic X", "who is this MP", "how did case Y's vote go" — not just a
  1:1 wrapper around every oda.ft.dk entity.
- Non-negotiables: no API key handling (the service doesn't need one), every
  upstream call must return a `Result`-shaped value instead of throwing, and
  an offline/fixture mode so the server is runnable without depending on
  oda.ft.dk being reachable at grading time.
- I did not pre-design the exact TypeScript shapes before prompting — I let
  the first draft come out, then reviewed and corrected it, which is where
  most of the interesting decisions in this file happened.

## 2. What I handed to the model vs. kept for myself

I handed over: the OData query construction, the MCP SDK boilerplate
(`registerTool`, zod schemas), and the flattening/mapping logic once I'd
decided which fields mattered.

I kept for myself: which entities to expose at all (I looked at the raw
`oda.ft.dk/api/` service document myself before deciding on `Sag`, `Aktør`,
`Afstemning`/`Stemme`, rather than asking the model to pick), and the
decision to resolve vote-type labels dynamically rather than trust a guessed
mapping (see #4 below).

## 3. Prompts that mattered

- "Look at the actual oda.ft.dk service document and tell me the real entity
  names before we write any code" — this caught that the entity is `Sag`,
  not `Case` or `Bill`, and that actors are `Aktør` (with the ø), which
  needs URL-encoding in every path. Skipping this and guessing English-ish
  names would have produced code that 404s on every request.
- "Build getCaseVotes by joining Sag to its votes" — this went wrong the
  first time (see #4): the model produced a plausible-looking function that
  assumed a direct `Sag → Afstemning` relationship. There isn't one; the
  real chain is `Sag → Sagstrin → Afstemning → Stemme`. I only caught this
  by cross-checking against how the oda.ft.dk documentation describes the
  schema, not by running the code (I couldn't install the real MCP SDK in
  my sandboxed dev environment - no registry access - so nothing here was
  actually executed against the live API before hand-off).

## 4. A moment the assistant produced something plausible and wrong

The first version of the vote-tallying code hardcoded a guess: `1 → for,
2 → against, 3 → abstain, 4 → absent` for `Stemmetype` ids. It looked
completely reasonable — small sequential ids, an obvious-seeming order —
and it would have silently mislabeled every vote count without ever
throwing an error. I caught it because I searched for independent
confirmation of the actual id ordering and couldn't find a source I
trusted enough to hardcode from.

The fix: fetch `Stemmetype` from the API itself at runtime and build the
id→label map from its own `type` field, cached once per process, instead of
hardcoding the mapping. This is a case where I would rather resolve
external identifiers from their own source of truth than assume a specific
numbering scheme.

The broader takeaway I'd apply next time: any time a "helpful" mapping
maps small integers to human labels, treat it as a guess until confirmed
against the actual schema, not just "this looks like the natural order."

## 5. How I'd know, three months from now, that this server had quietly
   stopped being useful

- oda.ft.dk changing field names or the `Sagstrin`/`Afstemning` relationship
  shape would silently return empty results rather than errors (both are
  "no rows" from the server's point of view) — I'd want a scheduled smoke
  test that runs `search_cases("lov")` and asserts a non-empty result, since
  a query for a term that generically common ("lov" = "law") going to zero
  results is a strong signal something upstream changed.
- Growth of oda.ft.dk's schema (new entities, renamed fields) wouldn't break
  anything loudly since every field access here is a defensive `typeof`
  check with a fallback to `null` — which is safe, but also means a renamed
  field would silently turn into all-null output instead of an error. I'd
  want the smoke test above to also assert that returned objects aren't
  all-null.
