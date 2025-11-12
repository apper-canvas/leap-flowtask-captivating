import React from "react";

const Loading = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Search bar skeleton */}
      <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
      
      {/* Filter buttons skeleton */}
      <div className="flex gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-20 bg-gray-200 rounded-full animate-pulse"></div>
        ))}
      </div>
      
      {/* Task cards skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 bg-gray-200 rounded-sm mt-1"></div>
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-48"></div>
                    <div className="h-4 bg-gray-100 rounded w-72"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;