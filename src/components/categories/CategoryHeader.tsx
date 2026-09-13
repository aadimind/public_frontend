import type { Category } from "@/types";

interface CategoryHeaderProps {
  category: Category;
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <header className="border-b border-border bg-bg">
      <div className="container max-w-5xl py-12 md:py-16">
        <div          className="mb-6 inline-block h-2 w-12 rounded-full"
          style={{ backgroundColor: category.color ?? "rgb(var(--fg))" }}
          aria-hidden
        />
        <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-fg md:text-5xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted">
            {category.description}
          </p>
        )}
        {typeof category.paperCount === "number" && (
          <div className="mt-6 text-sm text-fg-subtle">
            {category.paperCount} paper{category.paperCount === 1 ? "" : "s"} in this collection </div>
        )}
      </div>
    </header>
  );
}
