import { cloneElement, isValidElement, useId, useState, type ReactElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: "top" | "bottom";
  className?: string;
}

export function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId().replace(/:/g, "");

  const trigger = isValidElement(children)
    ? (() => {
        const element = children as ReactElement<React.HTMLAttributes<HTMLElement>>;
        return cloneElement(element, {
          "aria-describedby": open ? `tooltip-${tooltipId}` : undefined,
          onFocus: (e: React.FocusEvent<HTMLElement>) => {
            element.props.onFocus?.(e);
            if (!e.defaultPrevented) setOpen(true);
          },
          onBlur: (e: React.FocusEvent<HTMLElement>) => {
            element.props.onBlur?.(e);
            if (!e.defaultPrevented) setOpen(false);
          },
        });
      })()
    : (
      <span
        tabIndex={0}
        aria-describedby={open ? `tooltip-${tooltipId}` : undefined}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </span>
    );

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {trigger}
      {open && (
        <span
          id={`tooltip-${tooltipId}`}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-md bg-fg px-2 py-1 text-xs font-medium text-fg-inverse",
            "animate-fade-in-fast",
            side === "top" ? "-top-9" : "top-full mt-2",
            className
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
