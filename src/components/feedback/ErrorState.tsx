import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
  title: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center rounded-lg border border-danger/20 bg-danger/5 px-4 py-8 text-center sm:px-6 sm:py-10">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-danger/20 bg-bg text-danger sm:mb-4 sm:h-12 sm:w-12">
        <AlertTriangle className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="font-display text-lg font-semibold text-fg">{title}</h3>
      {message && <p className="mt-1 max-w-md break-words text-sm text-fg-muted">{message}</p>}
      {onRetry && <Button variant="outline" size="md" className="mt-5" onClick={onRetry}>Try again</Button>}
    </div>
  );
}
