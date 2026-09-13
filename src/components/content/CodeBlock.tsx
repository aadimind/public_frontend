import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const onCopy = async () => {
    try {
      setCopyFailed(false);
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setCopied(false);
        timerRef.current = null;
      }, 1500);
    } catch {
      setCopyFailed(true);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setCopyFailed(false);
        timerRef.current = null;
      }, 2500);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-bg-subtle">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs font-medium text-fg-muted">
          {language ?? "code"}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1 text-xs text-fg-muted transition-colors hover:text-fg"
          aria-label={copyFailed ? "Copy failed" : copied ? "Copied" : "Copy code"}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copyFailed ? "Copy failed" : copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm">
        <code className="font-mono leading-relaxed text-fg">{code}</code>
      </pre>
    </div>
  );
}