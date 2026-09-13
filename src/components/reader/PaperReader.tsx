import type { Paper } from "@/types";
import { ContentRenderer } from "@/components/content/ContentRenderer";
import { TableOfContents } from "./TableOfContents";
import { ReadingProgress } from "./ReadingProgress";
import { BackToTop } from "./BackToTop";
import { ShareMenu } from "./ShareMenu";
import { PaperHeader } from "./PaperHeader";
import { AuthorList } from "./AuthorList";

interface PaperReaderProps {
  paper: Paper;
}

function getCanonicalShareUrl(slug: string): string {
  if (typeof window === "undefined") return `/papers/${slug}`;
  return new URL(`/papers/${slug}`, window.location.origin).toString();
}

export function PaperReader({ paper }: PaperReaderProps) {
  const url = getCanonicalShareUrl(paper.slug);

  return (
    <>
      <ReadingProgress />
      <PaperHeader paper={paper} />

      <article className="container max-w-5xl pb-20 pt-10 md:pt-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0 max-w-[72ch]">
            {paper.summary && (
              <div className="mb-12 rounded-lg border border-border bg-bg-subtle p-6">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                  At a glance
                </div>
                <p className="font-display text-lg leading-relaxed text-fg">
                  {paper.summary}
                </p>
              </div>
            )}

            <div className="lg:hidden">
              <TableOfContents sections={paper.sections} />
            </div>

            <div className="mt-8">
              {paper.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-fg md:text-3xl">
                    {section.title}
                  </h2>
                  <div className="mt-6">
                    <ContentRenderer blocks={section.blocks} />
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-16 border-t border-border pt-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-base font-semibold text-fg">
                    Found this useful?
                  </h3>
                  <p className="mt-1 text-sm text-fg-muted">
                    Share it with someone who'd enjoy it.
                  </p>
                </div>
                <ShareMenu title={paper.title} url={url} />
              </div>
            </div>
          </div>

          <aside className="hidden lg:block" aria-label="Paper navigation">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] space-y-6 overflow-y-auto pr-1 scrollbar-thin">
              <TableOfContents sections={paper.sections} />
              <div className="rounded-lg border border-border bg-bg-subtle p-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                  Authors
                </h3>
                <AuthorList authors={paper.authors} />
              </div>
            </div>
          </aside>
        </div>
      </article>

      <BackToTop />
    </>
  );
}
