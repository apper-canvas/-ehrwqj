import { toast } from 'react-toastify';

const transactionService = {
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
          { field: { Name: "type" } },
          { field: { Name: "category" } },
          { field: { Name: "amount" } },
          { field: { Name: "date" } },
          { field: { Name: "description" } },
          { 
            field: { name: "farm_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await apperClient.fetchRecords('transaction', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions");
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
          { field: { Name: "type" } },
          { field: { Name: "category" } },
          { field: { Name: "amount" } },
          { field: { Name: "date" } },
          { field: { Name: "description" } },
          { 
            field: { name: "farm_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await apperClient.getRecordById('transaction', numericId, params);
      
      if (!response || !response.data) {
        throw new Error('Transaction not found');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction with ID ${id}:`, error);
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
          { field: { Name: "type" } },
          { field: { Name: "category" } },
          { field: { Name: "amount" } },
          { field: { Name: "date" } },
          { field: { Name: "description" } },
          { 
            field: { name: "farm_id" },
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

      const response = await apperClient.fetchRecords('transaction', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching transactions by farm ID:", error);
      toast.error("Failed to fetch transactions for farm");
      return [];
    }
  },

  async create(transactionData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const filteredData = {
        Name: transactionData.Name || transactionData.name || `${transactionData.type} - ${transactionData.category}`,
        type: transactionData.type,
        category: transactionData.category,
        amount: parseFloat(transactionData.amount),
        date: transactionData.date,
        description: transactionData.description,
        farm_id: parseInt(transactionData.farm_id || transactionData.farmId)
      };

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('transaction', params);
      
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
          throw new Error('Failed to create transaction');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Transaction created successfully');
          return successfulRecord.data;
        }
      }

      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  },

  async update(id, transactionData) {
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
        Name: transactionData.Name || transactionData.name || `${transactionData.type} - ${transactionData.category}`,
        type: transactionData.type,
        category: transactionData.category,
        amount: parseFloat(transactionData.amount),
        date: transactionData.date,
        description: transactionData.description,
        farm_id: parseInt(transactionData.farm_id || transactionData.farmId)
      };

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord('transaction', params);
      
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
          throw new Error('Failed to update transaction');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Transaction updated successfully');
          return successfulRecord.data;
        }
      }

      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating transaction:", error);
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

      const response = await apperClient.deleteRecord('transaction', params);
      
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
          throw new Error('Failed to delete transaction');
        }

        toast.success('Transaction deleted successfully');
        return true;
      }

      return true;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  }
};

export default transactionService;