import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';
import { projectService } from '@/services/api/projectService';

const ProjectForm = ({ project, onSuccess, onCancel, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name_c: '',
    description_c: '',
    start_date_c: '',
    end_date_c: '',
    status_c: 'Not Started',
    Tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: 'Not Started', label: 'Not Started' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    if (project && mode === 'edit') {
      setFormData({
        name_c: project.name_c || '',
        description_c: project.description_c || '',
        start_date_c: project.start_date_c ? project.start_date_c.split('T')[0] : '',
        end_date_c: project.end_date_c ? project.end_date_c.split('T')[0] : '',
        status_c: project.status_c || 'Not Started',
        Tags: project.Tags || ''
      });
    }
  }, [project, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name_c.trim()) {
      newErrors.name_c = 'Project name is required';
    }

    if (formData.start_date_c && formData.end_date_c) {
      if (new Date(formData.start_date_c) > new Date(formData.end_date_c)) {
        newErrors.end_date_c = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDateTimeForAPI = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Prepare data for API
      const apiData = {
        name_c: formData.name_c.trim(),
        description_c: formData.description_c.trim() || undefined,
        start_date_c: formData.start_date_c ? formatDateTimeForAPI(formData.start_date_c) : undefined,
        end_date_c: formData.end_date_c ? formatDateTimeForAPI(formData.end_date_c) : undefined,
        status_c: formData.status_c,
        Tags: formData.Tags.trim() || undefined
      };

      let result;
      if (mode === 'create') {
        result = await projectService.create(apiData);
        toast.success('Project created successfully!');
      } else {
        result = await projectService.update(project.Id, apiData);
        toast.success('Project updated successfully!');
      }

      onSuccess?.(result);
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} project:`, error);
      toast.error(error.message || `Failed to ${mode === 'create' ? 'create' : 'update'} project`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Name */}
      <div>
        <label htmlFor="name_c" className="block text-sm font-medium text-gray-700 mb-2">
          Project Name *
        </label>
        <Input
          id="name_c"
          name="name_c"
          value={formData.name_c}
          onChange={handleInputChange}
          placeholder="Enter project name"
          className={errors.name_c ? 'border-red-500' : ''}
          disabled={loading}
        />
        {errors.name_c && (
          <p className="mt-1 text-sm text-red-600">{errors.name_c}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description_c" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <Textarea
          id="description_c"
          name="description_c"
          value={formData.description_c}
          onChange={handleInputChange}
          placeholder="Enter project description"
          rows={4}
          disabled={loading}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_date_c" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <Input
            id="start_date_c"
            name="start_date_c"
            type="date"
            value={formData.start_date_c}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="end_date_c" className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <Input
            id="end_date_c"
            name="end_date_c"
            type="date"
            value={formData.end_date_c}
            onChange={handleInputChange}
            className={errors.end_date_c ? 'border-red-500' : ''}
            disabled={loading}
          />
          {errors.end_date_c && (
            <p className="mt-1 text-sm text-red-600">{errors.end_date_c}</p>
          )}
        </div>
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status_c" className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <Select
          id="status_c"
          name="status_c"
          value={formData.status_c}
          onChange={handleInputChange}
          disabled={loading}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="Tags" className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <Input
          id="Tags"
          name="Tags"
          value={formData.Tags}
          onChange={handleInputChange}
          placeholder="Enter tags separated by commas"
          disabled={loading}
        />
        <p className="mt-1 text-sm text-gray-500">
          Separate multiple tags with commas (e.g., "web, frontend, react")
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="min-w-[100px]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {mode === 'create' ? 'Creating...' : 'Updating...'}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ApperIcon name={mode === 'create' ? 'Plus' : 'Save'} className="w-4 h-4" />
              {mode === 'create' ? 'Create Project' : 'Update Project'}
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;