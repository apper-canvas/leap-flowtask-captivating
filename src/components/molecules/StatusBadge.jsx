import React from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const statusConfig = {
  'Not Started': {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: 'Clock',
    iconColor: 'text-gray-600'
  },
  'In Progress': {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: 'Play',
    iconColor: 'text-blue-600'
  },
  'Completed': {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: 'CheckCircle',
    iconColor: 'text-green-600'
  },
  'Cancelled': {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: 'XCircle',
    iconColor: 'text-red-600'
  }
};

function StatusBadge({ status, className, showIcon = true, size = 'sm' }) {
  const config = statusConfig[status] || statusConfig['Not Started'];
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base'
  };

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-3.5 w-3.5', 
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors',
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <ApperIcon 
          name={config.icon} 
          className={cn(iconSizes[size], config.iconColor)} 
        />
      )}
      {status || 'Not Started'}
    </span>
  );
}

export default StatusBadge;