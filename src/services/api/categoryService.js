import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const categoryService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const response = await apperClient.fetchRecords('categories_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "task_count_c"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching categories:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const response = await apperClient.getRecordById('categories_c', parseInt(id), {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "task_count_c"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching category:", response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching category:", error?.response?.data?.message || error);
      return null;
    }
  },

  async create(categoryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const payload = {
        records: [{
          name_c: categoryData.name_c,
          color_c: categoryData.color_c,
          icon_c: categoryData.icon_c,
          task_count_c: categoryData.task_count_c || 0
        }]
      };

      const response = await apperClient.createRecord('categories_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} categories:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      return null;
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, categoryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const updateData = {};
      if (categoryData.name_c !== undefined) updateData.name_c = categoryData.name_c;
      if (categoryData.color_c !== undefined) updateData.color_c = categoryData.color_c;
      if (categoryData.icon_c !== undefined) updateData.icon_c = categoryData.icon_c;
      if (categoryData.task_count_c !== undefined) updateData.task_count_c = categoryData.task_count_c;

      const payload = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };

      const response = await apperClient.updateRecord('categories_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} categories:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      return null;
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('categories_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} categories:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error);
      return false;
    }
  },

  async updateTaskCount(id, count) {
    try {
      return await this.update(id, { task_count_c: count });
    } catch (error) {
      console.error("Error updating task count:", error?.response?.data?.message || error);
      return null;
    }
  }
};