import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NativeSearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">;

interface SearchInputProps extends NativeSearchInputProps {
  onClear?: () => void;
  size?: "md" | "lg";
  type?: "search" | "text";
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, size = "md", className, value, id, name, type = "search", ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? `search-${generatedId.replace(/:/g, "")}`;
    const inputName = name ?? inputId;
    const sizes = { md: "h-11 text-sm", lg: "h-14 text-base" };
    const hasClear = Boolean(value) && Boolean(onClear);

    return (
      <div className={cn("flex items-center gap-2 rounded-lg border border-border bg-bg", "transition-colors duration-150 focus-within:border-fg", sizes[size], className)}>
        <Search className="ml-4 h-4 w-4 flex-shrink-0 text-fg-muted" aria-hidden />
        <input
          ref={ref}
          type={type}
          value={value}
          className={cn("h-full w-full min-w-0 bg-transparent px-3 text-fg placeholder:text-fg-subtle focus:outline-none", type === "search" && "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none")}
          {...rest}
          id={inputId}
          name={inputName}
        />
        {hasClear && (
          <button type="button" onClick={onClear} aria-label="Clear search" className="mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-fg-muted hover:bg-bg-muted hover:text-fg">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
