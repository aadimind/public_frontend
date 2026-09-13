interface HighlightedTextProps {
  text: string;
  query: string;
  className?: string;
}

export function HighlightedText({ text, query, className }: HighlightedTextProps) {
  if (!query.trim()) {
    return <span className={className}>{text}</span>;
  }

  const q = query.trim();
  const regex = new RegExp(`(${escapeRegex(q)})`, "gi");
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.toLowerCase() === q.toLowerCase()) {
          return (
            <mark
              key={i}
              className="rounded-sm bg-accent-subtle px-0.5 font-medium text-fg"
            >
              {part}
            </mark>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
