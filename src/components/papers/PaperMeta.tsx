import { Calendar, Clock, BookOpen, Users } from "lucide-react";
import type { Paper } from "@/types";
import { formatAuthors, formatDate, formatReadingTime } from "@/lib/format";
import { Avatar } from "@/components/ui/Avatar";

interface PaperMetaProps { paper: Paper; showAuthors?: boolean; showDate?: boolean; showReadingTime?: boolean; showDifficulty?: boolean }

export function PaperMeta({ paper, showAuthors = true, showDate = true, showReadingTime = true, showDifficulty = false }: PaperMetaProps) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-muted">
      {showAuthors && paper.authors.length > 0 && <div className="flex min-w-0 max-w-full items-center gap-2"><div className="flex shrink-0 -space-x-2">{paper.authors.slice(0, 3).map((author) => <Avatar key={author.id} name={author.name} src={author.avatarUrl} size="xs" className="border-2 border-bg" />)}</div><span className="min-w-0 max-w-[min(100%,260px)] break-words sm:truncate sm:max-w-[260px]">{formatAuthors(paper.authors)}</span></div>}
      {showDate && <div className="flex shrink-0 items-center gap-1.5"><Calendar className="h-3.5 w-3.5" aria-hidden /><time dateTime={paper.publishedAt}>{formatDate(paper.publishedAt, { year: "numeric", month: "short", day: "numeric" })}</time></div>}
      {showReadingTime && <div className="flex shrink-0 items-center gap-1.5"><Clock className="h-3.5 w-3.5" aria-hidden /><span>{formatReadingTime(paper.readingTime)}</span></div>}
      {showDifficulty && paper.difficulty !== undefined && <div className="flex shrink-0 items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" aria-hidden /><span className="capitalize">{paper.difficulty}</span></div>}
      {!showAuthors && paper.authors.length > 0 && <div className="flex shrink-0 items-center gap-1.5"><Users className="h-3.5 w-3.5" aria-hidden /><span>{paper.authors.length} {paper.authors.length === 1 ? "author" : "authors"}</span></div>}
    </div>
  );
}
