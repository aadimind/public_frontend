import { useEffect, useRef, useState } from "react";
import katex from "katex";

interface MathBlockProps { tex: string; display?: "inline" | "block"; className?: string }
export function MathBlock({ tex, display = "inline", className }: MathBlockProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    try { katex.render(tex, ref.current, { throwOnError: false, displayMode: display === "block", strict: "ignore", trust: false, output: "html" }); setError(null); }
    catch (err) { setError(err instanceof Error ? err.message : "Math rendering error"); }
  }, [tex, display]);
  if (error) return <code className={`break-words rounded bg-bg-muted px-1.5 py-0.5 font-mono text-sm text-danger [overflow-wrap:anywhere] ${className ?? ""}`} title={error}>{tex}</code>;
  if (display === "block") return <span ref={ref} className={`my-6 block overflow-x-auto overflow-y-hidden py-2 text-center ${className ?? ""}`} />;
  return <span ref={ref} className={`inline-block max-w-full align-baseline overflow-x-auto overflow-y-hidden ${className ?? ""}`} />;
}
