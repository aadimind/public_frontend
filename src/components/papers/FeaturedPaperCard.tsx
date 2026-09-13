import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Paper } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { PaperMeta } from "./PaperMeta";
import { cn } from "@/lib/utils";

interface FeaturedPaperCardProps { paper: Paper; className?: string }
export function FeaturedPaperCard({ paper, className }: FeaturedPaperCardProps) {
  return <Link to={`/papers/${paper.slug}`} className={cn("group relative flex flex-col gap-6 overflow-hidden rounded-lg border border-border bg-bg transition-all duration-300 hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-bg", className)}>
    {paper.featuredImage && <div className="aspect-[16/7] w-full overflow-hidden border-b border-border bg-bg-subtle"><img src={paper.featuredImage} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]" /></div>}
    <div className="flex flex-col gap-6 p-8 md:p-10">
      <div className="flex min-w-0 flex-wrap items-center gap-2"><Badge variant="accent" size="sm">Featured</Badge><Badge variant="subtle" size="sm">{paper.category.name}</Badge></div>
      <div className="space-y-3"><h3 className="break-words font-display text-2xl font-semibold leading-tight tracking-tight text-fg md:text-3xl">{paper.title}</h3>{paper.subtitle && <p className="break-words text-base leading-relaxed text-fg-muted md:text-lg">{paper.subtitle}</p>}</div>
      <p className="max-w-2xl break-words text-sm leading-relaxed text-fg-muted md:text-base">{paper.description}</p>
      <PaperMeta paper={paper} showAuthors showDate showReadingTime showDifficulty={false} />
      <div className="flex items-center gap-2 pt-2 text-sm font-medium text-fg"><span>Read the explanation</span><ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden /></div>
    </div>
  </Link>;
}
