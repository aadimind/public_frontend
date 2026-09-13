// Standalone smoke tests for validators and URL safety.
// Run with: node --experimental-strip-types scripts/smoke.mts
// This file deliberately avoids any test framework — it is the smallest
// reproducible verification of the runtime API/URL contracts.

import { isPaper, isPaginatedPapers } from "../src/api/validators.ts";
import { safeHref, isSafeUrl } from "../src/lib/url.ts";
import { unwrapEnvelope, errorKindOf, publicErrorMessage, ApiClientError, apiGet, isApiClientError } from "../src/api/client.ts";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

let failures = 0;
const test = (name: string, cond: boolean) => {
  if (!cond) {
    console.error("FAIL:", name);
    failures++;
  } else {
    console.log("ok  :", name);
  }
};

const goodPaper = {
  id: "p1",
  slug: "s",
  title: "t",
  description: "d",
  authors: [{ id: "a", name: "A" }],
  category: { id: "c", slug: "c", name: "C" },
  tags: [{ id: "t", slug: "t", name: "T" }],
  publishedAt: "2024-01-01",
  readingTime: 5,
  difficulty: "beginner",
  sections: [{ id: "intro", title: "Intro", blocks: [{ type: "paragraph", text: "hi" }] }],
};

test("isPaper accepts valid", isPaper(goodPaper));
test(
  "isPaper rejects missing id",
  !isPaper({ ...goodPaper, id: undefined })
);
test(
  "isPaper rejects wrong difficulty",
  !isPaper({ ...goodPaper, difficulty: "wizard" })
);
test(
  "isPaper rejects malformed block",
  !isPaper({
    ...goodPaper,
    sections: [
      { id: "x", title: "x", blocks: [{ type: "code", code: 1 }] },
    ],
  })
);

const goodPage = { items: [goodPaper], nextCursor: "12", hasMore: true, total: 24 };
test("isPaginatedPapers accepts valid", isPaginatedPapers(goodPage));
test(
  "isPaginatedPapers rejects malformed item",
  !isPaginatedPapers({ items: [{ bad: true }] })
);

test("safeHref: javascript: rejected", safeHref("javascript:alert(1)") === "#");
test(
  "safeHref: data: rejected",
  safeHref("data:text/html,<script>1</script>") === "#"
);
test("safeHref: vbscript: rejected", safeHref("vbscript:msgbox(1)") === "#");
test(
  "safeHref: https accepted",
  safeHref("https://example.com") === "https://example.com"
);
test(
  "safeHref: mailto accepted",
  safeHref("mailto:hi@example.com") === "mailto:hi@example.com"
);
test("safeHref: relative accepted", safeHref("/papers/abc") === "/papers/abc");
test("safeHref: hash accepted", safeHref("#section") === "#section");
test("safeHref: empty falls back", safeHref("") === "#");
test(
  "safeHref: undefined falls back",
  safeHref(undefined) === "#"
);
test("isSafeUrl rejects garbage", !isSafeUrl("not a url at all actually"));

// Public V1 (docs/public-contract.md §1/§5): backend envelope unwrapping.
test(
  "unwrapEnvelope extracts data",
  (unwrapEnvelope({ success: true, data: { items: [] } }) as { items: unknown[] }).items.length === 0
);
test(
  "unwrapEnvelope passes bare bodies through",
  (unwrapEnvelope({ items: [] }) as { items: unknown[] }).items.length === 0
);
test("unwrapEnvelope passes null/strings/arrays through", unwrapEnvelope(null) === null);
test("unwrapEnvelope passes arrays through", Array.isArray(unwrapEnvelope([1, 2])));
test("errorKindOf classifies non-errors as UNKNOWN", errorKindOf(new Error("x")) === "UNKNOWN");
test("errorKindOf classifies unknown codes as UNKNOWN", errorKindOf(new ApiClientError(500, "x", "WEIRD")) === "UNKNOWN");
test(
  "publicErrorMessage covers UNKNOWN safely",
  publicErrorMessage(new Error("db exploded")) === "Something went wrong. Please try again."
);

