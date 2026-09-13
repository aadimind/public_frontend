interface QuoteProps {
  text: string;
  attribution?: string;
}

export function Quote({ text, attribution }: QuoteProps) {
  return (
    <blockquote className="my-8 border-l-2 border-fg pl-6 italic">
      <p className="text-lg leading-relaxed text-fg">"{text}"</p>
      {attribution && (
        <footer className="mt-2 text-sm not-italic text-fg-muted">
          — {attribution}
        </footer>
      )}
    </blockquote>
  );
}
