import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import taskService from '@/services/api/taskService';
import farmService from '@/services/api/farmService';
import cropService from '@/services/api/cropService';

const TaskForm = ({ task = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    farmId: task?.farmId || '',
    cropId: task?.cropId || '',
    title: task?.title || '',
    type: task?.type || '',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    notes: task?.notes || ''
  });
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});

  const taskTypeOptions = [
    { value: 'Watering', label: 'Watering' },
    { value: 'Fertilizing', label: 'Fertilizing' },
    { value: 'Harvesting', label: 'Harvesting' },
    { value: 'Inspection', label: 'Inspection' },
    { value: 'Cultivation', label: 'Cultivation' },
    { value: 'Planting', label: 'Planting' },
    { value: 'Pest Control', label: 'Pest Control' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [farmsData, cropsData] = await Promise.all([
          farmService.getAll(),
          cropService.getAll()
        ]);
        
        setFarms(farmsData.map(farm => ({
          value: farm.Id,
          label: farm.name
        })));
        
        setCrops(cropsData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load farms and crops');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const getFilteredCrops = () => {
    if (!formData.farmId) return [];
    return crops
      .filter(crop => crop.farmId === parseInt(formData.farmId, 10))
      .map(crop => ({
        value: crop.Id,
        label: `${crop.cropType} (${crop.status})`
      }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.farmId) {
      newErrors.farmId = 'Please select a farm';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Please select a task type';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
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
      const taskData = {
        ...formData,
        farmId: parseInt(formData.farmId, 10),
        cropId: formData.cropId ? parseInt(formData.cropId, 10) : null,
        dueDate: new Date(formData.dueDate).toISOString()
      };

      let result;
      if (task) {
        result = await taskService.update(task.Id, taskData);
        toast.success('Task updated successfully!');
      } else {
        result = await taskService.create(taskData);
        toast.success('Task created successfully!');
      }
      
      onSubmit(result);
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error(error.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear cropId when farm changes
    if (name === 'farmId') {
      setFormData(prev => ({ ...prev, cropId: '' }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (loadingData) {
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
          {task ? 'Edit Task' : 'Create New Task'}
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
          label="Crop (Optional)"
          name="cropId"
          value={formData.cropId}
          onChange={handleChange}
          options={[
            { value: '', label: 'Select a crop (optional)' },
            ...getFilteredCrops()
          ]}
          disabled={!formData.farmId}
        />

        <FormField
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="Enter task title"
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            type="select"
            label="Task Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            error={errors.type}
            options={[{ value: '', label: 'Select task type' }, ...taskTypeOptions]}
          />

          <FormField
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            error={errors.dueDate}
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
            {task ? 'Update Task' : 'Create Task'}
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

export default TaskForm;