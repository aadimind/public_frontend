import { Helmet } from "react-helmet-async";

import { useCategoriesQuery } from "@/api/categories";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { publicErrorMessage } from "@/api/client";

export function CategoriesPage() {
  const { data: categories, isLoading, isError, error, refetch } = useCategoriesQuery();
  return (
    <>
      <Helmet><title>Categories — Micromath</title><meta name="description" content="Browse research papers by category." /></Helmet>
      <div className="container max-w-6xl py-12 md:py-16">
        <header className="mb-10 md:mb-12">
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Browse by category</h1>
          <p className="mt-2 max-w-2xl text-base text-fg-muted">Curated collections of research explanations, organized by topic.</p>
        </header>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 rounded-lg border border-border bg-bg p-6"><Skeleton className="h-10 w-10 rounded-md" /><Skeleton className="mt-5 h-5 w-2/3" /><Skeleton className="mt-2 h-3 w-full" /></div>)}</div>
        ) : isError ? (
          <ErrorState title="Could not load categories" message={publicErrorMessage(error)} onRetry={() => void refetch()} />
        ) : categories && categories.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map((cat) => <CategoryCard key={cat.id} category={cat} />)}</div>
        ) : (
          <div className="rounded-lg border border-border bg-bg-subtle p-12 text-center text-fg-muted">No categories available yet.</div>
        )}
      </div>
    </>
  );
}
