import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import ApperFileFieldComponent from "@/components/atoms/FileUploader/ApperFileFieldComponent";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const TaskForm = ({ 
  task = null, 
  categories = [],
  onSubmit, 
  onCancel,
  isVisible = false 
}) => {
const [formData, setFormData] = useState({
    title_c: "",
    description_c: "",
    priority_c: "medium",
    due_date_c: "",
    category_id_c: ""
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState({});

useEffect(() => {
    if (task) {
      setFormData({
        title_c: task.title_c || "",
        description_c: task.description_c || "",
        priority_c: task.priority_c || "medium",
        due_date_c: task.due_date_c ? format(new Date(task.due_date_c), "yyyy-MM-dd'T'HH:mm") : "",
        category_id_c: task.category_id_c?.Id?.toString() || task.category_id_c?.toString() || ""
      });
    } else {
      setFormData({
        title_c: "",
        description_c: "",
        priority_c: "medium",
        due_date_c: "",
        category_id_c: categories.length > 0 ? categories[0].Id.toString() : ""
      });
    }
    setErrors({});
    setUploadedFiles([]);
  }, [task, categories, isVisible]);

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileStateChange = (files) => {
    setUploadedFiles(files || []);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title_c.trim()) {
      newErrors.title_c = "Title is required";
    }

    if (formData.due_date_c) {
      const dueDate = new Date(formData.due_date_c);
      if (dueDate <= new Date()) {
        newErrors.due_date_c = "Due date must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      category_id_c: parseInt(formData.category_id_c),
      due_date_c: formData.due_date_c ? new Date(formData.due_date_c).toISOString() : null,
      files: uploadedFiles
    };

    onSubmit(submitData);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {task ? "Edit Task" : "Create New Task"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="w-8 h-8 p-0 text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title_c" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              id="title_c"
              name="title_c"
              value={formData.title_c}
              onChange={handleInputChange}
              placeholder="Enter task title"
              className={errors.title_c ? "border-red-500" : ""}
            />
            {errors.title_c && (
              <p className="text-red-500 text-sm mt-1">{errors.title_c}</p>
            )}
          </div>

          <div>
            <label htmlFor="description_c" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              id="description_c"
              name="description_c"
              value={formData.description_c}
              onChange={handleInputChange}
              placeholder="Enter task description"
              rows="3"
            />
          </div>

          <div>
            <label htmlFor="priority_c" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <Select
              id="priority_c"
              name="priority_c"
              value={formData.priority_c}
              onChange={handleInputChange}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </Select>
          </div>

          <div>
            <label htmlFor="category_id_c" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select
              id="category_id_c"
              name="category_id_c"
              value={formData.category_id_c}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.Id} value={category.Id.toString()}>
                  {category.name_c}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="due_date_c" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <Input
              type="datetime-local"
              id="due_date_c"
              name="due_date_c"
              value={formData.due_date_c}
              onChange={handleInputChange}
              className={errors.due_date_c ? "border-red-500" : ""}
            />
            {errors.due_date_c && (
              <p className="text-red-500 text-sm mt-1">{errors.due_date_c}</p>
            )}
          </div>
{/* File Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Attachments
            </label>
            <ApperFileFieldComponent
              elementId="task-files"
              config={{
                fieldKey: 'task-files',
                fieldName: 'file_c',
                tableName: 'task_files_c',
                apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
                apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
                existingFiles: uploadedFiles,
                fileCount: uploadedFiles.length
              }}
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              {task ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TaskForm;