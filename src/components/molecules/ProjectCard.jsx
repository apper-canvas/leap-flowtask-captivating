import React from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import StatusBadge from '@/components/molecules/StatusBadge';
import { cn } from '@/utils/cn';

const ProjectCard = ({ project, onEdit, onDelete, onView, className, ...props }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getTags = (tags) => {
    if (!tags) return [];
    if (typeof tags === 'string') {
      return tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }
    return Array.isArray(tags) ? tags : [];
  };

  const tagList = getTags(project.Tags);

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200',
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {project.name_c || 'Untitled Project'}
          </h3>
          <StatusBadge status={project.status_c} className="mt-2" />
        </div>
        <div className="flex items-center gap-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView?.(project)}
            className="text-gray-500 hover:text-gray-700"
          >
            <ApperIcon name="Eye" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(project)}
            className="text-gray-500 hover:text-gray-700"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(project)}
            className="text-gray-500 hover:text-red-600"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Description */}
      {project.description_c && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {project.description_c}
        </p>
      )}

      {/* Tags */}
      {tagList.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {tagList.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700"
            >
              {tag}
            </span>
          ))}
          {tagList.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-500">
              +{tagList.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <ApperIcon name="Calendar" className="w-4 h-4" />
          <div>
            <div className="text-xs text-gray-400">Start Date</div>
            <div>{formatDate(project.start_date_c)}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ApperIcon name="CalendarClock" className="w-4 h-4" />
          <div>
            <div className="text-xs text-gray-400">End Date</div>
            <div>{formatDate(project.end_date_c)}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
        <span>
          Created {formatDate(project.CreatedOn)}
        </span>
        <span>
          Modified {formatDate(project.ModifiedOn)}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;