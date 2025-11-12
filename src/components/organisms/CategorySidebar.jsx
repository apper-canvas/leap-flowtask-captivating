import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CategorySidebar = ({ 
  categories = [],
  selectedCategory,
  onCategorySelect,
  taskCounts,
  className 
}) => {
  const getTotalTasks = () => {
    return Object.values(taskCounts).reduce((sum, count) => sum + count, 0);
  };

  const categoryItems = [
    {
      Id: "all",
      name: "All Tasks",
      icon: "List",
      color: "#4F46E5",
      count: getTotalTasks()
    },
    ...categories.map(category => ({
      ...category,
      count: taskCounts[category.Id] || 0
    }))
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
        
        <div className="space-y-1">
          {categoryItems.map((item) => (
            <motion.button
              key={item.Id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCategorySelect(item.Id === "all" ? null : item.Id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                selectedCategory === (item.Id === "all" ? null : item.Id)
                  ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 shadow-sm border border-primary-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <ApperIcon 
                name={item.icon} 
                className="w-4 h-4 flex-shrink-0" 
              />
              <span className="font-medium flex-1">{item.name}</span>
              <span className={cn(
                "text-xs px-2 py-1 rounded-full font-medium",
                selectedCategory === (item.Id === "all" ? null : item.Id)
                  ? "bg-white/50 text-primary-700"
                  : "bg-gray-100 text-gray-600"
              )}>
                {item.count}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-500 hover:text-gray-700"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-3" />
          Add Category
        </Button>
      </div>
    </div>
  );
};

export default CategorySidebar;