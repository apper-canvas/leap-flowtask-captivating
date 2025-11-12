import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CategoryTag = ({ category, size = "sm" }) => {
  if (!category) return null;

  const sizeStyles = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-all duration-200",
        sizeStyles[size]
      )}
      style={{
        backgroundColor: `${category.color}20`,
        color: category.color,
        border: `1px solid ${category.color}30`
      }}
    >
      <ApperIcon name={category.icon} className="w-3 h-3 mr-1" />
      {category.name}
    </span>
  );
};

export default CategoryTag;