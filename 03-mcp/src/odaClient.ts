/**
 * Thin client for oda.ft.dk, the Danish parliament's (Folketinget) open
 * OData API. No API key is required - the service is fully public.
 *
 * Design notes (see PROCESS.md for the fuller reasoning):
 * - Every function returns a Result-shaped object ({ ok: true, value } |
 *   { ok: false, error }) instead of throwing. A flaky upstream API should
 *   never crash the MCP server process - it should surface as a normal,
 *   readable tool result the model can react to (e.g. "try a narrower
 *   search") instead of an unhandled exception killing the connection.
 * - Fields are flattened and renamed into plain, English-ish keys before
 *   being handed to the model. The raw OData payload includes internal
 *   bookkeeping fields (opdateringsdato, versionsnummer, generated hyperlink
 *   metadata) that add noise without adding value for a journalist's query.
 */

const BASE_URL = "https://oda.ft.dk/api";
const REQUEST_TIMEOUT_MS = 10_000;

export type OdaResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

async function odaFetch(path: string): Promise<OdaResult<unknown>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}/${path}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return {
        ok: false,
        error: `oda.ft.dk responded with HTTP ${response.status} for ${path}. The service may be rate limiting or temporarily unavailable.`,
      };
    }

    const text = await response.text();
    if (!text.trim()) {
      return { ok: false, error: "oda.ft.dk returned an empty response body." };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return {
        ok: false,
        error: "oda.ft.dk returned a response that was not valid JSON (the service occasionally falls back to an XML/HTML error page under load).",
      };
    }

    return { ok: true, value: parsed };
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      return {
        ok: false,
        error: `Request to oda.ft.dk timed out after ${REQUEST_TIMEOUT_MS / 1000}s.`,
      };
    }
    return {
      ok: false,
      error: `Network error contacting oda.ft.dk: ${e instanceof Error ? e.message : String(e)}`,
    };
  } finally {
    clearTimeout(timeout);
  }
}

/** Extracts the `.value` array OData wraps list responses in, defensively. */
function extractRows(payload: unknown): OdaResult<Record<string, unknown>[]> {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "value" in payload &&
    Array.isArray((payload as { value: unknown }).value)
  ) {
    return { ok: true, value: (payload as { value: Record<string, unknown>[] }).value };
  }
  return {
    ok: false,
    error: "Unexpected response shape from oda.ft.dk: missing a `value` array.",
  };
}

function odataStringLiteral(s: string): string {
  // OData string literals are single-quoted; escape embedded quotes by doubling them.
  return `'${s.replace(/'/g, "''")}'`;
}

// ---------------------------------------------------------------------------
// Sag (case / bill)
// ---------------------------------------------------------------------------

export type CaseSummary = {
  id: number;
  title: string;
  caseNumber: string | null;
  resume: string | null;
  statusUpdatedAt: string | null;
};

function flattenCase(row: Record<string, unknown>): CaseSummary {
  return {
    id: typeof row.id === "number" ? row.id : Number(row.id),
    title: typeof row.titel === "string" ? row.titel : "(no title)",
    caseNumber: typeof row.nummer === "string" ? row.nummer : null,
    resume: typeof row.resume === "string" ? row.resume : null,
    statusUpdatedAt: typeof row.opdateringsdato === "string" ? row.opdateringsdato : null,
  };
}

export async function searchCases(query: string, top: number): Promise<OdaResult<CaseSummary[]>> {
  const filter = `substringof(${odataStringLiteral(query)}, titel)`;
  const path = `Sag?$filter=${encodeURIComponent(filter)}&$top=${top}&$orderby=opdateringsdato desc&$format=json`;
  const res = await odaFetch(path);
  if (!res.ok) return res;
  const rows = extractRows(res.value);
  if (!rows.ok) return rows;
  return { ok: true, value: rows.value.map(flattenCase) };
}

export async function getCase(id: number): Promise<OdaResult<CaseSummary>> {
  const path = `Sag(${id})?$format=json`;
  const res = await odaFetch(path);
  if (!res.ok) return res;
  if (typeof res.value !== "object" || res.value === null) {
    return { ok: false, error: `No case found with id ${id}.` };
  }
  return { ok: true, value: flattenCase(res.value as Record<string, unknown>) };
}

// ---------------------------------------------------------------------------
// Aktør (member of parliament / committee / ministry, etc.)
// ---------------------------------------------------------------------------

export type ActorSummary = {
  id: number;
  name: string;
  typeId: number | null;
  born: string | null;
  biography: string | null;
};

function flattenActor(row: Record<string, unknown>): ActorSummary {
  return {
    id: typeof row.id === "number" ? row.id : Number(row.id),
    name: typeof row.navn === "string" ? row.navn : "(no name)",
    typeId: typeof row.typeid === "number" ? row.typeid : null,
    born: typeof row.fodselsdato === "string" ? row.fodselsdato : null,
    biography: typeof row.biografi === "string" ? row.biografi : null,
  };
}

