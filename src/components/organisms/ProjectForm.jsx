import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

const STATUS_OPTIONS = [
  { value: 'Not Started', label: 'Not Started' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' }
];

function ProjectForm({ project, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name_c: '',
    description_c: '',
    start_date_c: '',
    end_date_c: '',
    status_c: 'Not Started'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name_c: project.name_c || '',
        description_c: project.description_c || '',
        start_date_c: project.start_date_c ? formatDateForInput(project.start_date_c) : '',
        end_date_c: project.end_date_c ? formatDateForInput(project.end_date_c) : '',
        status_c: project.status_c || 'Not Started'
      });
    }
  }, [project]);

  function formatDateForInput(dateString) {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, "yyyy-MM-dd'T'HH:mm");
    } catch {
      return '';
    }
  }

  function handleInputChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.name_c.trim()) {
      newErrors.name_c = 'Project name is required';
    }

    if (formData.start_date_c && formData.end_date_c) {
      const startDate = new Date(formData.start_date_c);
      const endDate = new Date(formData.end_date_c);
      
      if (startDate >= endDate) {
        newErrors.end_date_c = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Only send non-empty values, convert dates to ISO strings
      const submitData = {};
      
      if (formData.name_c) submitData.name_c = formData.name_c;
      if (formData.description_c) submitData.description_c = formData.description_c;
      if (formData.start_date_c) submitData.start_date_c = new Date(formData.start_date_c).toISOString();
      if (formData.end_date_c) submitData.end_date_c = new Date(formData.end_date_c).toISOString();
      if (formData.status_c) submitData.status_c = formData.status_c;

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {project ? 'Edit Project' : 'Create Project'}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <ApperIcon name="X" className="h-5 w-5" />
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <Input
              value={formData.name_c}
              onChange={(e) => handleInputChange('name_c', e.target.value)}
              placeholder="Enter project name"
              error={errors.name_c}
              className="w-full"
            />
            {errors.name_c && (
              <p className="mt-1 text-sm text-red-600">{errors.name_c}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              value={formData.description_c}
              onChange={(e) => handleInputChange('description_c', e.target.value)}
              placeholder="Enter project description"
              rows={4}
              className="w-full"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={formData.status_c}
              onChange={(e) => handleInputChange('status_c', e.target.value)}
              className="w-full"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <Input
                type="datetime-local"
                value={formData.start_date_c}
                onChange={(e) => handleInputChange('start_date_c', e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <Input
                type="datetime-local"
                value={formData.end_date_c}
                onChange={(e) => handleInputChange('end_date_c', e.target.value)}
                className="w-full"
              />
              {errors.end_date_c && (
                <p className="mt-1 text-sm text-red-600">{errors.end_date_c}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
                {project ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              project ? 'Update Project' : 'Create Project'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProjectForm;