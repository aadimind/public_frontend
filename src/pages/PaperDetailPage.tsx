import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { usePaperQuery } from "@/api/papers";
import { useRelatedPapersQuery } from "@/api/papers";
import { PaperReader } from "@/components/reader/PaperReader";
import { RelatedPapers } from "@/components/papers/RelatedPapers";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { NotFoundPage } from "./NotFoundPage";
import { getCanonicalUrl } from "@/lib/url";
import { publicErrorMessage } from "@/api/client";

export function PaperDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: paper, isLoading, isError, error, refetch } = usePaperQuery(slug);
  const { data: related, isLoading: relatedLoading, isError: relatedError } = useRelatedPapersQuery(paper);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <div className="container max-w-3xl py-20">
        <ErrorState
          title="Could not load this paper"
          message={publicErrorMessage(error)}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!paper) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Helmet>
        <title>{paper.title} — Micromath</title>
        <meta
          name="description"
          content={paper.description}
        />
        <meta property="og:title" content={paper.title} />
        <meta property="og:description" content={paper.description} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={paper.publishedAt} />
        {paper.authors.map((a) => (
          <meta key={a.id} property="article:author" content={a.name} />
        ))}
        <link
          rel="canonical"
          href={getCanonicalUrl(`/papers/${encodeURIComponent(paper.slug)}`)}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ScholarlyArticle",
            headline: paper.title,
            description: paper.description,
            datePublished: paper.publishedAt,
            author: paper.authors.map((a) => ({
              "@type": "Person",
              name: a.name,
              affiliation: a.affiliation,
            })),
            keywords: paper.tags.map((t) => t.name).join(", "),
          })}
        </script>
      </Helmet>

      <PaperReader paper={paper} />

      <RelatedPapers
        papers={related}
        isLoading={relatedLoading}
        isError={relatedError}
        title="Continue exploring"
        description="More research explanations on related topics."
      />
    </>
  );
}