// V1 omits difficulty (no canonical source); the guard must accept its
// absence while still rejecting unknown values.
const noDifficulty = { ...goodPaper };
delete (noDifficulty as Record<string, unknown>)["difficulty"];
test("isPaper accepts omitted difficulty", isPaper(noDifficulty));
test(
  "isPaper still rejects wrong difficulty",
  !isPaper({ ...goodPaper, difficulty: "wizard" })
);

// Error-kind classification for UI failure states (prompt §22).
test(
  "errorKindOf maps 429 RATE_LIMITED",
  errorKindOf(new ApiClientError(429, "Too Many Requests", "RATE_LIMITED")) === "RATE_LIMITED"
);
test(
  "errorKindOf maps 404 NOT_FOUND",
  errorKindOf(new ApiClientError(404, "Not Found", "NOT_FOUND")) === "NOT_FOUND"
);
test(
  "publicErrorMessage never echoes backend text",
  publicErrorMessage(new ApiClientError(500, "sqlite oops", "INTERNAL_ERROR")) ===
    "Something went wrong. Please try again."
);

// Gate 1 boundary scans (prompt §23): the public frontend must never call
// admin/authenticated API namespaces, and every real-mode path must target
// the public namespace (docs/public-contract.md §3).
const smokeRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "api");
const apiSources = readdirSync(smokeRoot)
  .filter((entry) => entry.endsWith(".ts"))
  .map((entry) => readFileSync(join(smokeRoot, entry), "utf8"))
  .join("\n");
for (const forbidden of ["/api/content", "/api/research", "/api/admin", "/api/auth", "/api/analytics"]) {
  test(`public api never calls ${forbidden}`, !apiSources.includes(`"${forbidden}`));
}
const realPaths = [...apiSources.matchAll(/apiGet<unknown>\(\s*[`"']([^`"']+)[`"']/g)].map((m) => m[1]);
test("real-mode api has paths", realPaths.length > 0);
test(
  "every real-mode path targets /api/public",
  realPaths.every((path) => path.startsWith("/api/public/"))
);

// Gate 3 J22 — transport failure behavior with a stubbed fetch. No network
// is touched; each case restores the original global afterwards.
const originalFetch = globalThis.fetch;
process.env.VITE_API_BASE_URL = "https://smoke.test";
const stubFetch = (handler: () => Promise<Response> | Response): void => {
  globalThis.fetch = (() => handler()) as typeof fetch;
};
const jsonHeaders = { "content-type": "application/json" };

stubFetch(() => Promise.reject(new Error("boom")));
try {
  await apiGet("/api/public/papers");
  test("network failure throws", false);
} catch (error) {
  test(
    "network failure maps to NETWORK_ERROR",
    isApiClientError(error) && error.code === "NETWORK_ERROR" && errorKindOf(error) === "NETWORK_ERROR"
  );
}

stubFetch(() => new Response("not json{{{", { status: 200, headers: jsonHeaders }));
try {
  await apiGet("/api/public/papers");
  test("invalid JSON throws", false);
} catch (error) {
  test(
    "invalid JSON maps to INVALID_JSON",
    isApiClientError(error) && error.code === "INVALID_JSON"
  );
}

stubFetch(
  () =>
    new Response(JSON.stringify({ success: false, error: { code: "RATE_LIMITED", message: "Too Many Requests" } }), {
      status: 429,
      headers: jsonHeaders,
    })
);
try {
  await apiGet("/api/public/search");
  test("429 throws", false);
} catch (error) {
  test(
    "429 preserves backend code and kind",
    isApiClientError(error) && error.code === "RATE_LIMITED" && errorKindOf(error) === "RATE_LIMITED"
  );
  test(
    "429 message is the safe UI copy",
    publicErrorMessage(error) === "Too many requests. Please wait a moment and try again."
  );
}

stubFetch(
  () => new Response(JSON.stringify({ success: true, data: { items: [] } }), { status: 200, headers: jsonHeaders })
);
test(
  "apiGet unwraps the backend envelope",
  ((await apiGet<{ items: unknown[] }>("/api/public/papers")) as { items: unknown[] }).items.length === 0
);
globalThis.fetch = originalFetch;

if (failures > 0) {
  console.error("Total failures:", failures);
  process.exit(1);
}
console.log("All smoke tests passed.");