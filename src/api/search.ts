import { useQuery } from "@tanstack/react-query";
import type { Paper, SearchResult } from "@/types";
import { apiGet, API_CONFIG, validateResponse } from "./client";
import { isSearchResultArray } from "./validators";
import { mockPapers } from "@/data/mockPapers";
import { delay } from "@/lib/utils";

function buildExcerpt(text: string, query: string, maxLength = 220): string {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, maxLength) + (text.length > maxLength ? "…" : "");
  const start = Math.max(0, idx - 60);
  const end = Math.min(text.length, idx + query.length + 160);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < text.length ? "…" : "";
  return prefix + text.slice(start, end) + suffix;
}

function searchPapers(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  mockPapers.forEach((paper: Paper) => {
    const title = paper.title.toLowerCase();
    const description = paper.description.toLowerCase();
    const tags = paper.tags.map((t) => t.name.toLowerCase());
    const authors = paper.authors.map((a) => a.name.toLowerCase());

    const sectionMatches = paper.sections.filter((section) => {
      const sectionText = section.blocks
        .filter((b): b is Extract<typeof b, { text: string }> => "text" in b && typeof b.text === "string")
        .map((b) => b.text)
        .join(" ")
        .toLowerCase();
      return section.title.toLowerCase().includes(q) || sectionText.includes(q);
    });

    const titleMatch = title.includes(q);
    const descMatch = description.includes(q);
    const tagMatch = tags.some((tag) => tag.includes(q));
    const authorMatch = authors.some((author) => author.includes(q));
    const sectionMatch = sectionMatches.length > 0;

    if (!titleMatch && !descMatch && !tagMatch && !authorMatch && !sectionMatch) return;

    const score =
      (titleMatch ? (title === q ? 160 : 100) : 0) +
      (descMatch ? 40 : 0) +
      (tagMatch ? 30 : 0) +
      (authorMatch ? 25 : 0) +
      (sectionMatch ? 15 : 0);

    const excerptSource =
      descMatch
        ? paper.description
        : sectionMatches[0]?.blocks.find(
            (b): b is Extract<typeof b, { text: string }> =>
              "text" in b && typeof b.text === "string"
          )?.text ?? paper.description;

    const excerpt = buildExcerpt(excerptSource, q);

    results.push({
      paper,
      excerpt,
      matches: [
        ...(titleMatch ? [{ field: "title" as const, text: paper.title, highlight: paper.title }] : []),
        ...(descMatch ? [{ field: "description" as const, text: paper.description, highlight: excerpt }] : []),
        ...(tagMatch ? [{ field: "tag" as const, text: paper.tags.map((t) => t.name).join(", "), highlight: q }] : []),
        ...(authorMatch ? [{ field: "author" as const, text: paper.authors.map((a) => a.name).join(", "), highlight: q }] : []),
        ...(sectionMatch ? [{ field: "section" as const, text: sectionMatches[0].title, highlight: q }] : []),
      ],
      score,
    });
  });

  return results.sort((a, b) => b.score - a.score || a.paper.title.localeCompare(b.paper.title));
}

async function performSearch(
  query: string,
  signal?: AbortSignal
): Promise<SearchResult[]> {
  if (API_CONFIG.useMock) {
    await delay(220);
    return searchPapers(query);
  }
  const data = await apiGet<unknown>("/api/public/search", {
    signal,
    params: { q: query },
  });
  return validateResponse(data, isSearchResultArray, "INVALID_SEARCH_RESPONSE");
}

export const searchQueryKeys = {
  all: ["search"] as const,
  query: (q: string) => ["search", q] as const,
};

export function useSearchQuery(query: string) {
  return useQuery({
    queryKey: searchQueryKeys.query(query),
    queryFn: ({ signal }) => performSearch(query, signal),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60,
  });
}