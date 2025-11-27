import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const taskService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

const response = await apperClient.fetchRecords('tasks_c', {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching tasks:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const response = await apperClient.getRecordById('tasks_c', parseInt(id), {
fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching task:", response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching task:", error?.response?.data?.message || error);
      return null;
    }
  },

async create(taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const payload = {
        records: [{
          title_c: taskData.title_c,
          description_c: taskData.description_c,
          priority_c: taskData.priority_c,
          due_date_c: taskData.due_date_c,
          category_id_c: taskData.category_id_c ? parseInt(taskData.category_id_c) : null,
          completed_c: false,
          created_at_c: new Date().toISOString(),
          completed_at_c: null
        }]
      };

      const response = await apperClient.createRecord('tasks_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        const createdTask = successful.length > 0 ? successful[0].data : null;
        
        // Handle file uploads if files were provided
        if (createdTask && taskData.files && taskData.files.length > 0) {
          const { taskFileService } = await import('./taskFileService');
          
          // Get files from ApperFileFieldComponent
          const { ApperFileUploader } = window.ApperSDK;
          const files = await ApperFileUploader.FileField.getFiles('task-files') || taskData.files;
          
          // Create file records for each uploaded file
          for (const file of files) {
            await taskFileService.create({
              task_id_c: createdTask.Id,
              file_name_c: file.Name || file.name,
              file_c: [file]
            });
          }
        }
        
        return createdTask;
      }
      return null;
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const updateData = {};
      if (taskData.title_c !== undefined) updateData.title_c = taskData.title_c;
      if (taskData.description_c !== undefined) updateData.description_c = taskData.description_c;
      if (taskData.priority_c !== undefined) updateData.priority_c = taskData.priority_c;
      if (taskData.due_date_c !== undefined) updateData.due_date_c = taskData.due_date_c;
      if (taskData.category_id_c !== undefined) updateData.category_id_c = taskData.category_id_c ? parseInt(taskData.category_id_c) : null;
      if (taskData.completed_c !== undefined) updateData.completed_c = taskData.completed_c;
      if (taskData.completed_at_c !== undefined) updateData.completed_at_c = taskData.completed_at_c;

      const payload = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };

      const response = await apperClient.updateRecord('tasks_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      return null;
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const payload = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('tasks_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      return false;
    }
  },

  async markComplete(id) {
    try {
      return await this.update(id, { 
        completed_c: true, 
        completed_at_c: new Date().toISOString() 
      });
    } catch (error) {
      console.error("Error marking task complete:", error?.response?.data?.message || error);
      return null;
    }
  },

  async markIncomplete(id) {
    try {
      return await this.update(id, { 
        completed_c: false, 
        completed_at_c: null 
      });
    } catch (error) {
      console.error("Error marking task incomplete:", error?.response?.data?.message || error);
      return null;
    }
  }
};