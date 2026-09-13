import { Quote } from "lucide-react";
import type { CitationItem } from "@/types";
import { isExternalUrl, safeHref } from "@/lib/url";

interface CitationProps { items: CitationItem[] }
export function Citation({ items }: CitationProps) {
  if (!items.length) return null;
  return <section className="my-8 min-w-0 rounded-lg border border-border bg-bg-subtle p-6" aria-label="References">
    <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold"><Quote className="h-4 w-4 text-fg-muted" aria-hidden />References</h3>
    <ol className="space-y-3 text-sm">
      {items.map((item, i) => {
        const href = item.url ? safeHref(item.url, undefined) : undefined;
        const external = href ? isExternalUrl(href) : false;
        return <li key={item.id} className="flex min-w-0 gap-3"><span className="shrink-0 font-mono text-xs text-fg-subtle">[{i + 1}]</span><span className="min-w-0 break-words [overflow-wrap:anywhere] text-fg-muted">{href ? <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="break-words underline decoration-border-strong underline-offset-4 hover:decoration-fg [overflow-wrap:anywhere]">{item.text}</a> : item.text}</span></li>;
      })}
    </ol>
  </section>;
}
