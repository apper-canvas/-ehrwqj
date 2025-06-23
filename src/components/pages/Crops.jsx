import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import CropStatusBadge from '@/components/molecules/CropStatusBadge';
import CropForm from '@/components/organisms/CropForm';
import ApperIcon from '@/components/ApperIcon';
import cropService from '@/services/api/cropService';
import farmService from '@/services/api/farmService';

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [selectedFarm, setSelectedFarm] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ]);
      setCrops(cropsData);
      setFarms(farmsData);
    } catch (err) {
      console.error('Error loading crops:', err);
      setError(err.message || 'Failed to load crops');
      toast.error('Failed to load crops');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCrop = () => {
    setEditingCrop(null);
    setShowForm(true);
  };

  const handleEditCrop = (crop) => {
    setEditingCrop(crop);
    setShowForm(true);
  };

const handleFormSubmit = async (cropData) => {
    try {
      if (editingCrop) {
        const updatedCrop = await cropService.update(editingCrop.Id, cropData);
        setCrops(prev => prev.map(crop => 
          crop.Id === editingCrop.Id ? updatedCrop : crop
        ));
        toast.success('Crop updated successfully');
      } else {
        const newCrop = await cropService.create(cropData);
        setCrops(prev => [...prev, newCrop]);
        toast.success('Crop created successfully');
      }
      setShowForm(false);
      setEditingCrop(null);
    } catch (error) {
      console.error('Error saving crop:', error);
      toast.error('Failed to save crop');
    }
  };

  const handleDeleteCrop = async (cropId) => {
    if (!confirm('Are you sure you want to delete this crop? This action cannot be undone.')) {
      return;
    }

    try {
      await cropService.delete(cropId);
      setCrops(prev => prev.filter(crop => crop.Id !== cropId));
      toast.success('Crop deleted successfully');
    } catch (error) {
      console.error('Error deleting crop:', error);
      toast.error('Failed to delete crop');
    }
  };

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm ? farm.name : 'Unknown Farm';
  };

  const getFilteredCrops = () => {
    if (selectedFarm === 'all') {
      return crops;
    }
    return crops.filter(crop => crop.farmId === parseInt(selectedFarm, 10));
  };

  const getCropIcon = (cropType) => {
    const icons = {
      'Corn': 'Wheat',
      'Soybeans': 'Sprout',
      'Wheat': 'Wheat',
      'Tomatoes': 'Apple',
      'Potatoes': 'CircleDot',
      'Carrots': 'Carrot',
      'Lettuce': 'Leaf'
    };
    return icons[cropType] || 'Sprout';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-surface-300 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-surface-300 rounded w-32 animate-pulse"></div>
        </div>
        <SkeletonLoader count={1} type="table" />
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

  const filteredCrops = getFilteredCrops();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            Crop Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track your crops and their growth stages
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedFarm}
            onChange={(e) => setSelectedFarm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Farms</option>
            {farms.map(farm => (
              <option key={farm.Id} value={farm.Id}>
                {farm.name}
              </option>
            ))}
          </select>
          <Button
            onClick={handleCreateCrop}
            variant="primary"
            icon="Plus"
          >
            Add Crop
          </Button>
        </div>
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
              <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                <CropForm
                  crop={editingCrop}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Crops Table */}
      {filteredCrops.length === 0 ? (
        <EmptyState
          icon="Sprout"
          title="No crops found"
          description={selectedFarm === 'all' 
            ? "Start by adding your first crop to track its growth and progress."
            : "No crops found for the selected farm. Try selecting a different farm or add a new crop."
          }
          actionLabel="Add Your First Crop"
          onAction={handleCreateCrop}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Crop
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Area
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Planted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expected Harvest
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {filteredCrops.map((crop, index) => (
                  <motion.tr
                    key={crop.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-surface-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name={getCropIcon(crop.cropType)} size={18} className="text-secondary" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{crop.cropType}</div>
                          {crop.notes && (
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {crop.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getFarmName(crop.farmId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CropStatusBadge status={crop.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {crop.area} acres
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
{crop.planting_date ? format(new Date(crop.planting_date), 'MMM dd, yyyy') : 'Not set'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {crop.expected_harvest_date ? format(new Date(crop.expected_harvest_date), 'MMM dd, yyyy') : 'Not set'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          onClick={() => handleEditCrop(crop)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => handleDeleteCrop(crop.Id)}
                          className="text-error hover:text-error"
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default Crops;