/**
 * PROJEKT Y — PART 1: TYPESCRIPT
 *
 * Seven problems. Solve them in this file. Add types, helpers and files as you
 * see fit, and rename anything you think is badly named.
 *
 * Rules:
 *   - strict mode on. No `any`, no `as`, no `@ts-ignore`. If you break one of
 *     those, leave a comment saying why it was the right call.
 *   - AI assistance is allowed on this part, but we want to see how you used AI to help you solve the problems. We will ask you about your choices later.
 *   - There is no hidden test suite and no single correct answer. Several of
 *     these are open enough that the interesting part is what you decide, not
 *     whether it runs. Write down your reasoning in comments where it is not
 *     obvious from the code.
 *   - If you get stuck, leave what you have plus a comment on where the wall
 *     was. That scores better than a workaround you are not happy with.
 *
 * Context: Projekt Y is a Danish news outlet where an AI pipeline drafts
 * articles from retrieved sources and human editors approve them. A "claim" is
 * one factual assertion. A "source" is something the pipeline retrieved. The
 * thing we worry about most is a source that is about the same topic as a claim
 * without actually supporting it.
 *
 * Run it however you like: `npx tsx p1_typescript.ts`, vitest, whatever.
 */

// ============================================================================
// Shared domain
// ============================================================================

export type Source =
  | {
      kind: "wire";
      agency: "ritzau" | "reuters";
      ref: string;
      publishedAt: string;
    }
  | { kind: "web"; url: string; fetchedAt: string; publishedAt: string | null }
  | {
      kind: "register";
      register: "cvr" | "dmi" | "finnhub";
      query: string;
      retrievedAt: string;
    };

export type Support = "supports" | "related" | "contradicts";

export type Citation = { sourceId: string; support: Support; score: number };

export type Claim = { id: string; text: string; citations: Citation[] };

export type Strictness = "relaxed" | "standard" | "strict";

// ============================================================================
// 1. Citation labels
// ============================================================================
/**
 * Write citationLabel(source) returning a Danish citation string for each kind
 * of source.
 *
 * Then make it so that when someone adds a fourth variant to `Source`, this
 * function fails to compile instead of silently falling through to a default.
 */

// WRITE YOUR CODE HERE

function assertNever(x: never): never {
  throw new Error("Unexpected value" + x);
}

function citationLabel(source: Source): string {
  switch (source.kind) {
    case "wire":
      return `${source.agency} ${source.ref} ${source.publishedAt}`;
    case "web":
      return `Taget fra ${source.url}`;
    case "register":
      return `Register ${source.register}, ${source.query}`;
    default:
      return assertNever(source);
  }
}

// ============================================================================
// 2. A claim that cannot be published unnoticed
// ============================================================================
/**
 * Somewhere downstream there is a renderClaim() that turns a claim into prose.
 * A claim must never reach it without having been checked against its sources
 * first.
 *
 * Make that a compile-time guarantee rather than a code review convention.
 *
 * Write verifyClaim(claim, strictness) as the only way to produce something
 * renderClaim() will accept. The rules:
 *
 *   strict    at least one "supports" citation
 *   standard  at least one "supports" citation
 *   relaxed   at least one "related" citation is enough
 *   always    a single "contradicts" citation blocks publication
 *
 * (strict and standard being the same is deliberate. Decide what else strict
 * ought to require and implement your answer.)
 *
 * verifyClaim can fail. Do not throw. How the failure shows up in the
 * signature is most of what we are looking at here.
 */

// WRITE YOUR CODE HERE
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

