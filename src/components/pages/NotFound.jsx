import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-6">
          <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="Search" className="w-16 h-16 text-primary-500" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Looks like you've wandered off the task list! The page you're looking for doesn't exist.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 px-6 py-3"
          >
            <ApperIcon name="Home" className="w-5 h-5 mr-2" />
            Back to Tasks
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="px-6 py-3"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;