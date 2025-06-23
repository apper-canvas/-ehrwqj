import { toast } from 'react-toastify';

const taskService = {
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
          { field: { Name: "title" } },
          { field: { Name: "type" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "completed_date" } },
          { field: { Name: "notes" } },
          { 
            field: { name: "farm_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "crop_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
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
          { field: { Name: "title" } },
          { field: { Name: "type" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "completed_date" } },
          { field: { Name: "notes" } },
          { 
            field: { name: "farm_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "crop_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await apperClient.getRecordById('task', numericId, params);
      
      if (!response || !response.data) {
        throw new Error('Task not found');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
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
          { field: { Name: "title" } },
          { field: { Name: "type" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "completed_date" } },
          { field: { Name: "notes" } },
          { 
            field: { name: "farm_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "crop_id" },
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

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by farm ID:", error);
      toast.error("Failed to fetch tasks for farm");
      return [];
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const filteredData = {
        Name: taskData.Name || taskData.name || taskData.title,
        title: taskData.title,
        type: taskData.type,
        due_date: taskData.due_date || taskData.dueDate,
        completed: false,
        completed_date: null,
        notes: taskData.notes,
        farm_id: parseInt(taskData.farm_id || taskData.farmId),
        crop_id: taskData.crop_id || taskData.cropId ? parseInt(taskData.crop_id || taskData.cropId) : null
      };

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('task', params);
      
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
          throw new Error('Failed to create task');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Task created successfully');
          return successfulRecord.data;
        }
      }

      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, taskData) {
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
        Name: taskData.Name || taskData.name || taskData.title,
        title: taskData.title,
        type: taskData.type,
        due_date: taskData.due_date || taskData.dueDate,
        completed: taskData.completed,
        completed_date: taskData.completed_date || taskData.completedDate,
        notes: taskData.notes,
        farm_id: parseInt(taskData.farm_id || taskData.farmId),
        crop_id: taskData.crop_id || taskData.cropId ? parseInt(taskData.crop_id || taskData.cropId) : null
      };

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord('task', params);
      
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
          throw new Error('Failed to update task');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Task updated successfully');
          return successfulRecord.data;
        }
      }

      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async toggleComplete(id) {
    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error('Invalid ID: must be a number');
      }

      // First get the current task data
      const currentTask = await this.getById(numericId);
      
      // Toggle completion status
      const updatedData = {
        completed: !currentTask.completed,
        completed_date: !currentTask.completed ? new Date().toISOString() : null
      };

      // Update with just the changed fields
      return await this.update(numericId, updatedData);
    } catch (error) {
      console.error("Error toggling task completion:", error);
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

      const response = await apperClient.deleteRecord('task', params);
      
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
          throw new Error('Failed to delete task');
        }

        toast.success('Task deleted successfully');
        return true;
      }

      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
};

export default taskService;