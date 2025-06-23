import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import farmService from '@/services/api/farmService';

const FarmForm = ({ farm = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: farm?.name || '',
    location: farm?.location || '',
    size: farm?.size || '',
    sizeUnit: farm?.sizeUnit || 'acres'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const sizeUnitOptions = [
    { value: 'acres', label: 'Acres' },
    { value: 'hectares', label: 'Hectares' },
    { value: 'square_feet', label: 'Square Feet' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Farm name is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.size || formData.size <= 0) {
      newErrors.size = 'Valid farm size is required';
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
      const farmData = {
        ...formData,
        size: parseFloat(formData.size)
      };

      let result;
      if (farm) {
        result = await farmService.update(farm.Id, farmData);
        toast.success('Farm updated successfully!');
      } else {
        result = await farmService.create(farmData);
        toast.success('Farm created successfully!');
      }
      
      onSubmit(result);
    } catch (error) {
      console.error('Error saving farm:', error);
      toast.error(error.message || 'Failed to save farm');
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-surface-200"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-gray-900">
          {farm ? 'Edit Farm' : 'Add New Farm'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Farm Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Enter farm name"
        />

        <FormField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          error={errors.location}
          placeholder="Enter farm location"
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Farm Size"
            name="size"
            type="number"
            value={formData.size}
            onChange={handleChange}
            error={errors.size}
            placeholder="Enter size"
            min="0"
            step="0.1"
          />

          <FormField
            type="select"
            label="Unit"
            name="sizeUnit"
            value={formData.sizeUnit}
            onChange={handleChange}
            options={sizeUnitOptions}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="flex-1"
          >
            {farm ? 'Update Farm' : 'Create Farm'}
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

export default FarmForm;