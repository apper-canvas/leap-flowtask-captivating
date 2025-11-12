import { getApperClient } from '@/services/apperClient';

const tableName = 'projects_c';

export const projectService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{
          "fieldName": "ModifiedOn",
          "sorttype": "DESC"
        }]
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response.success) {
        console.error('Failed to fetch projects:', response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, id, params);

      if (!response.success) {
        console.error(`Failed to fetch project ${id}:`, response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  },

  async create(projectData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include updateable fields
      const record = {};
      if (projectData.name_c) record.name_c = projectData.name_c;
      if (projectData.description_c) record.description_c = projectData.description_c;
      if (projectData.start_date_c) record.start_date_c = projectData.start_date_c;
      if (projectData.end_date_c) record.end_date_c = projectData.end_date_c;
      if (projectData.status_c) record.status_c = projectData.status_c;
      if (projectData.Tags) record.Tags = projectData.Tags;

      const params = {
        records: [record]
      };

      const response = await apperClient.createRecord(tableName, params);

      if (!response.success) {
        console.error('Failed to create project:', response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          const errorMessage = result.message || 'Failed to create project';
          console.error('Project creation failed:', errorMessage);
          throw new Error(errorMessage);
        }
      }

      throw new Error('No results returned from create operation');
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  async update(id, projectData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include updateable fields
      const record = { Id: parseInt(id) };
      if (projectData.name_c !== undefined) record.name_c = projectData.name_c;
      if (projectData.description_c !== undefined) record.description_c = projectData.description_c;
      if (projectData.start_date_c !== undefined) record.start_date_c = projectData.start_date_c;
      if (projectData.end_date_c !== undefined) record.end_date_c = projectData.end_date_c;
      if (projectData.status_c !== undefined) record.status_c = projectData.status_c;
      if (projectData.Tags !== undefined) record.Tags = projectData.Tags;

      const params = {
        records: [record]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error('Failed to update project:', response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          const errorMessage = result.message || 'Failed to update project';
          console.error('Project update failed:', errorMessage);
          throw new Error(errorMessage);
        }
      }

      throw new Error('No results returned from update operation');
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(tableName, params);

      if (!response.success) {
        console.error('Failed to delete project:', response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return true;
        } else {
          const errorMessage = result.message || 'Failed to delete project';
          console.error('Project deletion failed:', errorMessage);
          throw new Error(errorMessage);
        }
      }

      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
};