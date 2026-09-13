import { useReadingProgress } from "@/hooks/useReadingProgress";

export function ReadingProgress() {
  const progress = useReadingProgress("article");
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <div
        className="h-full bg-fg transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
