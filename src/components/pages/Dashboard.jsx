import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, isAfter } from 'date-fns';
import { toast } from 'react-toastify';
import StatCard from '@/components/molecules/StatCard';
import TaskCard from '@/components/molecules/TaskCard';
import WeatherCard from '@/components/molecules/WeatherCard';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import farmService from '@/services/api/farmService';
import cropService from '@/services/api/cropService';
import taskService from '@/services/api/taskService';
import transactionService from '@/services/api/transactionService';

const Dashboard = () => {
  const [data, setData] = useState({
    farms: [],
    crops: [],
    tasks: [],
    transactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock weather data for demonstration
  const weatherForecast = [
    {
      date: new Date().toISOString(),
      temperature: 75,
      condition: 'sunny',
      precipitation: 10,
      windSpeed: 8,
      farmingAlert: null
    },
    {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      temperature: 72,
      condition: 'partly-cloudy',
      precipitation: 25,
      windSpeed: 12,
      farmingAlert: null
    },
    {
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      temperature: 68,
      condition: 'rainy',
      precipitation: 80,
      windSpeed: 15,
      farmingAlert: 'Good day for watering crops'
    }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [farms, crops, tasks, transactions] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getAll(),
        transactionService.getAll()
      ]);

      setData({ farms, crops, tasks, transactions });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId);
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.map(task => 
          task.Id === taskId ? updatedTask : task
        )
      }));
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task reopened');
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    }
  };

  // Calculate stats
  const stats = {
    totalFarms: data.farms.length,
    activeCrops: data.crops.filter(crop => crop.status !== 'Harvested').length,
    pendingTasks: data.tasks.filter(task => !task.completed).length,
    monthlyProfit: data.transactions.reduce((sum, transaction) => {
      const transactionDate = new Date(transaction.date);
      const currentMonth = new Date().getMonth();
      const transactionMonth = transactionDate.getMonth();
      
      if (transactionMonth === currentMonth) {
        return sum + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
      }
      return sum;
    }, 0)
  };

  const upcomingTasks = data.tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const overdueTasks = data.tasks.filter(task => 
    !task.completed && isAfter(new Date(), new Date(task.dueDate))
  ).length;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonLoader count={4} type="card" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader count={2} type="card" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadDashboardData}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            Farm Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening on your farms today.
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            {format(new Date(), 'EEEE')}
          </div>
          <div className="text-sm text-gray-600">
            {format(new Date(), 'MMM dd, yyyy')}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Farms"
            value={stats.totalFarms}
            icon="Map"
            color="primary"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Active Crops"
            value={stats.activeCrops}
            icon="Sprout"
            color="secondary"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            icon="CheckSquare"
            color={overdueTasks > 0 ? "error" : "accent"}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Monthly Profit"
            value={`$${stats.monthlyProfit.toLocaleString()}`}
            icon="DollarSign"
            color={stats.monthlyProfit >= 0 ? "success" : "error"}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-gray-900">
              Upcoming Tasks
            </h2>
            {overdueTasks > 0 && (
              <div className="flex items-center gap-1 text-error text-sm">
                <ApperIcon name="AlertCircle" size={16} />
                {overdueTasks} overdue
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <EmptyState
                icon="CheckSquare"
                title="No pending tasks"
                description="All caught up! Your tasks are complete."
                className="py-8"
              />
            ) : (
              upcomingTasks.map((task, index) => (
                <motion.div
                  key={task.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <TaskCard
                    task={task}
                    onToggleComplete={handleToggleTask}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Weather Forecast */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-gray-900">
              Weather Forecast
            </h2>
            <ApperIcon name="Cloud" size={20} className="text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {weatherForecast.map((weather, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <WeatherCard
                  weather={weather}
                  isToday={index === 0}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;