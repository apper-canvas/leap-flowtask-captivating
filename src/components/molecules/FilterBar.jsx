import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";

const FilterBar = ({ 
  filters, 
  activeFilter, 
  onFilterChange,
  className 
}) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? "primary" : "ghost"}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            "rounded-full px-4 py-2",
            activeFilter === filter.value 
              ? "shadow-lg" 
              : "hover:bg-gray-100 text-gray-600"
          )}
        >
          {filter.label}
          {filter.count !== undefined && (
            <span className={cn(
              "ml-2 px-2 py-0.5 text-xs rounded-full",
              activeFilter === filter.value
                ? "bg-white/20 text-white"
                : "bg-gray-200 text-gray-600"
            )}>
              {filter.count}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};

export default FilterBar;