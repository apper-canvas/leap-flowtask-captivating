import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const PriorityBadge = ({ priority, size = "md" }) => {
  const getPriorityConfig = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return {
          variant: "high",
          icon: "AlertCircle",
          label: "High"
        };
      case "medium":
        return {
          variant: "medium",
          icon: "Circle",
          label: "Medium"
        };
      case "low":
        return {
          variant: "low",
          icon: "Minus",
          label: "Low"
        };
      default:
        return {
          variant: "default",
          icon: "Circle",
          label: "Normal"
        };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <Badge variant={config.variant} size={size}>
      <ApperIcon name={config.icon} className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;