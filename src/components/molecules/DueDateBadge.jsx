import React from "react";
import { format, isAfter, isBefore, addDays } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const DueDateBadge = ({ dueDate, size = "sm" }) => {
  if (!dueDate) return null;

  const now = new Date();
  const due = new Date(dueDate);
  const tomorrow = addDays(now, 1);
  
  const isOverdue = isBefore(due, now);
  const isDueSoon = isAfter(due, now) && isBefore(due, tomorrow);

  const getDateVariant = () => {
    if (isOverdue) return "error";
    if (isDueSoon) return "warning";
    return "default";
  };

  const getDateStyles = () => {
    const variant = getDateVariant();
    switch (variant) {
      case "error":
        return "bg-red-50 text-red-700 border border-red-200";
      case "warning":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const sizeStyles = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), "MMM d");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-medium",
        getDateStyles(),
        sizeStyles[size]
      )}
    >
      <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
      {formatDate(dueDate)}
    </span>
  );
};

export default DueDateBadge;