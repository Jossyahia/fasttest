import React from "react";

const NotificationSkeleton = () => {
  return (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse flex items-center space-x-4 bg-gray-100 rounded-lg p-4"
        >
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSkeleton;
