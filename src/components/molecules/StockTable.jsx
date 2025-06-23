import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';

const StockTable = ({ 
  inventory = [], 
  loading = false, 
  error = null, 
  onRetry = () => {} 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Seeds', 'Fertilizers', 'Equipment'];
  
  const filteredInventory = selectedCategory === 'All' 
    ? inventory 
    : inventory.filter(item => item.category === selectedCategory);

  const getStockLevel = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage === 0) return 'critical';
    if (percentage <= 25) return 'low';
    if (percentage <= 60) return 'medium';
    return 'good';
  };

  const getStockColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'low': return 'bg-yellow-500';
      case 'medium': return 'bg-orange-500';
      case 'good': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStockTextColor = (level) => {
    switch (level) {
      case 'critical': return 'text-red-700';
      case 'low': return 'text-yellow-700';
      case 'medium': return 'text-orange-700';
      case 'good': return 'text-green-700';
      default: return 'text-gray-700';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Seeds': return 'Sprout';
      case 'Fertilizers': return 'Droplets';
      case 'Equipment': return 'Wrench';
      default: return 'Package';
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="space-y-4">
          <SkeletonLoader count={1} type="text" />
          <SkeletonLoader count={5} type="table" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <ErrorState 
          message={error}
          onRetry={onRetry}
        />
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ApperIcon name="Package" size={20} className="text-primary" />
            <h2 className="text-lg font-heading font-semibold text-gray-900">
              Stock Levels
            </h2>
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filteredInventory.length === 0 ? (
          <EmptyState
            icon="Package"
            title="No inventory items"
            description={selectedCategory === 'All' 
              ? "No inventory items found" 
              : `No ${selectedCategory.toLowerCase()} found`}
            className="py-8"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Item</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Category</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Stock Level</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Quantity</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInventory.map((item, index) => {
                  const stockLevel = getStockLevel(item.currentStock, item.maxCapacity);
                  const percentage = Math.round((item.currentStock / item.maxCapacity) * 100);
                  
                  return (
                    <motion.tr
                      key={item.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <ApperIcon 
                              name={getCategoryIcon(item.category)} 
                              size={16} 
                              className="text-primary" 
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.supplier}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-3 px-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          <ApperIcon name={getCategoryIcon(item.category)} size={12} />
                          {item.category}
                        </span>
                      </td>
                      
                      <td className="py-3 px-2">
                        <div className="w-32">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>{percentage}%</span>
                            <span className={getStockTextColor(stockLevel)}>
                              {stockLevel.charAt(0).toUpperCase() + stockLevel.slice(1)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getStockColor(stockLevel)}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-3 px-2">
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">
                            {item.currentStock}
                          </span>
                          <span className="text-gray-500">
                            /{item.maxCapacity} {item.unit}
                          </span>
                        </div>
                      </td>
                      
                      <td className="py-3 px-2">
                        {item.currentStock <= item.minimumThreshold && (
                          <div className="flex items-center gap-1 text-amber-600">
                            <ApperIcon name="AlertTriangle" size={14} />
                            <span className="text-xs font-medium">Reorder needed</span>
                          </div>
                        )}
                        {item.currentStock === 0 && (
                          <div className="flex items-center gap-1 text-red-600">
                            <ApperIcon name="AlertCircle" size={14} />
                            <span className="text-xs font-medium">Out of stock</span>
                          </div>
                        )}
                        {item.currentStock > item.minimumThreshold && (
                          <div className="flex items-center gap-1 text-green-600">
                            <ApperIcon name="CheckCircle" size={14} />
                            <span className="text-xs font-medium">In stock</span>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StockTable;