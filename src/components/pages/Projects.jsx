import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { projectService } from '@/services/api/projectService';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Empty from '@/components/ui/Empty';
import SearchBar from '@/components/molecules/SearchBar';
import ProjectForm from '@/components/organisms/ProjectForm';
import ProjectCard from '@/components/organisms/ProjectCard';
import Button from '@/components/atoms/Button';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    setError(null);
    
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleCreateProject() {
    setEditingProject(null);
    setShowForm(true);
  }

  function handleEditProject(project) {
    setEditingProject(project);
    setShowForm(true);
  }

  async function handleSubmitProject(projectData) {
    try {
      let result;
      if (editingProject) {
        result = await projectService.update(editingProject.Id, projectData);
        if (result) {
          toast.success('Project updated successfully');
          setProjects(prev => 
            prev.map(p => p.Id === editingProject.Id ? { ...p, ...result } : p)
          );
        } else {
          toast.error('Failed to update project');
        }
      } else {
        result = await projectService.create(projectData);
        if (result) {
          toast.success('Project created successfully');
          setProjects(prev => [result, ...prev]);
        } else {
          toast.error('Failed to create project');
        }
      }
      
      if (result) {
        setShowForm(false);
        setEditingProject(null);
      }
    } catch (error) {
      toast.error('An error occurred while saving the project');
      console.error('Error saving project:', error);
    }
  }

  async function handleDeleteProject(projectId) {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const success = await projectService.delete(projectId);
      if (success) {
        toast.success('Project deleted successfully');
        setProjects(prev => prev.filter(p => p.Id !== projectId));
      } else {
        toast.error('Failed to delete project');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the project');
      console.error('Error deleting project:', error);
    }
  }

  function getFilteredProjects() {
    return projects.filter(project => {
      const matchesSearch = !searchQuery || 
        project.name_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description_c?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || project.status_c === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  function getProjectCounts() {
    const counts = {
      all: projects.length,
      'Not Started': 0,
      'In Progress': 0,
      'Completed': 0,
      'Cancelled': 0
    };

    projects.forEach(project => {
      if (project.status_c && counts.hasOwnProperty(project.status_c)) {
        counts[project.status_c]++;
      }
    });

    return counts;
  }

  const filteredProjects = getFilteredProjects();
  const projectCounts = getProjectCounts();

  if (loading) {
    return <Loading message="Loading projects..." />;
  }

  if (error) {
    return (
      <ErrorView 
        message={error} 
        onRetry={loadProjects}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your projects and track progress
            </p>
          </div>
          <Button
            onClick={handleCreateProject}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white"
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search projects..."
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'Not Started', 'In Progress', 'Completed', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === status
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {status === 'all' ? 'All' : status} ({projectCounts[status]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-auto p-6">
        {filteredProjects.length === 0 ? (
          <Empty
            icon="FolderOpen"
            title={projects.length === 0 ? "No projects yet" : "No projects match your search"}
            description={
              projects.length === 0 
                ? "Create your first project to get started"
                : "Try adjusting your search or filter criteria"
            }
            actionLabel={projects.length === 0 ? "Create Project" : undefined}
            onAction={projects.length === 0 ? handleCreateProject : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProjectCard
                    project={project}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowForm(false);
                setEditingProject(null);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <ProjectForm
                project={editingProject}
                onSubmit={handleSubmitProject}
                onCancel={() => {
                  setShowForm(false);
                  setEditingProject(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Projects;