import { getApperClient } from '@/services/apperClient';

class ProjectService {
  constructor() {
    this.tableName = 'projects_c';
  }

  async getAll(params = {}) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        return [];
      }

      const queryParams = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0},
        ...params
      };

      const response = await apperClient.fetchRecords(this.tableName, queryParams);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching projects:', error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        return null;
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);

      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(projectData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        return null;
      }

      // Only include Updateable fields
      const cleanData = {};
      if (projectData.name_c) cleanData.name_c = projectData.name_c;
      if (projectData.description_c) cleanData.description_c = projectData.description_c;
      if (projectData.start_date_c) cleanData.start_date_c = projectData.start_date_c;
      if (projectData.end_date_c) cleanData.end_date_c = projectData.end_date_c;
      if (projectData.status_c) cleanData.status_c = projectData.status_c;

      const params = {
        records: [cleanData]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} projects:`, failed);
          return null;
        }

        return successful[0]?.data || null;
      }

      return null;
    } catch (error) {
      console.error('Error creating project:', error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, projectData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        return null;
      }

      // Only include Updateable fields with values
      const cleanData = { Id: id };
      if (projectData.name_c !== undefined) cleanData.name_c = projectData.name_c;
      if (projectData.description_c !== undefined) cleanData.description_c = projectData.description_c;
      if (projectData.start_date_c !== undefined) cleanData.start_date_c = projectData.start_date_c;
      if (projectData.end_date_c !== undefined) cleanData.end_date_c = projectData.end_date_c;
      if (projectData.status_c !== undefined) cleanData.status_c = projectData.status_c;

      const params = {
        records: [cleanData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} projects:`, failed);
          return null;
        }

        return successful[0]?.data || null;
      }

      return null;
    } catch (error) {
      console.error('Error updating project:', error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        return false;
      }

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} projects:`, failed);
          return false;
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error('Error deleting project:', error?.response?.data?.message || error);
      return false;
    }
  }
}

export const projectService = new ProjectService();