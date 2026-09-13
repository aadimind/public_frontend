import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  labelledBy?: string;
  children: ReactNode;
  side?: "left" | "right" | "bottom";
  className?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute("aria-hidden")
  );
}

export function Drawer({
  open,
  onClose,
  title,
  labelledBy,
  children,
  side = "right",
  className,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const items = getFocusable(panelRef.current);
      if (items.length === 0) {
        event.preventDefault();
        closeRef.current?.focus();
        return;
      }

      const active = document.activeElement;
      const first = items[0];
      const last = items[items.length - 1];

      if (!(active instanceof HTMLElement) || !panelRef.current?.contains(active)) {
        // Focus is outside the drawer; pull it back in.
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const raf = requestAnimationFrame(() => {
      const items = getFocusable(panelRef.current);
      (items[0] ?? closeRef.current)?.focus();
    });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
      const restore = restoreFocusRef.current;
      if (restore && document.contains(restore)) {
        requestAnimationFrame(() => restore.focus({ preventScroll: true }));
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  const sideClasses = {
    left: "left-0 top-0 h-full w-full max-w-sm",
    right: "right-0 top-0 h-full w-full max-w-sm",
    bottom: "bottom-0 left-0 right-0 max-h-[85vh]",
  }[side];

  const computedTitleId = labelledBy ?? (title ? `drawer-title-${side}` : undefined);

  return (
    <div className="fixed inset-0 z-50 animate-fade-in-fast">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={cn(
          "absolute z-10 flex flex-col border border-border bg-bg shadow-soft-lg",
          "animate-slide-in-right",
          sideClasses,
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={computedTitleId}
        aria-label={title || labelledBy ? undefined : "Dialog"}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          {title ? (
            <h2 id={computedTitleId} className="font-display text-lg font-semibold tracking-tight">{title}</h2>
          ) : (
            <span />
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-fg-muted hover:bg-bg-muted hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg"
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">{children}</div>
      </div>
    </div>
  );
}