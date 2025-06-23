import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import FarmForm from '@/components/organisms/FarmForm';
import ApperIcon from '@/components/ApperIcon';
import farmService from '@/services/api/farmService';
import cropService from '@/services/api/cropService';

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [farmsData, cropsData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll()
      ]);
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      console.error('Error loading farms:', err);
      setError(err.message || 'Failed to load farms');
      toast.error('Failed to load farms');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFarm = () => {
    setEditingFarm(null);
    setShowForm(true);
  };

  const handleEditFarm = (farm) => {
    setEditingFarm(farm);
    setShowForm(true);
  };

  const handleFormSubmit = (farmData) => {
    if (editingFarm) {
      setFarms(prev => prev.map(farm => 
        farm.Id === editingFarm.Id ? farmData : farm
      ));
    } else {
      setFarms(prev => [...prev, farmData]);
    }
    setShowForm(false);
    setEditingFarm(null);
  };

  const handleDeleteFarm = async (farmId) => {
    if (!confirm('Are you sure you want to delete this farm? This action cannot be undone.')) {
      return;
    }

    try {
      await farmService.delete(farmId);
      setFarms(prev => prev.filter(farm => farm.Id !== farmId));
      toast.success('Farm deleted successfully');
    } catch (error) {
      console.error('Error deleting farm:', error);
      toast.error('Failed to delete farm');
    }
  };

  const getFarmCropCount = (farmId) => {
    return crops.filter(crop => crop.farmId === farmId && crop.status !== 'Harvested').length;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-surface-300 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-surface-300 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader count={6} type="card" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            My Farms
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your farm locations and properties
          </p>
        </div>
        <Button
          onClick={handleCreateFarm}
          variant="primary"
          icon="Plus"
        >
          Add Farm
        </Button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md">
                <FarmForm
                  farm={editingFarm}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Farms Grid */}
      {farms.length === 0 ? (
        <EmptyState
          icon="Map"
          title="No farms added yet"
          description="Start by adding your first farm to begin tracking your agricultural operations."
          actionLabel="Add Your First Farm"
          onAction={handleCreateFarm}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm, index) => (
            <motion.div
              key={farm.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="MapPin" size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-gray-900">
                        {farm.name}
                      </h3>
                      <p className="text-sm text-gray-600">{farm.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit"
                      onClick={() => handleEditFarm(farm)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => handleDeleteFarm(farm.Id)}
                      className="text-error hover:text-error"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Size</span>
                    <span className="font-medium">
                      {farm.size} {farm.sizeUnit}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Crops</span>
                    <span className="font-medium">
                      {getFarmCropCount(farm.Id)}
                    </span>
                  </div>
                  
                  <div className="pt-3 border-t border-surface-200">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ApperIcon name="Calendar" size={12} />
                      Created {new Date(farm.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Farms;