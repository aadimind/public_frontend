import { useEffect, useState } from "react";

export function useActiveSection(selector: string = "section[id], h2[id], h3[id]", options: { rootMargin?: string; threshold?: number } = {}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    let elements: HTMLElement[];
    try { elements = Array.from(document.querySelectorAll<HTMLElement>(selector)); }
    catch { setActiveId(null); return; }
    if (!elements.length) { setActiveId(null); return; }
    const visible = new Map<Element, IntersectionObserverEntry>();
    const updateActive = () => {
      const candidates = elements.map((element) => visible.get(element)).filter((entry): entry is IntersectionObserverEntry => Boolean(entry?.isIntersecting)).sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top) || b.intersectionRatio - a.intersectionRatio);
      setActiveId(candidates[0]?.target.id ?? null);
    };
    const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => entry.isIntersecting ? visible.set(entry.target, entry) : visible.delete(entry.target)); updateActive(); }, { rootMargin: options.rootMargin ?? "-30% 0px -55% 0px", threshold: options.threshold ?? 0 });
    elements.forEach((element) => observer.observe(element));
    return () => { observer.disconnect(); visible.clear(); };
  }, [selector, options.rootMargin, options.threshold]);
  return activeId;
}
