import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import TaskCard from "@/components/organisms/TaskCard";
import TaskForm from "@/components/organisms/TaskForm";
import SearchBar from "@/components/molecules/SearchBar";
import FilterBar from "@/components/molecules/FilterBar";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Completed tasks visibility
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSubmitTask = async (taskData) => {
    try {
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id, taskData);
        setTasks(prev => prev.map(t => t.Id === editingTask.Id ? updatedTask : t));
        toast.success("Task updated successfully!");
      } else {
        const newTask = await taskService.create(taskData);
        setTasks(prev => [...prev, newTask]);
        toast.success("Task created successfully!");
      }
      setShowForm(false);
      setEditingTask(null);
    } catch (err) {
      toast.error(err.message || "Failed to save task");
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      if (!task) return;

      if (task.completed) {
        const updatedTask = await taskService.markIncomplete(taskId);
        setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
        toast.success("Task restored!");
      } else {
        const updatedTask = await taskService.markComplete(taskId);
        setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
        toast.success("Task completed! 🎉");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.Id !== taskId));
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete task");
    }
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!task.title.toLowerCase().includes(query) && 
            !task.description?.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Status filter
      if (statusFilter === "active" && task.completed) return false;
      if (statusFilter === "completed" && !task.completed) return false;

      // Priority filter
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;

      // Category filter
      if (selectedCategory && task.categoryId !== selectedCategory) return false;

      return true;
    });
  };

  const filteredTasks = getFilteredTasks();
  const activeTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  const getTaskCounts = () => {
    const counts = {};
    categories.forEach(category => {
      counts[category.Id] = tasks.filter(task => task.categoryId === category.Id).length;
    });
    return counts;
  };

  const statusFilters = [
    { value: "all", label: "All", count: filteredTasks.length },
    { value: "active", label: "Active", count: activeTasks.length },
    { value: "completed", label: "Completed", count: completedTasks.length },
  ];

  const priorityFilters = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" },
  ];

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 mt-1">
            {activeTasks.length} active, {completedTasks.length} completed
          </p>
        </div>
        <Button
          onClick={handleCreateTask}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-lg"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
          placeholder="Search your tasks..."
        />
        
        <div className="flex flex-wrap gap-4">
          <FilterBar
            filters={statusFilters}
            activeFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
          <FilterBar
            filters={priorityFilters}
            activeFilter={priorityFilter}
            onFilterChange={setPriorityFilter}
          />
        </div>
      </div>

      {/* Active Tasks */}
      {activeTasks.length === 0 && completedTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          message={searchQuery || statusFilter !== "all" || priorityFilter !== "all" || selectedCategory 
            ? "Try adjusting your filters to see more tasks."
            : "Ready to get productive? Add your first task and start organizing your day!"
          }
          onAction={searchQuery || statusFilter !== "all" || priorityFilter !== "all" || selectedCategory ? null : handleCreateTask}
          actionText="Add your first task"
        />
      ) : (
        <>
          {activeTasks.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ApperIcon name="Clock" className="w-5 h-5 text-primary-500" />
                Active Tasks ({activeTasks.length})
              </h2>
              <AnimatePresence mode="popLayout">
                {activeTasks.map((task) => (
                  <TaskCard
                    key={task.Id}
                    task={task}
                    category={categories.find(c => c.Id === task.categoryId)}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Completed Tasks Section */}
          {completedTasks.length > 0 && (
            <div className="space-y-4">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200"
              >
                <ApperIcon 
                  name={showCompleted ? "ChevronDown" : "ChevronRight"} 
                  className="w-5 h-5 text-success" 
                />
                <ApperIcon name="CheckCircle2" className="w-5 h-5 text-success" />
                Completed Tasks ({completedTasks.length})
              </button>
              
              <AnimatePresence>
                {showCompleted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {completedTasks.map((task) => (
                      <TaskCard
                        key={task.Id}
                        task={task}
                        category={categories.find(c => c.Id === task.categoryId)}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* Task Form Modal */}
      <TaskForm
        task={editingTask}
        categories={categories}
        onSubmit={handleSubmitTask}
        onCancel={() => {
          setShowForm(false);
          setEditingTask(null);
        }}
        isVisible={showForm}
      />
    </div>
  );
};

export default TaskList;