function verifyClaim(
  claim: Claim,
  strictness: Strictness,
): Result<Claim, string> {
  const hasContradicts = claim.citations.some(
    (c) => c.support === "contradicts",
  );
  if (hasContradicts) {
    return { ok: false, error: "claim has a contradictory source" };
  }

  switch (strictness) {
    case "relaxed":
      const hasEnoughForRelaxed = claim.citations.some(
        (c) => c.support === "related" || c.support === "supports",
      );
      if (!hasEnoughForRelaxed) {
        return { ok: false, error: "no quote found" };
      }
      break;
    case "standard":
      const hasEnoughForStandart = claim.citations.some(
        (c) => c.support === "supports",
      );
      if (!hasEnoughForStandart) {
        return { ok: false, error: "there is no suitable source" };
      }
      break;
    case "strict":
      const hasEnoughFOrStrict = claim.citations.some(
        (c) => c.support === "supports" && c.score > 0.5,
      );
      if (!hasEnoughFOrStrict) {
        return { ok: false, error: "there is no suitable source" };
      }
      break;
    default:
      return assertNever(strictness);
  }
  return { ok: true, value: claim };
}
// I did not implement branded/opaque types, which would give a
// compile-time guarantee that renderClaim() can only accept a Claim that
// went through verifyClaim. Instead, I used Result<Claim, string> the
// failure is explicit in the signature and cannot be silently ignored,
// but this doesn't fully prevent someone from taking a raw, unverified
// Claim and passing it directly into renderClaim(), bypassing verifyClaim.
// I wasn't sure how to approach the branded-type solution within the time
// I had happy to discuss and walk through possible approaches together
// in the interview.

// ============================================================================
// 3. Reading untrusted JSON
// ============================================================================
/**
 * Story objects arrive as JSON from the pipeline over HTTP. Sometimes the
 * pipeline is wrong: a missing field, a support value we have never seen, a
 * score that is a string.
 *
 * Write the boundary. Take `unknown` in, produce something the rest of the app
 * can trust, and make a malformed payload a normal outcome rather than a crash.
 *
 * No validation library. We want to see how you think about the boundary, not
 * how well you know zod.
 */

// WRITE YOUR CODE HERE

type Story = { title: string; claims: Claim[]; uniIndetifier: number };

function isStory(x: unknown): x is Story {
  return (
    x !== null &&
    typeof x === "object" &&
    "title" in x &&
    typeof x.title === "string" &&
    "claims" in x &&
    Array.isArray(x.claims) &&
    x.claims.every(isClaim) &&
    "uniIndetifier" in x &&
    typeof x.uniIndetifier === "number"
  );
}

function checkData(input: unknown): Result<Story, string> {
  if (isStory(input)) {
    return { ok: true, value: input };
  } else {
    return { ok: false, error: "Does not comply with the rules" };
  }
}

function isCitation(x: unknown): x is Citation {
  return (
    typeof x === "object" &&
    x !== null &&
    "sourceId" in x &&
    typeof x.sourceId === "string" &&
    "support" in x &&
    (x.support === "supports" ||
      x.support === "related" ||
      x.support === "contradicts") &&
    "score" in x &&
    typeof x.score === "number"
  );
}

function isClaim(x: unknown): x is Claim {
  return (
    typeof x === "object" &&
    x !== null &&
    "id" in x &&
    typeof x.id === "string" &&
    "text" in x &&
    typeof x.text === "string" &&
    "citations" in x &&
    Array.isArray(x.citations) &&
    x.citations.every(isCitation)
  );
}

// ============================================================================
// 4. The async function
// ============================================================================
/**
 * This ships today and is wrong in more than one way. Rewrite it.
 *
 * Requirements: at most 5 requests in flight, no duplicate db.load() for the
 * same key, and a caller who can see which sources failed and why without
 * reading the logs.
 *
 * Leave a comment listing the bugs you found.
 */

declare const cache: Record<string, unknown>;
declare function fetchMetadata(s: Source): Promise<{ title: string }>;
declare const db: { load(kind: string): Promise<unknown> };

