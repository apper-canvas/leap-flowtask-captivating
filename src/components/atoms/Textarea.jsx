import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ 
  className, 
  label,
  error,
  rows = 3,
  ...props 
}, ref) => {
  const textareaStyles = "flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-vertical";
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          textareaStyles,
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        rows={rows}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;