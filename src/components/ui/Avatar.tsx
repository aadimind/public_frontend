import { useState, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

const sizeClasses = {
  xs: "h-5 w-5 text-[9px]",
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getColorFromName(name: string): string {
  const colors = [
    "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
    "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
    "bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
    "bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
    "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950/40 dark:text-fuchsia-300",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ name, src, size = "md", className, ...rest }: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = getInitials(name);
  const color = getColorFromName(name);
  const showImage = Boolean(src) && !imgFailed;

  if (showImage && src) {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-full",
          sizeClasses[size],
          className
        )}
        aria-label={name}
        {...rest}
      >
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-medium",
        sizeClasses[size],
        color,
        className
      )}
      aria-label={name}
      {...rest}
    >
      {initials || "?"}
    </div>
  );
}