import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

export const taskFileService = {
  async getByTaskId(taskId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const response = await apperClient.fetchRecords('task_files_c', {
        fields: [
          {"field": {"Name": "task_id_c"}},
          {"field": {"Name": "file_name_c"}},
          {"field": {"Name": "file_url_c"}},
          {"field": {"Name": "file_c"}},
          {"field": {"Name": "upload_date_c"}},
          {"field": {"Name": "description_c"}}
        ],
        where: [{
          "FieldName": "task_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(taskId)],
          "Include": true
        }]
      });

      if (!response?.data?.length) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching task files:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(fileData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      // Convert files to API format if needed
      const { ApperFileUploader } = window.ApperSDK;
      const convertedFiles = ApperFileUploader.toCreateFormat(fileData.file_c);

      const payload = {
        records: [{
          task_id_c: parseInt(fileData.task_id_c),
          file_name_c: fileData.file_name_c,
          file_url_c: fileData.file_url_c || null,
          file_c: convertedFiles,
          upload_date_c: new Date().toISOString(),
          description_c: fileData.description_c || null
        }]
      };

      const response = await apperClient.createRecord('task_files_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} task files:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      return null;
    } catch (error) {
      console.error("Error creating task file:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(fileId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const response = await apperClient.deleteRecord('task_files_c', {
        RecordIds: [parseInt(fileId)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} task files:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting task file:", error?.response?.data?.message || error);
      return false;
    }
  }
};