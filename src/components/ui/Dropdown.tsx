import { cloneElement, useEffect, useId, useRef, useState, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type TriggerProps = HTMLAttributes<HTMLElement> & {
  onKeyDown?: HTMLAttributes<HTMLElement>["onKeyDown"];
  onClick?: HTMLAttributes<HTMLElement>["onClick"];
  "aria-expanded"?: boolean;
  "aria-haspopup"?: "menu" | "dialog" | "listbox" | "true" | "false";
  "aria-controls"?: string;
};

interface DropdownProps {
  trigger: ReactElement<TriggerProps>;
  children: (close: () => void) => ReactNode;
  align?: "start" | "end";
  side?: "bottom" | "top";
  className?: string;
}

const MENUITEM_SELECTOR = '[role="menuitem"]:not([disabled])';

function getMenuItems(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(MENUITEM_SELECTOR));
}

function activeItemIndex(items: HTMLElement[]): number {
  if (items.length === 0) return -1;
  const active = document.activeElement;
  if (!(active instanceof HTMLElement)) return -1;
  return items.indexOf(active);
}

export function Dropdown({
  trigger,
  children,
  align = "start",
  side = "bottom",
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        close();
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      // Allow Tab to operate the roving tabindex by closing only when focus
      // is about to leave the menu container. This keeps arrow/Home/End usable.
      if (event.key === "Tab") {
        const next = event.composedPath().slice(0, 1)[0];
        if (next instanceof Node && ref.current && !ref.current.contains(next)) {
          close();
        }
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
      const restore = restoreFocusRef.current;
      if (restore && document.contains(restore)) {
        requestAnimationFrame(() => restore.focus({ preventScroll: true }));
      }
    };
  }, [open]);

  const focusFirstItem = () => {
    requestAnimationFrame(() => {
      const items = getMenuItems(menuRef.current);
      (items[0] ?? ref.current)?.focus();
    });
  };

  return (
    <div ref={ref} className="relative inline-block">
      {cloneElement(trigger, {
        "aria-expanded": open,
        "aria-haspopup": "menu",
        "aria-controls": menuId,
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
          trigger.props.onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
            focusFirstItem();
          }
        },
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          trigger.props.onClick?.(event);
          if (!event.defaultPrevented) setOpen((current) => !current);
        },
      })}
      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-orientation="vertical"
          onKeyDown={(event) => {
            const items = getMenuItems(menuRef.current);
            if (items.length === 0) return;
            const index = activeItemIndex(items);
            if (event.key === "ArrowDown") {
              event.preventDefault();
              items[(index + 1 + items.length) % items.length].focus();
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              items[(index - 1 + items.length) % items.length].focus();
            } else if (event.key === "Home") {
              event.preventDefault();
              items[0].focus();
            } else if (event.key === "End") {
              event.preventDefault();
              items[items.length - 1].focus();
            }
          }}
          className={cn(
            "absolute z-40 min-w-[12rem] overflow-hidden rounded-md border border-border bg-bg shadow-soft-md",
            "animate-scale-in origin-top",
            side === "bottom" ? "top-full mt-1" : "bottom-full mb-1",
            align === "start" ? "left-0" : "right-0",
            className
          )}
        >
          {children(close)}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  onSelect?: () => void;
  children: ReactNode;
  active?: boolean;
}

export function DropdownItem({ onSelect, children, active }: DropdownItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={0}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-sm",
        "transition-colors hover:bg-bg-muted",
        active && "bg-bg-muted font-medium text-fg",
        "text-fg-muted hover:text-fg"
      )}
    >
      {children}
    </button>
  );
}

interface DropdownSeparatorProps {
  className?: string;
}

export function DropdownSeparator({ className }: DropdownSeparatorProps) {
  return <div className={cn("my-1 h-px bg-border", className)} />;
}