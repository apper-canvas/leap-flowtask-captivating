import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ErrorView = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 p-8">
      <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertCircle" className="w-10 h-10 text-red-500" />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-900">Oops! Something went wrong</h3>
        <p className="text-gray-600 max-w-md">
          {message || "We encountered an error while loading your tasks. Please try again."}
        </p>
      </div>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorView;