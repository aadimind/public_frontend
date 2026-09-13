import type { PaperFilters } from "@/types";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PaperSortProps {
  value: NonNullable<PaperFilters["sort"]>;
  onChange: (value: NonNullable<PaperFilters["sort"]>) => void;
}

const options: { value: NonNullable<PaperFilters["sort"]>; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "popular", label: "Most popular" },
  { value: "relevance", label: "Most relevant" },
];

export function PaperSort({ value, onChange }: PaperSortProps) {
  const current = options.find((o) => o.value === value) ?? options[0];
  return (
    <Dropdown
      align="end"
      trigger={
        <Button
          variant="outline"
          size="sm"
          rightIcon={<ChevronDown className="h-3.5 w-3.5 text-fg-muted" aria-hidden="true" />}
        >
          <span className="text-fg-muted">Sort:</span>
          <span>{current.label}</span>
        </Button>
      }
    >
      {(close) => (
        <div className="py-1">
          {options.map((opt) => (
            <DropdownItem
              key={opt.value}
              active={opt.value === value}
              onSelect={() => {
                onChange(opt.value);
                close();
              }}
            >
              {opt.label}
            </DropdownItem>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
