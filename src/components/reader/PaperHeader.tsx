import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import type { Paper } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { formatDate, formatReadingTime, formatDifficulty } from "@/lib/format";
import { safeHref } from "@/lib/url";

interface PaperHeaderProps {
  paper: Paper;
}

export function PaperHeader({ paper }: PaperHeaderProps) {
  return (
    <header className="border-b border-border bg-bg">
      <div className="container max-w-5xl py-10 md:py-14">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Papers", to: "/papers" },
              { label: paper.category.name, to: `/categories/${paper.category.slug}` },
              { label: paper.title },
            ]}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="subtle" size="md">
            {paper.category.name}
          </Badge>
          {paper.difficulty !== undefined && (
            <Badge variant="outline" size="md">
              {formatDifficulty(paper.difficulty)}
            </Badge>
          )}
          <span className="text-sm text-fg-muted">
            {formatReadingTime(paper.readingTime)}
          </span>
        </div>

        <h1 className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-fg md:text-5xl">
          {paper.title}
        </h1>

        {paper.subtitle && (
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-fg-muted md:text-xl">
            {paper.subtitle}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {paper.authors.slice(0, 4).map((author) => (
                <Avatar
                  key={author.id}
                  name={author.name}
                  src={author.avatarUrl}
                  size="sm"
                  className="border-2 border-bg"
                />
              ))}
            </div>
            <div className="text-sm">
              <div className="font-medium text-fg">
                {paper.authors.length > 4
                  ? `${paper.authors.slice(0, 3).map((a) => a.name).join(", ")} +${paper.authors.length - 3} more`
                  : paper.authors.map((a) => a.name).join(", ")}
              </div>
              <div className="text-xs text-fg-muted">
                Published {formatDate(paper.publishedAt)}
              </div>
            </div>
          </div>
        </div>

{paper.originalPaperUrl && (
          <a
            href={safeHref(paper.originalPaperUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            <span>{paper.originalPaperTitle ?? "View original paper"}</span>
          </a>
        )}

        {paper.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {paper.tags.map((tag) => (
              <Link
                key={tag.id}
                to={`/papers?tag=${tag.slug}`}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <Badge variant="outline" size="sm" className="cursor-pointer hover:bg-bg-muted">
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
