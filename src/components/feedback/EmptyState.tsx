import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-bg-subtle px-6 py-16 text-center">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-bg text-fg-muted">
        {icon ?? <Search className="h-5 w-5" />}
      </div>
      <h3 className="font-display text-lg font-semibold text-fg">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-fg-muted">{description}</p>
      {action && (
        <Button variant="outline" size="md" className="mt-6" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
