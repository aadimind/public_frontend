import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import type { PaperFilters } from "@/types";
import { isDifficulty, isPaperSort } from "@/api/validators";
import { usePapersQuery, useFilterMetadataQuery } from "@/api/papers";
import { PaperGrid } from "@/components/papers/PaperGrid";
import { PaperFilters as PaperFiltersPanel } from "@/components/papers/PaperFilters";
import { PaperSort } from "@/components/papers/PaperSort";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { publicErrorMessage } from "@/api/client";

function readParam(params: URLSearchParams, key: string): string | undefined {
  const v = params.get(key);
  return v && v.length > 0 ? v : undefined;
}

export function PapersPage() {
  const [params, setParams] = useSearchParams();

  const filters = useMemo<PaperFilters>(() => {
    const difficultyParam = readParam(params, "difficulty");
    const sortParam = readParam(params, "sort");
    return {
      q: readParam(params, "q"),
      category: readParam(params, "category"),
      tag: readParam(params, "tag"),
      difficulty: difficultyParam && isDifficulty(difficultyParam) ? difficultyParam : undefined,
      author: readParam(params, "author"),
      from: readParam(params, "from"),
      to: readParam(params, "to"),
      sort: sortParam && isPaperSort(sortParam) ? sortParam : "newest",
    };
  }, [params]);

  const setFilters = (next: PaperFilters) => {
    const p = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      // Omit default sort to keep canonical URLs clean.
      if (k === "sort" && v === "newest") return;
      p.set(k, String(v));
    });
    setParams(p, { replace: true });
  };

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    usePapersQuery(filters);

  const { data: filterMetadata } = useFilterMetadataQuery();

  const papers = data?.pages.flatMap((p) => p.items) ?? [];
  const categories = filterMetadata?.categories ?? [];
  const tags = filterMetadata?.tags ?? [];
  const total = data?.pages[0]?.total;

  return (
    <>
      <Helmet>
        <title>Papers — Micromath</title>
        <meta name="description" content="Browse all research paper explanations on Micromath." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="container max-w-7xl py-10 md:py-14">
        <header className="mb-8 md:mb-10">
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Research papers
          </h1>
          <p className="mt-2 max-w-2xl text-base text-fg-muted">
            Structured explanations of important research, organized for clarity and easy discovery.
          </p>
          {typeof total === "number" && (
            <div className="mt-4 text-sm text-fg-subtle">
              {total} paper{total === 1 ? "" : "s"}
              {filters.q && ` matching "${filters.q}"`}
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <PaperFiltersPanel
            filters={filters}
            onChange={setFilters}
            categories={categories}
            tags={tags}
          />

          <div>
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-fg-muted">
                {isLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <span>{papers.length} of {total ?? papers.length} shown</span>
                )}
              </div>
              <PaperSort
                value={filters.sort ?? "newest"}
                onChange={(sort) => setFilters({ ...filters, sort })}
              />
            </div>

            <PaperGrid
              papers={papers}
              isLoading={isLoading}
              isError={isError}
              errorMessage={error ? publicErrorMessage(error) : undefined}
              onRetry={() => refetch()}
              columns={3}
              emptyTitle="No papers match your filters"
              emptyDescription="Try adjusting the filters or clearing them to see more papers."
            />

            {hasNextPage && (
              <div className="mt-10 flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fetchNextPage()}
                  isLoading={isFetchingNextPage}
                >
                  Load more papers
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
