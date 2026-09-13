import { Link } from "react-router-dom";
import type { Category } from "@/types";
import { ArrowUpRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const accent = category.color ?? "#737373";

  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group flex flex-col gap-3 rounded-lg border border-border bg-bg p-6 transition-all duration-200 hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <div className="flex items-start justify-between">
        <div
          className="h-10 w-10 rounded-md border border-border"
          style={{
            background: `linear-gradient(135deg, ${accent}22, ${accent}08)`,
          }}
          aria-hidden
        />
        <ArrowUpRight
          className="h-4 w-4 text-fg-subtle transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
          aria-hidden
        />
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold tracking-tight text-fg">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-1.5 text-sm text-fg-muted line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
      {typeof category.paperCount === "number" && (
        <div className="mt-auto text-xs text-fg-subtle">
          {category.paperCount} papers
        </div>
      )}
    </Link>
  );
}
