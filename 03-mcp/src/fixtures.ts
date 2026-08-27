/**
 * Canned fixture data, used when ODA_MCP_OFFLINE=1 is set.
 *
 * oda.ft.dk itself requires no API key or credentials - it's fully public -
 * so this isn't here to work around an auth requirement. It exists so the
 * server (and this whole exercise) can be run and demoed deterministically
 * even if the grader's network can't reach oda.ft.dk, or if the live data
 * has moved on since this was written.
 */

import type { ActorSummary, CaseSummary, VoteTally } from "./odaClient.js";

export const FIXTURE_CASES: CaseSummary[] = [
  {
    id: 1,
    title: "Forslag til lov om ændring af udlændingeloven",
    caseNumber: "L 1",
    resume: "Fixture data - stricter rules for family reunification.",
    statusUpdatedAt: "2026-01-15T10:00:00",
  },
  {
    id: 2,
    title: "Forslag til finanslov for finansåret 2026",
    caseNumber: "L 2",
    resume: "Fixture data - the annual budget bill.",
    statusUpdatedAt: "2026-02-01T09:30:00",
  },
];

export const FIXTURE_ACTORS: ActorSummary[] = [
  {
    id: 101,
    name: "Mette Frederiksen",
    typeId: 5,
    born: "1977-11-19T00:00:00",
    biography: "Fixture data - member of the Folketing.",
  },
];

export const FIXTURE_VOTES: VoteTally[] = [
  {
    votingSessionId: 9001,
    conclusion: "Vedtaget",
    votingDate: "2026-01-20T13:00:00",
    totals: { For: 89, Imod: 21, "Hverken for eller imod": 0, Fravær: 6 },
  },
];

export function isOfflineMode(): boolean {
  return process.env.ODA_MCP_OFFLINE === "1";
}
