import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search as SearchIcon } from "lucide-react";
import { useSearchQuery } from "@/api/search";
import { SearchInput } from "@/components/search/SearchInput";
import { SearchResultCard } from "@/components/papers/SearchResultCard";
import { SearchSuggestions } from "@/components/search/SearchSuggestions";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { publicErrorMessage } from "@/api/client";

export function SearchPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initialQ = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [submittedQ, setSubmittedQ] = useState(initialQ);

  useEffect(() => {
    setQuery(initialQ);
    setSubmittedQ(initialQ);
  }, [initialQ]);

  const { data: results, isLoading, isError, error, refetch } = useSearchQuery(submittedQ);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setSubmittedQ(q);
    const next = new URLSearchParams(params);
    if (q) next.set("q", q);
    else next.delete("q");
    navigate(`/search${next.toString() ? `?${next.toString()}` : ""}`, { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>
          {submittedQ ? `Search "${submittedQ}" — Micromath` : "Search — Micromath"}
        </title>
        <meta name="description" content="Search research paper explanations on Micromath." />
      </Helmet>

      <div className="container max-w-4xl py-12 md:py-16">
        <Breadcrumbs items={[{ label: "Search" }]} />

        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Search
        </h1>
        <p className="mt-2 text-base text-fg-muted">
          Find papers by title, topic, author, or tag.
        </p>

        <form onSubmit={onSubmit} role="search" className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <SearchInput
                size="lg"
                type="search"
                placeholder="Search papers…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClear={() => setQuery("")}
                aria-label="Search papers"
              />
            </div>
            <Button type="submit" size="lg" leftIcon={<SearchIcon className="h-4 w-4" />}>
              Search
            </Button>
          </div>
        </form>

        <div className="mt-12">
          {!submittedQ ? (
            <div className="space-y-8">
              <SearchSuggestions onSelect={(s) => { setQuery(s); setSubmittedQ(s); navigate(`/search?q=${encodeURIComponent(s)}`, { replace: true }); }} />
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-border bg-bg p-5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-3 h-6 w-3/4" />
                  <Skeleton className="mt-3 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-5/6" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <ErrorState
              title="Search failed"
              message={publicErrorMessage(error)}
              onRetry={() => refetch()}
            />
          ) : !results || results.length === 0 ? (
            <EmptyState
              title={`No results for "${submittedQ}"`}
              description="Try a broader query, or browse papers by category."
              action={{
                label: "Browse all papers",
                onClick: () => navigate("/papers"),
              }}
            />
          ) : (
            <>
              <div className="mb-6 text-sm text-fg-muted">
                {results.length} result{results.length === 1 ? "" : "s"} for{" "}
                <span className="font-medium text-fg">"{submittedQ}"</span>
              </div>
              <div className="space-y-4">
                {results.map((result) => (
                  <SearchResultCard
                    key={result.paper.id}
                    result={result}
                    query={submittedQ}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
