import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-surface px-3 py-2",
          "text-sm text-text-primary placeholder:text-text-muted",
          "transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 focus:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-[hsl(var(--status-error))] focus:ring-[hsl(var(--status-error))]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
