import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import cropService from '@/services/api/cropService';
import farmService from '@/services/api/farmService';

const CropForm = ({ crop = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    farmId: crop?.farmId || '',
    cropType: crop?.cropType || '',
    plantingDate: crop?.plantingDate ? new Date(crop.plantingDate).toISOString().split('T')[0] : '',
    expectedHarvestDate: crop?.expectedHarvestDate ? new Date(crop.expectedHarvestDate).toISOString().split('T')[0] : '',
    status: crop?.status || 'Seeding',
    area: crop?.area || '',
    notes: crop?.notes || ''
  });
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFarms, setLoadingFarms] = useState(true);
  const [errors, setErrors] = useState({});

  const cropTypeOptions = [
    { value: 'Corn', label: 'Corn' },
    { value: 'Soybeans', label: 'Soybeans' },
    { value: 'Wheat', label: 'Wheat' },
    { value: 'Tomatoes', label: 'Tomatoes' },
    { value: 'Potatoes', label: 'Potatoes' },
    { value: 'Carrots', label: 'Carrots' },
    { value: 'Lettuce', label: 'Lettuce' },
    { value: 'Other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'Seeding', label: 'Seeding' },
    { value: 'Growing', label: 'Growing' },
    { value: 'Flowering', label: 'Flowering' },
    { value: 'Tuber Formation', label: 'Tuber Formation' },
    { value: 'Ready to Harvest', label: 'Ready to Harvest' },
    { value: 'Harvested', label: 'Harvested' }
  ];

  useEffect(() => {
    const loadFarms = async () => {
      try {
const farmsData = await farmService.getAll();
        setFarms(farmsData.map(farm => ({
          value: farm.Id,
          label: farm.Name
        })));
      } catch (error) {
        console.error('Error loading farms:', error);
        toast.error('Failed to load farms');
      } finally {
        setLoadingFarms(false);
      }
    };

    loadFarms();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.farmId) {
      newErrors.farmId = 'Please select a farm';
    }
    
    if (!formData.cropType.trim()) {
      newErrors.cropType = 'Crop type is required';
    }
    
    if (!formData.plantingDate) {
      newErrors.plantingDate = 'Planting date is required';
    }
    
    if (!formData.expectedHarvestDate) {
      newErrors.expectedHarvestDate = 'Expected harvest date is required';
    }
    
    if (!formData.area || formData.area <= 0) {
      newErrors.area = 'Valid area is required';
    }

    if (formData.plantingDate && formData.expectedHarvestDate) {
      if (new Date(formData.plantingDate) >= new Date(formData.expectedHarvestDate)) {
        newErrors.expectedHarvestDate = 'Harvest date must be after planting date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const cropData = {
        ...formData,
        farmId: parseInt(formData.farmId, 10),
        area: parseFloat(formData.area),
        plantingDate: new Date(formData.plantingDate).toISOString(),
        expectedHarvestDate: new Date(formData.expectedHarvestDate).toISOString()
      };

      let result;
      if (crop) {
        result = await cropService.update(crop.Id, cropData);
        toast.success('Crop updated successfully!');
      } else {
        result = await cropService.create(cropData);
        toast.success('Crop added successfully!');
      }
      
      onSubmit(result);
    } catch (error) {
      console.error('Error saving crop:', error);
      toast.error(error.message || 'Failed to save crop');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (loadingFarms) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-surface-200">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-surface-300 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-10 bg-surface-300 rounded"></div>
            <div className="h-10 bg-surface-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-surface-200"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-gray-900">
          {crop ? 'Edit Crop' : 'Add New Crop'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          type="select"
          label="Farm"
          name="farmId"
          value={formData.farmId}
          onChange={handleChange}
          error={errors.farmId}
          options={[{ value: '', label: 'Select a farm' }, ...farms]}
        />

        <FormField
          type="select"
          label="Crop Type"
          name="cropType"
          value={formData.cropType}
          onChange={handleChange}
          error={errors.cropType}
          options={[{ value: '', label: 'Select crop type' }, ...cropTypeOptions]}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Planting Date"
            name="plantingDate"
            type="date"
            value={formData.plantingDate}
            onChange={handleChange}
            error={errors.plantingDate}
          />

          <FormField
            label="Expected Harvest Date"
            name="expectedHarvestDate"
            type="date"
            value={formData.expectedHarvestDate}
            onChange={handleChange}
            error={errors.expectedHarvestDate}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            type="select"
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
          />

          <FormField
            label="Area (acres)"
            name="area"
            type="number"
            value={formData.area}
            onChange={handleChange}
            error={errors.area}
            placeholder="Enter area"
            min="0"
            step="0.1"
          />
        </div>

        <FormField
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Enter any additional notes"
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="flex-1"
          >
            {crop ? 'Update Crop' : 'Add Crop'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default CropForm;