export async function searchActors(query: string, top: number): Promise<OdaResult<ActorSummary[]>> {
  const filter = `substringof(${odataStringLiteral(query)}, navn)`;
  const path = `Akt%C3%B8r?$filter=${encodeURIComponent(filter)}&$top=${top}&$format=json`;
  const res = await odaFetch(path);
  if (!res.ok) return res;
  const rows = extractRows(res.value);
  if (!rows.ok) return rows;
  return { ok: true, value: rows.value.map(flattenActor) };
}

// ---------------------------------------------------------------------------
// Afstemning + Stemme (voting sessions and individual votes) for a case
// ---------------------------------------------------------------------------

export type VoteTally = {
  votingSessionId: number;
  conclusion: string | null;
  votingDate: string | null;
  totals: Record<string, number>;
};

/**
 * Vote type labels (Stemmetype) are resolved dynamically from the API
 * rather than hardcoded. An earlier draft hardcoded a guessed
 * id -> for/against/abstain/absent mapping, which is exactly the kind of
 * plausible-but-unverified assumption this exercise's PROCESS.md asks
 * about: I could not confirm the real id ordering from the documentation
 * I had time to check, and getting it wrong would silently mislabel every
 * vote tally. Fetching Stemmetype's own `type` field and using it as the
 * bucket key removes the guess entirely, at the cost of one extra request
 * (cached per-process below).
 */
let stemmetypeCache: Record<number, string> | null = null;

async function getStemmetypeLabels(): Promise<OdaResult<Record<number, string>>> {
  if (stemmetypeCache) return { ok: true, value: stemmetypeCache };
  const res = await odaFetch("Stemmetype?$format=json");
  if (!res.ok) return res;
  const rows = extractRows(res.value);
  if (!rows.ok) return rows;
  const map: Record<number, string> = {};
  for (const row of rows.value) {
    const id = typeof row.id === "number" ? row.id : null;
    const label = typeof row.type === "string" ? row.type : null;
    if (id !== null && label !== null) map[id] = label;
  }
  stemmetypeCache = map;
  return { ok: true, value: map };
}

export async function getCaseVotes(caseId: number): Promise<OdaResult<VoteTally[]>> {
  // Afstemning is linked to Sagstrin, which is linked to Sag - there's no
  // direct Sag -> Afstemning foreign key, so we go through Sagstrin.
  const sagstrinPath = `Sagstrin?$filter=${encodeURIComponent(`sagid eq ${caseId}`)}&$format=json`;
  const sagstrinRes = await odaFetch(sagstrinPath);
  if (!sagstrinRes.ok) return sagstrinRes;
  const sagstrinRows = extractRows(sagstrinRes.value);
  if (!sagstrinRows.ok) return sagstrinRows;

  const sagstrinIds = sagstrinRows.value
    .map((r) => r.id)
    .filter((id): id is number => typeof id === "number");

  if (sagstrinIds.length === 0) {
    return { ok: true, value: [] };
  }

  const idFilter = sagstrinIds.map((id) => `sagstrinid eq ${id}`).join(" or ");
  const afstemningPath = `Afstemning?$filter=${encodeURIComponent(idFilter)}&$format=json`;
  const afstemningRes = await odaFetch(afstemningPath);
  if (!afstemningRes.ok) return afstemningRes;
  const afstemningRows = extractRows(afstemningRes.value);
  if (!afstemningRows.ok) return afstemningRows;

  const labelsRes = await getStemmetypeLabels();
  const labels = labelsRes.ok ? labelsRes.value : {};

  const tallies: VoteTally[] = [];
  for (const session of afstemningRows.value) {
    const sessionId = typeof session.id === "number" ? session.id : null;
    if (sessionId === null) continue;

    const stemmePath = `Stemme?$filter=${encodeURIComponent(`afstemningid eq ${sessionId}`)}&$format=json`;
    const stemmeRes = await odaFetch(stemmePath);
    const totals: Record<string, number> = {};

    if (stemmeRes.ok) {
      const stemmeRows = extractRows(stemmeRes.value);
      if (stemmeRows.ok) {
        for (const vote of stemmeRows.value) {
          const typeId = typeof vote.typeid === "number" ? vote.typeid : null;
          const label = typeId !== null ? labels[typeId] : undefined;
          const key = label ?? `unknown_type_${typeId}`;
          totals[key] = (totals[key] ?? 0) + 1;
        }
      }
      // If the per-session vote fetch fails, we still report the session
      // with empty totals rather than failing the whole case's vote report.
    }

    tallies.push({
      votingSessionId: sessionId,
      conclusion: typeof session.konklusion === "string" ? session.konklusion : null,
      votingDate: typeof session.opdateringsdato === "string" ? session.opdateringsdato : null,
      totals,
    });
  }

  return { ok: true, value: tallies };
}
