import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfWeek, addDays } from 'date-fns';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import TaskCard from '@/components/molecules/TaskCard';
import TaskForm from '@/components/organisms/TaskForm';
import ApperIcon from '@/components/ApperIcon';
import taskService from '@/services/api/taskService';
import farmService from '@/services/api/farmService';
import cropService from '@/services/api/cropService';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed', 'overdue'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [tasksData, farmsData, cropsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ]);
      setTasks(tasksData);
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormSubmit = (taskData) => {
    if (editingTask) {
      setTasks(prev => prev.map(task => 
        task.Id === editingTask.Id ? taskData : task
      ));
    } else {
      setTasks(prev => [...prev, taskData]);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleToggleTask = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId);
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task reopened');
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm ? farm.name : 'Unknown Farm';
  };

  const getCropName = (cropId) => {
    if (!cropId) return null;
    const crop = crops.find(c => c.Id === cropId);
    return crop ? crop.cropType : 'Unknown Crop';
  };

  const getFilteredTasks = () => {
    const now = new Date();
    
    switch (filter) {
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'overdue':
        return tasks.filter(task => !task.completed && new Date(task.dueDate) < now);
      default:
        return tasks;
    }
  };

  const getWeekDays = () => {
    const start = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getTasksForDay = (date) => {
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    return getFilteredTasks().filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= dayStart && taskDate <= dayEnd;
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-surface-300 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-surface-300 rounded w-32 animate-pulse"></div>
        </div>
        <SkeletonLoader count={4} type="list" />
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

  const filteredTasks = getFilteredTasks();

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
            Task Management
          </h1>
          <p className="text-gray-600 mt-1">
            Schedule and track your farm tasks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-100 p-1 rounded-lg">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                view === 'list' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                view === 'calendar' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendar
            </button>
          </div>
          <Button
            onClick={handleCreateTask}
            variant="primary"
            icon="Plus"
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-medium text-gray-700">Filter:</span>
        <div className="flex items-center gap-2">
          {[
            { key: 'all', label: 'All Tasks' },
            { key: 'pending', label: 'Pending' },
            { key: 'completed', label: 'Completed' },
            { key: 'overdue', label: 'Overdue' }
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setFilter(option.key)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filter === option.key
                  ? 'bg-primary text-white'
                  : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
              }`}
            >
              {option.label}
            </button>
          ))}
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
                <TaskForm
                  task={editingTask}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon="CheckSquare"
          title="No tasks found"
          description="Start by creating your first task to keep track of your farm activities."
          actionLabel="Create Your First Task"
          onAction={handleCreateTask}
        />
      ) : view === 'list' ? (
        <div className="space-y-4">
          {filteredTasks
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .map((task, index) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TaskCard
                  task={task}
                  onToggleComplete={handleToggleTask}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              </motion.div>
            ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-surface-200">
            {getWeekDays().map((day, index) => (
              <div key={index} className="bg-white p-4 h-64">
                <div className="font-medium text-sm text-gray-900 mb-3">
                  {format(day, 'EEE d')}
                </div>
                <div className="space-y-2">
                  {getTasksForDay(new Date(day)).map((task) => (
                    <div
                      key={task.Id}
                      className={`p-2 rounded text-xs cursor-pointer hover:opacity-80 ${
                        task.completed
                          ? 'bg-success/10 text-success'
                          : task.type === 'Watering'
                          ? 'bg-info/10 text-info'
                          : task.type === 'Fertilizing'
                          ? 'bg-secondary/10 text-secondary'
                          : task.type === 'Harvesting'
                          ? 'bg-accent/10 text-accent'
                          : 'bg-primary/10 text-primary'
                      }`}
                      onClick={() => handleEditTask(task)}
                    >
                      <div className="font-medium truncate">{task.title}</div>
                      <div className="text-xs opacity-75">{task.type}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Tasks;