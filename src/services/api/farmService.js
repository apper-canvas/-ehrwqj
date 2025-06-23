import { toast } from 'react-toastify';

const farmService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "location" } },
          { field: { Name: "size" } },
          { field: { Name: "size_unit" } },
          { field: { Name: "created_at" } }
        ]
      };

      const response = await apperClient.fetchRecords('farm', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching farms:", error);
      toast.error("Failed to fetch farms");
      return [];
    }
  },

  async getById(id) {
    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error('Invalid ID: must be a number');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "location" } },
          { field: { Name: "size" } },
          { field: { Name: "size_unit" } },
          { field: { Name: "created_at" } }
        ]
      };

      const response = await apperClient.getRecordById('farm', numericId, params);
      
      if (!response || !response.data) {
        throw new Error('Farm not found');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching farm with ID ${id}:`, error);
      throw error;
    }
  },

  async create(farmData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const filteredData = {
        Name: farmData.Name || farmData.name,
        location: farmData.location,
        size: parseInt(farmData.size),
        size_unit: farmData.size_unit || farmData.sizeUnit,
        created_at: new Date().toISOString()
      };

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('farm', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create farm');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Farm created successfully');
          return successfulRecord.data;
        }
      }

      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating farm:", error);
      throw error;
    }
  },

  async update(id, farmData) {
    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error('Invalid ID: must be a number');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const filteredData = {
        Id: numericId,
        Name: farmData.Name || farmData.name,
        location: farmData.location,
        size: parseInt(farmData.size),
        size_unit: farmData.size_unit || farmData.sizeUnit
      };

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord('farm', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update farm');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Farm updated successfully');
          return successfulRecord.data;
        }
      }

      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating farm:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error('Invalid ID: must be a number');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [numericId]
      };

      const response = await apperClient.deleteRecord('farm', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to delete farm');
        }

        toast.success('Farm deleted successfully');
        return true;
      }

      return true;
    } catch (error) {
      console.error("Error deleting farm:", error);
      throw error;
    }
  }
};

export default farmService;