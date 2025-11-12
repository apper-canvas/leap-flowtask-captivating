import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ title = "No tasks yet", message, onAction, actionText = "Add your first task" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 p-8">
      <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center">
        <ApperIcon name="CheckCircle2" className="w-16 h-16 text-indigo-500" />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 max-w-md">
          {message || "Start organizing your day by adding your first task. You've got this!"}
        </p>
      </div>
      
      {onAction && (
        <Button 
          onClick={onAction}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default Empty;