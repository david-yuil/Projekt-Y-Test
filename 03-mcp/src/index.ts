#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchCases, getCase, searchActors, getCaseVotes } from "./odaClient.js";
import { FIXTURE_CASES, FIXTURE_ACTORS, FIXTURE_VOTES, isOfflineMode } from "./fixtures.js";

const server = new McpServer({
  name: "oda-ft-mcp-server",
  version: "1.0.0",
});

// ---------------------------------------------------------------------------
// Tool: search_cases
// ---------------------------------------------------------------------------
server.registerTool(
  "search_cases",
  {
    title: "Search Folketinget cases and bills",
    description:
      "Search Danish parliament (Folketinget) legislative cases and bills by keyword in their title. " +
      "Useful for finding bills related to a topic, e.g. 'udlændinge' (immigration) or 'finanslov' (budget). " +
      "Returns up to `top` results, most recently updated first.",
    inputSchema: {
      query: z.string().min(2).describe("Keyword to search for in the case title (Danish)."),
      top: z.number().int().min(1).max(20).default(5).describe("Max number of results (1-20)."),
    },
  },
  async ({ query, top }) => {
    if (isOfflineMode()) {
      const matches = FIXTURE_CASES.filter((c) =>
        c.title.toLowerCase().includes(query.toLowerCase()),
      ).slice(0, top);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ source: "fixture", results: matches }, null, 2),
          },
        ],
      };
    }

    const result = await searchCases(query, top);
    if (!result.ok) {
      return {
        content: [{ type: "text", text: `Could not search cases: ${result.error}` }],
        isError: true,
      };
    }
    if (result.value.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No cases found matching "${query}". Try a shorter or different keyword - the search matches substrings of the Danish title.`,
          },
        ],
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result.value, null, 2) }],
    };
  },
);

// ---------------------------------------------------------------------------
// Tool: get_case_details
// ---------------------------------------------------------------------------
server.registerTool(
  "get_case_details",
  {
    title: "Get details for one Folketinget case",
    description: "Fetch the full summary of a single legislative case by its numeric id (from search_cases).",
    inputSchema: {
      caseId: z.number().int().describe("The case's numeric id, as returned by search_cases."),
    },
  },
  async ({ caseId }) => {
    if (isOfflineMode()) {
      const found = FIXTURE_CASES.find((c) => c.id === caseId);
      if (!found) {
        return { content: [{ type: "text", text: `No fixture case with id ${caseId}.` }] };
      }
      return { content: [{ type: "text", text: JSON.stringify(found, null, 2) }] };
    }

    const result = await getCase(caseId);
    if (!result.ok) {
      return {
        content: [{ type: "text", text: `Could not fetch case ${caseId}: ${result.error}` }],
        isError: true,
      };
    }
    return { content: [{ type: "text", text: JSON.stringify(result.value, null, 2) }] };
  },
);

// ---------------------------------------------------------------------------
// Tool: search_actors
// ---------------------------------------------------------------------------
server.registerTool(
  "search_actors",
  {
    title: "Search Folketinget actors (MPs, committees, ministries)",
    description:
      "Search for a person, committee, or other 'actor' in the Danish parliament by name. " +
      "Useful for looking up an MP's id before querying their votes or documents.",
    inputSchema: {
      query: z.string().min(2).describe("Keyword to search for in the actor's name (Danish)."),
      top: z.number().int().min(1).max(20).default(5).describe("Max number of results (1-20)."),
    },
  },
  async ({ query, top }) => {
    if (isOfflineMode()) {
      const matches = FIXTURE_ACTORS.filter((a) =>
        a.name.toLowerCase().includes(query.toLowerCase()),
      ).slice(0, top);
      return {
        content: [{ type: "text", text: JSON.stringify({ source: "fixture", results: matches }, null, 2) }],
      };
    }

    const result = await searchActors(query, top);
    if (!result.ok) {
      return {
        content: [{ type: "text", text: `Could not search actors: ${result.error}` }],
        isError: true,
      };
    }
    if (result.value.length === 0) {
      return {
        content: [{ type: "text", text: `No actors found matching "${query}".` }],
      };
    }
    return { content: [{ type: "text", text: JSON.stringify(result.value, null, 2) }] };
  },
);

// ---------------------------------------------------------------------------
// Tool: get_case_votes
// ---------------------------------------------------------------------------
server.registerTool(
  "get_case_votes",
  {
    title: "Get voting results for a Folketinget case",
    description:
      "Fetch the voting session(s) and vote tallies (for/against/abstain/absent) associated with a " +
      "legislative case, by its numeric id (from search_cases). A case may have zero voting sessions " +
      "if it hasn't been voted on yet.",
    inputSchema: {
      caseId: z.number().int().describe("The case's numeric id, as returned by search_cases."),
    },
  },
  async ({ caseId }) => {
    if (isOfflineMode()) {
      return { content: [{ type: "text", text: JSON.stringify({ source: "fixture", votes: FIXTURE_VOTES }, null, 2) }] };
    }

    const result = await getCaseVotes(caseId);
    if (!result.ok) {
      return {
        content: [{ type: "text", text: `Could not fetch votes for case ${caseId}: ${result.error}` }],
        isError: true,
      };
    }
    if (result.value.length === 0) {
      return {
        content: [{ type: "text", text: `Case ${caseId} has no recorded voting sessions.` }],
      };
    }
    return { content: [{ type: "text", text: JSON.stringify(result.value, null, 2) }] };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("oda-ft-mcp-server running on stdio" + (isOfflineMode() ? " (OFFLINE/fixture mode)" : ""));
}

main().catch((err) => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
