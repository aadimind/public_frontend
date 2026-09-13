import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useCategoryQuery } from "@/api/categories";
import { usePapersByCategoryQuery } from "@/api/papers";
import { CategoryHeader } from "@/components/categories/CategoryHeader";
import { PaperCard } from "@/components/papers/PaperCard";
import { FeaturedPaperCard } from "@/components/papers/FeaturedPaperCard";
import { LoadingState } from "@/components/feedback/LoadingState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { NotFoundPage } from "./NotFoundPage";
import { getCanonicalUrl } from "@/lib/url";
import { publicErrorMessage } from "@/api/client";

export function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: category, isLoading, isError, error, refetch } = useCategoryQuery(slug);
  const { data: papers, isLoading: papersLoading, isError: papersError, error: papersErrorValue, refetch: refetchPapers } = usePapersByCategoryQuery(slug);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <div className="container max-w-3xl py-20">
        <ErrorState
          title="Could not load this category"
          message={publicErrorMessage(error)}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!category) {
    return <NotFoundPage />;
  }

  const sortedPapers = papers
    ? [...papers].sort(
 (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    : [];

  const featured = sortedPapers.find((p) => p.isFeatured) ?? sortedPapers[0];
  const rest = sortedPapers.filter((p) => p.id !== featured?.id);

  return (
    <>
      <Helmet>
        <title>{category.name} — Micromath</title>
        <meta
          name="description"
          content={
            category.description ??
            `Browse research paper explanations in ${category.name}.`
          }
        />
        <link rel="canonical" href={getCanonicalUrl(`/categories/${encodeURIComponent(category.slug)}`)} />
      </Helmet>

      <CategoryHeader category={category} />

      <div className="container max-w-6xl py-12">
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Categories", to: "/categories" },
              { label: category.name },
            ]}
          />
        </div>

        {papersLoading ? (
          <LoadingState />
        ) : papersError ? (
          <ErrorState
            title="Could not load papers"
            message={publicErrorMessage(papersErrorValue)}
            onRetry={() => refetchPapers()}
          />
        ) : !sortedPapers || sortedPapers.length === 0 ? (
          <EmptyState
            title="No papers in this category yet"
            description="Check back soon for new explanations."
 />
        ) : (
          <>
            {featured && (
              <section className="mb-12">
                <h2 className="mb-6 font-display text-xl font-semibold tracking-tight">
                  Featured in {category.name}
                </h2>
                <FeaturedPaperCard paper={featured} />
              </section>
            )}

            <section>
              <h2 className="mb-6 font-display text-xl font-semibold tracking-tight">
                Latest papers
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((paper) => (
                  <PaperCard key={paper.id} paper={paper} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
