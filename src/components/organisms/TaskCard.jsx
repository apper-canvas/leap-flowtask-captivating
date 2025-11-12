import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Button from "@/components/atoms/Button";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import CategoryTag from "@/components/molecules/CategoryTag";
import DueDateBadge from "@/components/molecules/DueDateBadge";

const TaskCard = ({ 
  task, 
  category,
  onToggleComplete,
  onEdit,
  onDelete,
  className 
}) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleComplete = async () => {
    if (task.completed) {
      // Restore task immediately
      onToggleComplete(task.Id);
    } else {
      // Complete task with animation
      setIsCompleting(true);
      setTimeout(() => {
        onToggleComplete(task.Id);
        setIsCompleting(false);
      }, 300);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isCompleting ? 0 : 1, 
        y: 0,
        scale: isCompleting ? 0.95 : 1,
        x: isCompleting ? 20 : 0
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100",
        task.completed && "opacity-75",
        isCompleting && "animate-task-complete",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="pt-1">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            className="hover:scale-110 transition-transform duration-200"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold text-gray-900 leading-tight",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className={cn(
                  "text-sm text-gray-600 mt-1 leading-relaxed",
                  task.completed && "text-gray-400"
                )}>
                  {task.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="w-8 h-8 p-0 text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.Id)}
                className="w-8 h-8 p-0 text-gray-400 hover:text-red-500"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <PriorityBadge priority={task.priority} />
            {task.dueDate && <DueDateBadge dueDate={task.dueDate} />}
            {category && <CategoryTag category={category} />}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;