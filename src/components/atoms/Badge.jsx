import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  variant = "default", 
  size = "md",
  className,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center rounded-full font-medium transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-800",
    high: "bg-red-100 text-red-800 border border-red-200",
    medium: "bg-amber-100 text-amber-800 border border-amber-200",
    low: "bg-blue-100 text-blue-800 border border-blue-200",
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };
  
  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;