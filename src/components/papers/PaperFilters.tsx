import { useEffect, useId, useState } from "react";
import { Filter, X } from "lucide-react";
import type { Category, Difficulty, PaperFilters as Filters, Tag } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Drawer } from "@/components/ui/Drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatDifficulty } from "@/lib/format";
import { API_CONFIG } from "@/api/client";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";

interface PaperFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  categories: Category[];
  tags: Tag[];
  className?: string;
}

const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced"];
const sortOptions: { value: NonNullable<Filters["sort"]>; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "popular", label: "Most popular" },
  { value: "relevance", label: "Most relevant" },
];

export function PaperFilters({
  filters,
  onChange,
  categories,
  tags,
  className,
}: PaperFiltersProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [open, setOpen] = useState(false);
  const drawerTitleId = useId();

  useEffect(() => {
    if (isDesktop) setOpen(false);
  }, [isDesktop]);

  const activeCount = [
    filters.category,
    filters.tag,
    filters.difficulty,
    filters.author,
    filters.from,
    filters.to,
  ].filter(Boolean).length;

  const filtersContent = (
    <FilterBody
      filters={filters}
      onChange={onChange}
      categories={categories}
      tags={tags}
      activeCount={activeCount}
    />
  );

  if (isDesktop) {
    return (
      <aside className={cn("w-full", className)} aria-label="Filters">
        <div className="space-y-6 rounded-lg border border-border bg-bg p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold">Filters</h3>
            {activeCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange({ ...filters, category: undefined, tag: undefined, difficulty: undefined, author: undefined, from: undefined, to: undefined })}
              >
                Clear all
              </Button>
            )}
          </div>
          {filtersContent}
        </div>
      </aside>
    );
  }

  return (
    <>
      <div className={className}>
        <Button
          variant="outline"
          size="md"
          onClick={() => setOpen(true)}
          leftIcon={<Filter className="h-4 w-4" />}
          aria-expanded={open}
          aria-controls={drawerTitleId}
        >
          Filters
          {activeCount > 0 && (
            <Badge variant="default" size="sm" className="ml-1">
              {activeCount}
            </Badge>
          )}
        </Button>
      </div>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Filters"
        side="right"
        labelledBy={drawerTitleId}
      >
        <div className="space-y-6 p-5">{filtersContent}</div>
      </Drawer>
    </>
  );
}

function FilterBody({
  filters,
  onChange,
  categories,
  tags,
  activeCount,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
  categories: Category[];
  tags: Tag[];
  activeCount: number;
}) {
  const invalidDateRange =
    Boolean(filters.from && filters.to) && filters.from! > filters.to!;

  return (
    <>
      <FilterSection title="Sort by">
        <div className="space-y-2">
          {sortOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={filters.sort === opt.value || (!filters.sort && opt.value === "newest")}
                onChange={() => onChange({ ...filters, sort: opt.value })}
                className="h-3.5 w-3.5 accent-fg"
              />
              <span className="text-fg-muted">{opt.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Category">
        <div className="space-y-1">
<FilterOption
            label="All categories"
            active={!filters.category}
            onClick={() => onChange({ ...filters, category: undefined })}
          />
          {categories.map((cat) => (
            <FilterOption
              key={cat.id}
              label={cat.name}
              count={cat.paperCount}
              active={filters.category === cat.slug}
              onClick={() =>
 onChange({
                  ...filters,
                  category: filters.category === cat.slug ? undefined : cat.slug,
                })
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Tag">
        <div className="space-y-1">
          <FilterOption
            label="All tags"
            active={!filters.tag}
            onClick={() => onChange({ ...filters, tag: undefined })}
          />
          {tags.map((tag) => (
            <FilterOption
              key={tag.id}
              label={tag.name}
              active={filters.tag === tag.slug || filters.tag === tag.id}
              onClick={() =>
                onChange({
                  ...filters,
                  tag: filters.tag === tag.slug || filters.tag === tag.id ? undefined : tag.slug,
                })
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Author">
        <Input
          type="search"
          value={filters.author ?? ""}
          onChange={(e) => onChange({ ...filters, author: e.target.value || undefined })}
          placeholder="Filter by author"
          aria-label="Filter papers by author"
          size="sm"
        />
      </FilterSection>

      {/* V1 honesty: the live API has no canonical difficulty source
          (docs/public-contract.md §4), so the control only exists where it
          can actually filter (mock/dev data). Rendering it in production
          would be a dead control implying unsupported behavior. */}
      {API_CONFIG.useMock && (
        <FilterSection title="Difficulty">
        <div className="space-y-1">
          <FilterOption
            label="Any"
            active={!filters.difficulty}
            onClick={() => onChange({ ...filters, difficulty: undefined })}
          />
          {difficulties.map((d) => (
            <FilterOption
              key={d}
              label={formatDifficulty(d)}
              active={filters.difficulty === d}
              onClick={() =>
                onChange({
                  ...filters,
                  difficulty: filters.difficulty === d ? undefined : d,
                })
              }
            />
          ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Date range">
        <div className="space-y-2">
          <label className="block text-xs text-fg-muted">
            From
            <input
              id="papers-filter-from"
              type="date"
              max={filters.to}
              value={filters.from ?? ""}
              onChange={(e) => onChange({ ...filters, from: e.target.value || undefined })}
              className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-1.5 text-sm text-fg focus:border-fg focus:outline-none"
            />
          </label>
          <label className="block text-xs text-fg-muted">
            To
            <input
              id="papers-filter-to"
              type="date"
              min={filters.from}
              value={filters.to ?? ""}
              onChange={(e) => onChange({ ...filters, to: e.target.value || undefined })}
              className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-1.5 text-sm text-fg focus:border-fg focus:outline-none"
            />
          </label>
          {invalidDateRange && (
            <p className="text-xs text-red-700 dark:text-red-300" role="alert">
              The start date must be on or before the end date.
            </p>
          )}
        </div>
      </FilterSection>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={() =>
            onChange({
              ...filters,
              category: undefined,
              tag: undefined,
              difficulty: undefined,
              author: undefined,
              from: undefined,
              to: undefined,
            })
          }
          className="inline-flex items-center gap-1.5 text-xs text-fg-muted hover:text-fg"
        >
          <X className="h-3.5 w-3.5" />
          Clear filters
        </button>
      )}
    </>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
        {title}
      </h4>
      {children}
    </div>
  );
}

function FilterOption({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors",
        active ? "bg-bg-muted font-medium text-fg" : "text-fg-muted hover:bg-bg-muted hover:text-fg"
      )}
    >
<span>{label}</span>
      {typeof count === "number" && (
        <span className="text-xs text-fg-subtle">{count}</span>
      )}
    </button>
  );
}
