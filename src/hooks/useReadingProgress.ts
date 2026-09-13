import { useEffect, useState } from "react";

export function useReadingProgress(targetSelector: string = "article") {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = document.querySelector(targetSelector);
    if (!target) {
      setProgress(0);
      return;
    }

    let rafId: number | null = null;

    const update = () => {
      const rect = target.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const start = elementTop - viewportHeight * 0.1;
      const end = elementTop + elementHeight - viewportHeight;
      const total = end - start;

      if (total <= 0) {
        setProgress(0);
        return;
      }

      const ratio = Math.min(Math.max((scrollY - start) / total, 0), 1);
      setProgress(ratio * 100);
    };

    const scheduleUpdate = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        update();
        rafId = null;
      });
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(scheduleUpdate)
        : null;
    resizeObserver?.observe(target);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      resizeObserver?.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [targetSelector]);

  return progress;
}
