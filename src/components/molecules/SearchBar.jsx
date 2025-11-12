import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ 
  value, 
  onChange, 
  onClear,
  placeholder = "Search tasks...",
  className,
  ...props 
}) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <ApperIcon name="Search" className="w-5 h-5 text-gray-400" />
      </div>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-12 pr-12 bg-white shadow-sm border-gray-200 focus:shadow-md"
        {...props}
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <ApperIcon name="X" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;