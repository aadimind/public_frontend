import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type NativeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size">;

interface InputProps extends NativeInputProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: "sm" | "md" | "lg";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, rightIcon, size = "md", className, id, name, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? `input-${generatedId.replace(/:/g, "")}`;
    const inputName = name ?? inputId;
    const sizeClass = {
      sm: "h-9 text-sm",
      md: "h-11 text-sm",
      lg: "h-12 text-base",
    }[size];

    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border border-border bg-bg",
          "transition-colors duration-150",
          "focus-within:border-fg",
          sizeClass,
          className
        )}
      >
        {leftIcon && (
          <span className="flex h-full items-center pl-3 text-fg-muted" aria-hidden>
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "h-full w-full bg-transparent px-3 text-fg placeholder:text-fg-subtle",
            "focus:outline-none disabled:opacity-50",
            Boolean(leftIcon) && "pl-0",
            Boolean(rightIcon) && "pr-0"
          )}
          {...rest}
          id={inputId}
          name={inputName}
        />
        {rightIcon && (
          <span className="flex h-full items-center pr-3 text-fg-muted" aria-hidden>
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
