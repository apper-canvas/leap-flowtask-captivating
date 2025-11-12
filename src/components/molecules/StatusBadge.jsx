import React from 'react';
import { cn } from '@/utils/cn';

const StatusBadge = ({ status, className, ...props }) => {
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'not started':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const displayStatus = status || 'Not Started';

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        getStatusStyles(displayStatus),
        className
      )}
      {...props}
    >
      {displayStatus}
    </span>
  );
};

export default StatusBadge;