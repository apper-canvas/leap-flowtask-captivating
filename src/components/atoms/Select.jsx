import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  className, 
  children,
  label,
  error,
  placeholder,
  ...props 
}, ref) => {
  const selectStyles = "flex h-12 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 appearance-none";
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            selectStyles,
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <ApperIcon 
          name="ChevronDown" 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" 
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;