import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { SearchResult } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { HighlightedText } from "@/components/search/HighlightedText";
import { formatDate, formatReadingTime } from "@/lib/format";
import { cn } from "@/lib/utils";

interface SearchResultCardProps { result: SearchResult; query: string; className?: string }
export function SearchResultCard({ result, query, className }: SearchResultCardProps) {
  const { paper, excerpt } = result;
  return <Link to={`/papers/${paper.slug}`} className={cn("group flex min-w-0 flex-col gap-3 rounded-lg border border-border bg-bg p-5 transition-all duration-200 hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-bg", className)}>
    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fg-muted"><Badge variant="subtle" size="sm">{paper.category.name}</Badge><span className="shrink-0">{formatDate(paper.publishedAt, { year: "numeric", month: "short", day: "numeric" })}</span><span aria-hidden>•</span><span className="shrink-0">{formatReadingTime(paper.readingTime)}</span></div>
    <h3 className="break-words font-display text-lg font-semibold leading-snug tracking-tight text-fg"><HighlightedText text={paper.title} query={query} /></h3>
    <p className="break-words text-sm leading-relaxed text-fg-muted [overflow-wrap:anywhere]"><HighlightedText text={excerpt} query={query} /></p>
    <div className="flex flex-wrap gap-1.5">{paper.tags.slice(0, 4).map((tag) => <Badge key={tag.id} variant="outline" size="sm">{tag.name}</Badge>)}</div>
    <div className="mt-1 flex items-center justify-end text-xs text-fg-muted"><span className="inline-flex items-center gap-1 transition-transform group-hover:translate-x-0.5">Read more <ArrowUpRight className="h-3.5 w-3.5" aria-hidden /></span></div>
  </Link>;
}
