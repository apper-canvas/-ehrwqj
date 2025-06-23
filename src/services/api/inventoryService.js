import { toast } from 'react-toastify';

const inventoryService = {
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
          { field: { Name: "category" } },
          { field: { Name: "current_stock" } },
          { field: { Name: "max_capacity" } },
          { field: { Name: "unit" } },
          { field: { Name: "supplier" } },
          { field: { Name: "last_restocked" } },
          { field: { Name: "minimum_threshold" } }
        ]
      };

      const response = await apperClient.fetchRecords('inventory', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Failed to fetch inventory");
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
          { field: { Name: "category" } },
          { field: { Name: "current_stock" } },
          { field: { Name: "max_capacity" } },
          { field: { Name: "unit" } },
          { field: { Name: "supplier" } },
          { field: { Name: "last_restocked" } },
          { field: { Name: "minimum_threshold" } }
        ]
      };

      const response = await apperClient.getRecordById('inventory', numericId, params);
      
      if (!response || !response.data) {
        throw new Error('Inventory item not found');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching inventory item with ID ${id}:`, error);
      throw error;
    }
  },

  async create(itemData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const filteredData = {
        Name: itemData.Name || itemData.name,
        category: itemData.category,
        current_stock: parseInt(itemData.current_stock || itemData.currentStock),
        max_capacity: parseInt(itemData.max_capacity || itemData.maxCapacity),
        unit: itemData.unit,
        supplier: itemData.supplier,
        last_restocked: itemData.last_restocked || itemData.lastRestocked || new Date().toISOString(),
        minimum_threshold: parseInt(itemData.minimum_threshold || itemData.minimumThreshold)
      };

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('inventory', params);
      
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
          throw new Error('Failed to create inventory item');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Inventory item created successfully');
          return successfulRecord.data;
        }
      }

      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating inventory item:", error);
      throw error;
    }
  },

  async update(id, itemData) {
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
        Name: itemData.Name || itemData.name,
        category: itemData.category,
        current_stock: parseInt(itemData.current_stock || itemData.currentStock),
        max_capacity: parseInt(itemData.max_capacity || itemData.maxCapacity),
        unit: itemData.unit,
        supplier: itemData.supplier,
        last_restocked: itemData.last_restocked || itemData.lastRestocked,
        minimum_threshold: parseInt(itemData.minimum_threshold || itemData.minimumThreshold)
      };

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord('inventory', params);
      
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
          throw new Error('Failed to update inventory item');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Inventory item updated successfully');
          return successfulRecord.data;
        }
      }

      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating inventory item:", error);
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

      const response = await apperClient.deleteRecord('inventory', params);
      
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
          throw new Error('Failed to delete inventory item');
        }

        toast.success('Inventory item deleted successfully');
        return true;
      }

      return true;
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      throw error;
    }
  },

  async getByCategory(category) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category" } },
          { field: { Name: "current_stock" } },
          { field: { Name: "max_capacity" } },
          { field: { Name: "unit" } },
          { field: { Name: "supplier" } },
          { field: { Name: "last_restocked" } },
          { field: { Name: "minimum_threshold" } }
        ],
        where: [
          {
            FieldName: "category",
            Operator: "EqualTo",
            Values: [category]
          }
        ]
      };

      const response = await apperClient.fetchRecords('inventory', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching inventory by category:", error);
      toast.error("Failed to fetch inventory by category");
      return [];
    }
  },

  async getLowStock() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category" } },
          { field: { Name: "current_stock" } },
          { field: { Name: "max_capacity" } },
          { field: { Name: "unit" } },
          { field: { Name: "supplier" } },
          { field: { Name: "last_restocked" } },
          { field: { Name: "minimum_threshold" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "current_stock",
                    operator: "LessThanOrEqualTo",
                    values: ["minimum_threshold"] // This comparison might need adjustment based on API capabilities
                  }
                ],
                operator: "AND"
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords('inventory', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Filter on client side as backup if the server-side comparison doesn't work
      const allItems = response.data || [];
      return allItems.filter(item => item.current_stock <= item.minimum_threshold);
    } catch (error) {
      console.error("Error fetching low stock items:", error);
      toast.error("Failed to fetch low stock items");
      return [];
    }
  },

  async updateStock(id, newStock) {
    try {
      const numericId = parseInt(id, 10);
      const numericStock = parseInt(newStock);
      
      if (isNaN(numericId)) {
        throw new Error('Invalid ID: must be a number');
      }
      
      if (isNaN(numericStock) || numericStock < 0) {
        throw new Error('Invalid stock amount: must be a non-negative number');
      }

      // Get current item to check max capacity
      const currentItem = await this.getById(numericId);
      
      if (numericStock > currentItem.max_capacity) {
        throw new Error('Stock amount cannot exceed maximum capacity');
      }

      // Update with new stock and timestamp
      const updateData = {
        current_stock: numericStock,
        last_restocked: new Date().toISOString()
      };

      return await this.update(numericId, updateData);
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  }
};

export default inventoryService;