import mockData from '@/services/mockData/inventory.json';

let inventoryData = [...mockData];
let lastId = Math.max(...inventoryData.map(item => item.Id));

const inventoryService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...inventoryData];
  },

  async getById(id) {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      throw new Error('Invalid ID: must be a number');
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    const item = inventoryData.find(item => item.Id === numericId);
    
    if (!item) {
      throw new Error(`Inventory item with ID ${numericId} not found`);
    }
    
    return { ...item };
  },

  async create(itemData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newItem = {
      ...itemData,
      Id: ++lastId
    };
    
    inventoryData.push(newItem);
    return { ...newItem };
  },

  async update(id, itemData) {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      throw new Error('Invalid ID: must be a number');
    }
    
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = inventoryData.findIndex(item => item.Id === numericId);
    if (index === -1) {
      throw new Error(`Inventory item with ID ${numericId} not found`);
    }
    
    const updatedItem = {
      ...inventoryData[index],
      ...itemData,
      Id: numericId // Prevent ID modification
    };
    
    inventoryData[index] = updatedItem;
    return { ...updatedItem };
  },

  async delete(id) {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      throw new Error('Invalid ID: must be a number');
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = inventoryData.findIndex(item => item.Id === numericId);
    if (index === -1) {
      throw new Error(`Inventory item with ID ${numericId} not found`);
    }
    
    const deletedItem = inventoryData[index];
    inventoryData.splice(index, 1);
    return { ...deletedItem };
  },

  async getByCategory(category) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return inventoryData
      .filter(item => item.category === category)
      .map(item => ({ ...item }));
  },

  async getLowStock() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return inventoryData
      .filter(item => item.currentStock <= item.minimumThreshold)
      .map(item => ({ ...item }));
  },

  async updateStock(id, newStock) {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      throw new Error('Invalid ID: must be a number');
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = inventoryData.findIndex(item => item.Id === numericId);
    if (index === -1) {
      throw new Error(`Inventory item with ID ${numericId} not found`);
    }
    
    if (newStock < 0 || newStock > inventoryData[index].maxCapacity) {
      throw new Error('Stock amount must be between 0 and maximum capacity');
    }
    
    inventoryData[index] = {
      ...inventoryData[index],
      currentStock: newStock,
      lastRestocked: new Date().toISOString()
    };
    
    return { ...inventoryData[index] };
  }
};

export default inventoryService;