const SUGGESTIONS = [
 "transformer",
  "diffusion models",
  "reinforcement learning",
  "graph neural networks",
  "few-shot learning",
  "BERT",
];

interface SearchSuggestionsProps {
  onSelect: (suggestion: string) => void;
}

export function SearchSuggestions({ onSelect }: SearchSuggestionsProps) {
  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
        Try searching for
      </div>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSelect(s)}
            className="rounded-full border border-border bg-bg px-3 py-1 text-sm text-fg-muted transition-colors hover:border-fg hover:text-fg"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
