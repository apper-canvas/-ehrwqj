import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import transactionService from '@/services/api/transactionService';
import farmService from '@/services/api/farmService';

const TransactionForm = ({ transaction = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    farmId: transaction?.farmId || '',
    type: transaction?.type || 'expense',
    category: transaction?.category || '',
    amount: transaction?.amount || '',
    date: transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: transaction?.description || ''
  });
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFarms, setLoadingFarms] = useState(true);
  const [errors, setErrors] = useState({});

  const expenseCategories = [
    { value: 'Seeds', label: 'Seeds' },
    { value: 'Equipment', label: 'Equipment' },
    { value: 'Fertilizer', label: 'Fertilizer' },
    { value: 'Labor', label: 'Labor' },
    { value: 'Fuel', label: 'Fuel' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Insurance', label: 'Insurance' },
    { value: 'Other', label: 'Other' }
  ];

  const incomeCategories = [
    { value: 'Grain Sales', label: 'Grain Sales' },
    { value: 'Vegetable Sales', label: 'Vegetable Sales' },
    { value: 'Livestock Sales', label: 'Livestock Sales' },
    { value: 'Government Subsidies', label: 'Government Subsidies' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    const loadFarms = async () => {
      try {
        const farmsData = await farmService.getAll();
        setFarms(farmsData.map(farm => ({
          value: farm.Id,
          label: farm.name
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

  const getCategoriesForType = () => {
    return formData.type === 'expense' ? expenseCategories : incomeCategories;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.farmId) {
      newErrors.farmId = 'Please select a farm';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
      const transactionData = {
        ...formData,
        farmId: parseInt(formData.farmId, 10),
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString()
      };

      let result;
      if (transaction) {
        result = await transactionService.update(transaction.Id, transactionData);
        toast.success('Transaction updated successfully!');
      } else {
        result = await transactionService.create(transactionData);
        toast.success('Transaction recorded successfully!');
      }
      
      onSubmit(result);
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error(error.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear category when type changes
    if (name === 'type') {
      setFormData(prev => ({ ...prev, category: '' }));
    }
    
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
          {transaction ? 'Edit Transaction' : 'Record Transaction'}
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            type="select"
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={[
              { value: 'expense', label: 'Expense' },
              { value: 'income', label: 'Income' }
            ]}
          />

          <FormField
            type="select"
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={errors.category}
            options={[
              { value: '', label: 'Select category' },
              ...getCategoriesForType()
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Amount ($)"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            error={errors.amount}
            placeholder="0.00"
            min="0"
            step="0.01"
          />

          <FormField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
          />
        </div>

        <FormField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          placeholder="Enter transaction description"
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="flex-1"
          >
            {transaction ? 'Update Transaction' : 'Record Transaction'}
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

export default TransactionForm;