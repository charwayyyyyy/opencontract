import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[96px] w-full rounded-md border border-input bg-surface px-3 py-2",
          "text-sm text-text-primary placeholder:text-text-muted",
          "resize-y transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 focus:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-[hsl(var(--status-error))]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
