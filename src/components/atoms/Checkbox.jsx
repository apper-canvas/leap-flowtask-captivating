import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  className,
  checked = false,
  onChange,
  disabled = false,
  ...props 
}, ref) => {
  const checkboxStyles = "w-5 h-5 rounded-sm border-2 border-gray-300 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer relative overflow-hidden";
  
  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => !disabled && onChange && onChange(!checked)}
      disabled={disabled}
      className={cn(
        checkboxStyles,
        checked && "bg-gradient-to-br from-primary-500 to-secondary-500 border-primary-500",
        className
      )}
      {...props}
    >
      {checked && (
        <ApperIcon 
          name="Check" 
          className="w-3 h-3 text-white absolute inset-0 m-auto animate-bounce-check" 
        />
      )}
    </button>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;