import React from 'react';
import { format, isAfter, isBefore } from 'date-fns';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/molecules/StatusBadge';
import Button from '@/components/atoms/Button';

function ProjectCard({ project, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return null;
    }
  };

  const getDateStatus = () => {
    if (!project.start_date_c && !project.end_date_c) return null;
    
    const now = new Date();
    const startDate = project.start_date_c ? new Date(project.start_date_c) : null;
    const endDate = project.end_date_c ? new Date(project.end_date_c) : null;

    if (startDate && isBefore(now, startDate)) {
      return { type: 'upcoming', message: 'Starts soon' };
    }
    
    if (endDate && isAfter(now, endDate) && project.status_c !== 'Completed') {
      return { type: 'overdue', message: 'Overdue' };
    }
    
    return null;
  };

  const dateStatus = getDateStatus();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {project.name_c || 'Untitled Project'}
          </h3>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(project)}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="Edit" className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(project.Id)}
              className="text-gray-400 hover:text-red-600"
            >
              <ApperIcon name="Trash2" className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <StatusBadge status={project.status_c} className="mb-3" />
        
        {project.description_c && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {project.description_c}
          </p>
        )}
      </div>

      {/* Dates */}
      {(project.start_date_c || project.end_date_c) && (
        <div className="px-6 pb-4">
          <div className="space-y-2">
            {project.start_date_c && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ApperIcon name="Calendar" className="h-4 w-4 text-gray-400" />
                <span>Start: {formatDate(project.start_date_c)}</span>
              </div>
            )}
            {project.end_date_c && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ApperIcon name="CalendarX" className="h-4 w-4 text-gray-400" />
                <span>End: {formatDate(project.end_date_c)}</span>
              </div>
            )}
          </div>
          
          {dateStatus && (
            <div className={cn(
              "mt-2 px-2 py-1 rounded text-xs font-medium",
              dateStatus.type === 'overdue' 
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            )}>
              {dateStatus.message}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Created {project.CreatedOn ? format(new Date(project.CreatedOn), 'MMM d') : 'recently'}
          </span>
          <span>
            Modified {project.ModifiedOn ? format(new Date(project.ModifiedOn), 'MMM d') : 'recently'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;