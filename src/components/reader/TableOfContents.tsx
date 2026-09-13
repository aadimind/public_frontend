import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { PaperSection } from "@/types";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  sections: PaperSection[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const sectionIds = sections.map((s) => s.id);
  const selector = sectionIds.map((id) => `#${id}`).join(", ");
  const activeId = useActiveSection(selector);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${encodeURIComponent(id)}`);
    }
  };

  const list = (
    <nav aria-label="Table of contents" className="space-y-0.5">
      <ol className="space-y-0.5">
        {sections.map((section) => {
          const isActive = activeId === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(e) => handleClick(e, section.id)}
                className={cn(
                  "block rounded-md px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-bg-muted font-medium text-fg"
                    : "text-fg-muted hover:bg-bg-muted hover:text-fg"
                )}
                aria-current={isActive ? "location" : undefined}
              >
                {section.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );

  if (isDesktop) {
    return (
      <aside
        className="hidden self-start lg:block"
        aria-label="On this page"
      >
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          On this page
        </h2>
        {list}
      </aside>
    );
  }

  return <MobileTOC sections={sections} activeId={activeId} onNavigate={handleClick} />;
}

function MobileTOC({
  sections,
  activeId,
  onNavigate,
}: {
  sections: PaperSection[];
  activeId: string | null;
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <details      className="rounded-lg border border-border bg-bg-subtle lg:hidden"
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
        <span>Sections in this paper</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </summary>
      <div className="border-t border-border p-2">
        <nav aria-label="Table of contents">
          <ol className="space-y-0.5">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => onNavigate(e, section.id)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors",
                    activeId === section.id
                      ? "bg-bg-muted font-medium text-fg"
                      : "text-fg-muted hover:bg-bg-muted hover:text-fg"
                  )}
                  aria-current={activeId === section.id ? "location" : undefined}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </details>
  );
}
