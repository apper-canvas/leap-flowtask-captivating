import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";

const TaskForm = ({ 
  task = null, 
  categories = [],
  onSubmit, 
  onCancel,
  isVisible = false 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    categoryId: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd'T'HH:mm") : "",
        categoryId: task.categoryId?.toString() || ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        categoryId: categories.length > 0 ? categories[0].Id.toString() : ""
      });
    }
    setErrors({});
  }, [task, categories, isVisible]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      categoryId: parseInt(formData.categoryId),
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    };

    onSubmit(submitData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
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
          <Input
            label="Task Title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter task title..."
            error={errors.title}
            autoFocus
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Add a description..."
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => handleInputChange("priority", e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </Select>

            <Select
              label="Category"
              value={formData.categoryId}
              onChange={(e) => handleInputChange("categoryId", e.target.value)}
              error={errors.categoryId}
            >
              <option value="" disabled>Select category</option>
              {categories.map((category) => (
                <option key={category.Id} value={category.Id.toString()}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          <Input
            label="Due Date (Optional)"
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              <ApperIcon name={task ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
              {task ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TaskForm;