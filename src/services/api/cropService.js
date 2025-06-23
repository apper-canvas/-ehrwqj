import { toast } from 'react-toastify';

const cropService = {
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
          { field: { Name: "crop_type" } },
          { field: { Name: "planting_date" } },
          { field: { Name: "expected_harvest_date" } },
          { field: { Name: "status" } },
          { field: { Name: "area" } },
          { field: { Name: "notes" } },
{ 
            field: { Name: "farm_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await apperClient.fetchRecords('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching crops:", error);
      toast.error("Failed to fetch crops");
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
          { field: { Name: "crop_type" } },
          { field: { Name: "planting_date" } },
          { field: { Name: "expected_harvest_date" } },
          { field: { Name: "status" } },
          { field: { Name: "area" } },
          { field: { Name: "notes" } },
          { 
field: { Name: "farm_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await apperClient.getRecordById('crop', numericId, params);
      
      if (!response || !response.data) {
        throw new Error('Crop not found');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching crop with ID ${id}:`, error);
      throw error;
    }
  },

  async getByFarmId(farmId) {
    try {
      const numericFarmId = parseInt(farmId, 10);
      if (isNaN(numericFarmId)) {
        throw new Error('Invalid farm ID: must be a number');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "crop_type" } },
          { field: { Name: "planting_date" } },
          { field: { Name: "expected_harvest_date" } },
          { field: { Name: "status" } },
          { field: { Name: "area" } },
          { field: { Name: "notes" } },
          { 
field: { Name: "farm_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          {
            FieldName: "farm_id",
            Operator: "EqualTo",
            Values: [numericFarmId.toString()]
          }
        ]
      };

      const response = await apperClient.fetchRecords('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching crops by farm ID:", error);
      toast.error("Failed to fetch crops for farm");
      return [];
    }
  },

  async create(cropData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const filteredData = {
        Name: cropData.Name || cropData.name,
        crop_type: cropData.crop_type || cropData.cropType,
        planting_date: cropData.planting_date || cropData.plantingDate,
        expected_harvest_date: cropData.expected_harvest_date || cropData.expectedHarvestDate,
        status: cropData.status,
        area: parseInt(cropData.area),
        notes: cropData.notes,
        farm_id: parseInt(cropData.farm_id || cropData.farmId)
      };

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('crop', params);
      
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
          throw new Error('Failed to create crop');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Crop created successfully');
          return successfulRecord.data;
        }
      }

      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating crop:", error);
      throw error;
    }
  },

  async update(id, cropData) {
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
        Name: cropData.Name || cropData.name,
        crop_type: cropData.crop_type || cropData.cropType,
        planting_date: cropData.planting_date || cropData.plantingDate,
        expected_harvest_date: cropData.expected_harvest_date || cropData.expectedHarvestDate,
        status: cropData.status,
        area: parseInt(cropData.area),
        notes: cropData.notes,
        farm_id: parseInt(cropData.farm_id || cropData.farmId)
      };

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord('crop', params);
      
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
          throw new Error('Failed to update crop');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Crop updated successfully');
          return successfulRecord.data;
        }
      }

      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating crop:", error);
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

      const response = await apperClient.deleteRecord('crop', params);
      
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
          throw new Error('Failed to delete crop');
        }

        toast.success('Crop deleted successfully');
        return true;
      }

      return true;
    } catch (error) {
      console.error("Error deleting crop:", error);
      throw error;
    }
  }
};

export default cropService;