export async function enrichSources(sources: Source[]) {
  const results: unknown[] = [];
  const failures: { source: Source; error: unknown }[] = [];
  const loading = new Map<string, Promise<unknown>>();
  for (let i = 0; i < sources.length; i += 5) {
    const batch = sources.slice(i, i + 5);
    await Promise.all(
      batch.map(async (s) => {
        try {
          const meta = await fetchMetadata(s);
          let cached = cache[s.kind];
          if (cached === undefined) {
            if (!loading.has(s.kind)) {
              loading.set(s.kind, db.load(s.kind));
            }
            cached = await loading.get(s.kind);
            cache[s.kind] = cached;
          }
          results.push({ ...meta, cached });
        } catch (e) {
          failures.push({ source: s, error: e });
        }
      }),
    );
  }
  return { results, failures };
}
// Bugs found in the original code:
// 1. sources.map(async ...) doesn't wait for results "return results" runs
//    before any of the async operations finish, so it always returns [].
// 2. No concurrency limit all requests fire at once instead of max 5.
// 3. Race condition in caching if two sources with the same kind are
//    processed "in parallel", db.load() can be called twice for the same key.
// 4. Errors are only logged (console.log) and lost the caller has no way
//    to know which sources failed and why.

// ============================================================================
// 5. groupBy
// ============================================================================
/**
 * Implement groupBy(items, keyOf). Group citations by support level, claims by
 * whether they are cited, sources by agency.
 *
 * The signature is the exercise. Callers should not have to widen or narrow
 * anything afterwards.
 */

// WRITE YOUR CODE HERE

function groupBy<T, K extends number | string | symbol>(
  items: T[],
  keyOf: (item: T) => K,
): Record<K, T[]> {
  const result: Record<K, T[]> = {} as Record<K, T[]>;
  // as used here because {} has no keys yet, they're filled below
  for (const item of items) {
    const key = keyOf(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }
  return result;
}

// ============================================================================
// 6. Typed access by path
// ============================================================================
/**
 * Make this work, with the return type inferred from the string and a typo in
 * the path caught by the compiler:
 *
 *   get(story, "claims.0.citations.0.support")   // Support
 *   get(story, "claims.0.citaitons")             // compile error
 *
 * Four levels deep is plenty. This one is deliberately hard. Partial credit for
 * a version that works on object keys but not array indices, and full credit
 * for a clear comment on what you would give up to keep it readable.
 */

// WRITE YOUR CODE HERE
// I wasn't able to implement this one. From what I understand, this needs
// recursive conditional types combined with template literal types to
// parse a dot-separated string path (like "claims.0.citations.0.support")
// at the type level, and recursively index into the object array type for
// each segment to infer the final type. I ran out of time to work through
// how the recursion and the array-index case would actually be written 
// this was the hardest part of the exercise for me, exactly as the prompt
// warned. I'd be glad to work through this together in the interview.

// ============================================================================
// 7. Open question, answer in prose
// ============================================================================
/**
 * Citation strictness is currently three string values. Editorial keeps asking
 * for more knobs: per-topic rules, a minimum score, a rule that a claim about a
 * named person needs two independent sources rather than one.
 *
 * Sketch how you would model that so the rules stay data rather than becoming a
 * growing pile of if statements, and so the compiler still catches a rule that
 * refers to something that does not exist.
 *
 * Code, pseudo-code or a few paragraphs. Your call. Say what you would give up.
 */

// Instead of growing the switch in verifyClaim with more if-statements for
// every new editorial request, I would model strictness rules as data
// rather than code.I would define a Rule type with fields like topic (a union of known
// topic names, not a bare string, so a typo like "polittics" becomes a
// compile error instead of a silently-ignored rule), minSources, and
// minScore. Rules would live in an array, so adding a new requirement
// means adding a new entry, not touching the evaluation logic.
// A single generic function would read these rules and apply them to a
// claim, instead of hardcoding logic per rule inside verifyClaim.
// What I would give up: this model doesn't support arbitrary logical
// combinations of conditions (e.g. "topic X AND score > Y, OR topic Z").
// It only supports one rule per topic. A fully general rule engine would
// need a small expression language, which felt like over-engineering
// given the time I had for this exercise.
