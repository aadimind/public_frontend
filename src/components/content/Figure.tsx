import { useState } from "react";

interface FigureProps { src?: string; alt?: string; caption?: string; height?: number }
export function Figure({ src, alt, caption, height = 280 }: FigureProps) {
  const [failed, setFailed] = useState(false);
  const figureHeight = Math.max(160, Math.min(height, 280));
  if (src && !failed) return <figure className="my-8 overflow-hidden rounded-lg border border-border bg-bg-subtle">
    <div className="flex max-h-[70vh] w-full items-center justify-center sm:min-h-[160px]" style={{ minHeight: `clamp(160px, 35vw, ${figureHeight}px)` }}><img src={src} alt={alt ?? caption ?? ""} loading="lazy" decoding="async" onError={() => setFailed(true)} className="h-auto max-h-[70vh] w-full object-contain" /></div>
    {caption && <figcaption className="break-words border-t border-border bg-bg px-4 py-3 text-center text-sm text-fg-muted">{caption}</figcaption>}
  </figure>;
  return <figure className="my-8 overflow-hidden rounded-lg border border-dashed border-border bg-bg-subtle">
    <div className="flex min-h-[120px] items-center justify-center px-4 text-center text-sm text-fg-subtle sm:min-h-[160px]" role="img" aria-label={alt ?? caption ?? "Figure unavailable"}>{src ? "Figure could not be loaded." : "Figure"}</div>
    {caption && <figcaption className="break-words border-t border-border bg-bg px-4 py-3 text-center text-sm text-fg-muted">{caption}</figcaption>}
  </figure>;
}
