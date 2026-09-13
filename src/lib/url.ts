export function getCanonicalUrl(pathname?: string): string {
  if (typeof window === "undefined") {
    return pathname ?? "/";
  }

  const cleanPath = pathname ?? window.location.pathname;
  const normalizedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  return new URL(normalizedPath, window.location.origin).toString();
}

const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

export function isSafeUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/") || trimmed.startsWith("#") || trimmed.startsWith("?")) {
    return true;
  }
  // Absolute URLs must include an explicit scheme.
  if (!/^[a-zA-Z][a-zA-Z0-9+.\-]*:/.test(trimmed)) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return ALLOWED_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
}

export function safeHref(url: string | undefined, fallback = "#"): string {
  if (!url) return fallback;
  return isSafeUrl(url) ? url : fallback;
}

export function isExternalUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith("/") || url.startsWith("#") || url.startsWith("?")) return false;
  try {
    const parsed = new URL(url, window.location?.origin ?? "http://localhost");
    return parsed.host !== (window.location?.host ?? parsed.host) && parsed.protocol !== "mailto:";
  } catch {
    return false;
  }
}
