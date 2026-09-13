import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type {
  FilterMetadata,
  PaginatedResponse,
  Paper,
  PaperFilters,
} from "@/types";
import { apiGet, API_CONFIG, ApiClientError, validateResponse } from "./client";
import {
  isPaper,
  isPaperArray,
  isPaginatedPapers,
} from "./validators";
import { mockPapers } from "@/data/mockPapers";
import { mockCategories } from "@/data/mockCategories";
import { delay } from "@/lib/utils";

const PAGE_SIZE = 12;

function applyFilters(
  filters: PaperFilters,
  cursor?: string
): PaginatedResponse<Paper> {
  let items = [...mockPapers];

  if (filters.q) {
    const q = filters.q.toLowerCase();
    items = items.filter((p) => {
      const haystack = [
        p.title,
        p.description,
        p.summary ?? "",
        p.tags.map((t) => t.name).join(" "),
        p.authors.map((a) => a.name).join(" "),
        p.category.name,
      ]
 .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  if (filters.category) {
    items = items.filter(
      (p) =>
        p.category.slug === filters.category || p.category.id === filters.category
    );
  }

  if (filters.tag) {
    items = items.filter((p) =>
      p.tags.some((t) => t.slug === filters.tag || t.id === filters.tag)
    );
  }

  if (filters.difficulty) {
    items = items.filter((p) => p.difficulty === filters.difficulty);
  }

  if (filters.author) {
    items = items.filter((p) =>
      p.authors.some(
        (a) =>
          a.name.toLowerCase().includes(filters.author!.toLowerCase()) ||
          a.id === filters.author
 )
    );
  }

  if (filters.from) {
    const from = new Date(`${filters.from}T00:00:00.000`);
    if (!Number.isNaN(from.getTime())) {
      items = items.filter((p) => new Date(p.publishedAt).getTime() >= from.getTime());
    }
  }
  if (filters.to) {
    // Date inputs represent a calendar day, so include the entire end date.
    const to = new Date(`${filters.to}T23:59:59.999`);
    if (!Number.isNaN(to.getTime())) {
      items = items.filter((p) => new Date(p.publishedAt).getTime() <= to.getTime());
    }
  }

  switch (filters.sort) {
    case "oldest":
      items.sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      );
      break;
    case "popular":
      items.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
      break;
    case "relevance":
      if (filters.q) {
        const q = filters.q.toLowerCase().trim();
        const score = (p: Paper) => {
          const title = p.title.toLowerCase();
          const description = p.description.toLowerCase();
          const tagMatch = p.tags.some((t) => t.name.toLowerCase().includes(q));
          const authorMatch = p.authors.some((a) => a.name.toLowerCase().includes(q));
          const sectionMatch = p.sections.some((section) =>
            section.title.toLowerCase().includes(q) ||
            section.blocks.some(
              (block) => "text" in block && typeof block.text === "string" && block.text.toLowerCase().includes(q)
            )
          );
          return (
            (title.includes(q) ? (title === q ? 160 : 100) : 0) +
            (description.includes(q) ? 40 : 0) +
            (tagMatch ? 30 : 0) +
            (authorMatch ? 25 : 0) +
            (sectionMatch ? 15 : 0)
          );
        };
        items.sort((a, b) => score(b) - score(a) || a.title.localeCompare(b.title));
      }
      break;
    case "newest":
    default:
      items.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  }

  const parsedCursor = cursor === undefined ? 0 : Number.parseInt(cursor, 10);
  const startIndex = Number.isFinite(parsedCursor) && parsedCursor >= 0 ? parsedCursor : 0;
  const endIndex = startIndex + PAGE_SIZE;
  const slice = items.slice(startIndex, endIndex);
  const hasMore = endIndex < items.length;

  return {
    items: slice,
    nextCursor: hasMore ? String(endIndex) : undefined,
    hasMore,
    total: items.length,
  };
}

async function fetchPapers(
  filters: PaperFilters,
  cursor?: string,
  signal?: AbortSignal
): Promise<PaginatedResponse<Paper>> {
  if (API_CONFIG.useMock) {
    await delay(350);
    return applyFilters(filters, cursor);
  }
  // V1 honesty: `difficulty` has no canonical backend source, so it is
  // never sent in real mode (a bookmarked ?difficulty= must not pretend to
  // filter). Mock mode keeps local filtering for development.
  const { difficulty: _omittedDifficulty, ...realFilters } = filters;
  void _omittedDifficulty;
  const data = await apiGet<unknown>("/api/public/papers", {
    signal,
    params: {
      ...realFilters,
      cursor,
      limit: PAGE_SIZE,
    },
  });
  return validateResponse(data, isPaginatedPapers, "INVALID_PAPERS_RESPONSE");
}

async function fetchPaperBySlug(
  slug: string,
  signal?: AbortSignal
): Promise<Paper> {
  if (API_CONFIG.useMock) {
    await delay(250);
    const paper = mockPapers.find((p) => p.slug === slug);
    if (!paper) {
      throw new ApiClientError(404, "Paper not found", "NOT_FOUND");
    }
    return paper;
  }
  const data = await apiGet<unknown>(`/api/public/papers/${encodeURIComponent(slug)}`, { signal });
  return validateResponse(data, isPaper, "INVALID_PAPER_RESPONSE");
}

async function fetchFeaturedPapers(signal?: AbortSignal): Promise<Paper[]> {
  if (API_CONFIG.useMock) {
    await delay(200);
    return mockPapers.filter((p) => p.isFeatured).slice(0, 3);
  }
  const data = await apiGet<unknown>("/api/public/papers/featured", { signal });
  return validateResponse(data, isPaperArray, "INVALID_FEATURED_RESPONSE");
}

async function fetchLatestPapers(
  limit = 6,
  signal?: AbortSignal
): Promise<Paper[]> {
  if (API_CONFIG.useMock) {
    await delay(200);
    return [...mockPapers]
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
      )
      .slice(0, limit);
  }
  const data = await apiGet<unknown>("/api/public/papers/latest", {
    signal,
    params: { limit },
  });
  return validateResponse(data, isPaperArray, "INVALID_LATEST_RESPONSE");
}

async function fetchRelatedPapers(
  paper: Paper,
  signal?: AbortSignal
): Promise<Paper[]> {
  if (API_CONFIG.useMock) {
    await delay(180);
    return mockPapers
      .filter(
        (p) =>
          p.id !== paper.id &&
          (p.category.id === paper.category.id ||
            p.tags.some((t) => paper.tags.some((pt) => pt.id === t.id)))
      )
      .slice(0, 4);
  }
  const data = await apiGet<unknown>(
    `/api/public/papers/${encodeURIComponent(paper.slug)}/related`,
    { signal }
  );
  return validateResponse(data, isPaperArray, "INVALID_RELATED_RESPONSE");
}

async function fetchPapersByCategory(
  categorySlug: string,
  signal?: AbortSignal
): Promise<Paper[]> {
  if (API_CONFIG.useMock) {
    await delay(200);
    return mockPapers.filter((p) => p.category.slug === categorySlug);
  }
  const data = await apiGet<unknown>(
    `/api/public/categories/${encodeURIComponent(categorySlug)}/papers`,
    { signal }
  );
  return validateResponse(data, isPaperArray, "INVALID_CATEGORY_PAPERS_RESPONSE");
}

function getMockFilterMetadata(): FilterMetadata {
  const tagMap = new Map<string, { id: string; slug: string; name: string }>();
  for (const paper of mockPapers) {
    for (const tag of paper.tags) {
      if (!tagMap.has(tag.id)) tagMap.set(tag.id, tag);
    }
  }
  return {
    categories: [...mockCategories],
    tags: Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
  };
}

async function fetchFilterMetadata(signal?: AbortSignal): Promise<FilterMetadata> {
  if (API_CONFIG.useMock) {
    await delay(100);
    return getMockFilterMetadata();
  }
  const data = await apiGet<unknown>("/api/public/filters/metadata", { signal });
  return validateResponse(data, (value): value is FilterMetadata => {
    if (!value || typeof value !== "object") return false;
    const v = value as { categories?: unknown; tags?: unknown };
    return (
      Array.isArray(v.categories) &&
      v.categories.every((c) => typeof c === "object" && c !== null) &&
      Array.isArray(v.tags) &&
      v.tags.every((t) => typeof t === "object" && t !== null)
    );
  });
}

// React Query hooks
export const papersQueryKeys = {
  all: ["papers"] as const,
  list: (filters: PaperFilters) => ["papers", "list", filters] as const,
  detail: (slug: string) => ["papers", "detail", slug] as const,
  featured: () => ["papers", "featured"] as const,
  latest: () => ["papers", "latest"] as const,
  related: (slug: string) => ["papers", "related", slug] as const,
  byCategory: (slug: string) => ["papers", "by-category", slug] as const,
  filterMetadata: () => ["papers", "filter-metadata"] as const,
};

export function usePapersQuery(filters: PaperFilters) {
  return useInfiniteQuery({
    queryKey: papersQueryKeys.list(filters),
    queryFn: ({ pageParam, signal }) =>
      fetchPapers(filters, pageParam as string | undefined, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export function usePaperQuery(slug: string | undefined) {
  return useQuery({
    queryKey: slug ? papersQueryKeys.detail(slug) : ["papers", "detail", "none"],
    queryFn: ({ signal }) => {
      if (!slug) throw new Error("Slug is required");
      return fetchPaperBySlug(slug, signal);
    },
    enabled: !!slug,
  });
}

export function useFeaturedPapersQuery() {
  return useQuery({
    queryKey: papersQueryKeys.featured(),
    queryFn: ({ signal }) => fetchFeaturedPapers(signal),
    staleTime: 1000 * 60 * 10,
  });
}

export function useLatestPapersQuery(limit = 6) {
  return useQuery({
    queryKey: [...papersQueryKeys.latest(), limit],
    queryFn: ({ signal }) => fetchLatestPapers(limit, signal),
  });
}

export function useRelatedPapersQuery(paper: Paper | undefined) {
  return useQuery({
    queryKey: paper ? papersQueryKeys.related(paper.slug) : ["papers", "related", "none"],
    queryFn: ({ signal }) => {
      if (!paper) throw new Error("Paper is required");
      return fetchRelatedPapers(paper, signal);
    },
    enabled: !!paper,
  });
}

export function usePapersByCategoryQuery(categorySlug: string | undefined) {
  return useQuery({
    queryKey: categorySlug
      ? papersQueryKeys.byCategory(categorySlug)
      : ["papers", "by-category", "none"],
    queryFn: ({ signal }) => {
      if (!categorySlug) throw new Error("Category slug is required");
      return fetchPapersByCategory(categorySlug, signal);
    },
    enabled: !!categorySlug,
  });
}

export function useFilterMetadataQuery() {
  return useQuery({
    queryKey: papersQueryKeys.filterMetadata(),
    queryFn: ({ signal }) => fetchFilterMetadata(signal),
    staleTime: 1000 * 60 * 30,
  });
}
