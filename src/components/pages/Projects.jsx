import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ProjectCard from "@/components/molecules/ProjectCard";
import ProjectForm from "@/components/organisms/ProjectForm";
import { projectService } from "@/services/api/projectService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import StatusBadge from "@/components/ui/StatusBadge";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Not Started', label: 'Not Started' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, statusFilter]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getAll();
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      setError(error.message || 'Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(project => {
        const name = project.name_c?.toLowerCase() || '';
        const description = project.description_c?.toLowerCase() || '';
        const tags = project.Tags?.toLowerCase() || '';
        return name.includes(term) || description.includes(term) || tags.includes(term);
      });
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status_c === statusFilter);
    }

    setFilteredProjects(filtered);
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleViewProject = (project) => {
    setViewingProject(project);
  };

  const handleDeleteProject = async (project) => {
    if (!confirm(`Are you sure you want to delete "${project.name_c}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await projectService.delete(project.Id);
      toast.success('Project deleted successfully!');
      setProjects(prev => prev.filter(p => p.Id !== project.Id));
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(error.message || 'Failed to delete project');
    }
  };

  const handleFormSuccess = (projectData) => {
    if (editingProject) {
      // Update existing project
      setProjects(prev => 
        prev.map(p => p.Id === editingProject.Id ? { ...p, ...projectData } : p)
      );
    } else {
      // Add new project
      setProjects(prev => [projectData, ...prev]);
    }
    setShowForm(false);
    setEditingProject(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorView
        message={error}
        onRetry={loadProjects}
      />
    );
  }

  // Project Detail Modal
  if (viewingProject) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {viewingProject.name_c || 'Untitled Project'}
              </h1>
              <div className="flex items-center gap-4">
                <StatusBadge status={viewingProject.status_c} />
                <span className="text-sm text-gray-500">
                  Project ID: {viewingProject.Id}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleEditProject(viewingProject)}
              >
                <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="ghost"
                onClick={() => setViewingProject(null)}
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Description */}
            {viewingProject.description_c && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {viewingProject.description_c}
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                    <dd className="text-sm text-gray-900">
                      {viewingProject.start_date_c ? format(new Date(viewingProject.start_date_c), 'PPP') : 'Not set'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">End Date</dt>
                    <dd className="text-sm text-gray-900">
                      {viewingProject.end_date_c ? format(new Date(viewingProject.end_date_c), 'PPP') : 'Not set'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="text-sm text-gray-900">{viewingProject.status_c}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="text-sm text-gray-900">
                      {viewingProject.CreatedOn ? format(new Date(viewingProject.CreatedOn), 'PPP') : 'Unknown'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Modified</dt>
                    <dd className="text-sm text-gray-900">
                      {viewingProject.ModifiedOn ? format(new Date(viewingProject.ModifiedOn), 'PPP') : 'Unknown'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Tags */}
            {viewingProject.Tags && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {viewingProject.Tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Project Form
  if (showForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </h1>
            <p className="text-gray-600 mt-1">
              {editingProject ? 'Update project details below' : 'Fill in the details to create a new project'}
            </p>
          </div>

          <ProjectForm
            project={editingProject}
            mode={editingProject ? 'edit' : 'create'}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">
            Manage your projects and track their progress
          </p>
        </div>
        <Button onClick={handleCreateProject}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredProjects.length === 0 ? (
        <Empty
          title={searchTerm || statusFilter !== 'all' ? 'No projects found' : 'No projects yet'}
          message={searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters to see more results.' : 'Create your first project to get started.'}
          actionText="Create Project"
          onAction={handleCreateProject}
          icon="FolderOpen"
        />
      ) : (
        <>
          {/* Results Summary */}
          <div className="text-sm text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.Id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                onView={handleViewProject}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Projects;