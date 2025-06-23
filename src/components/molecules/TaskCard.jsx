import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete, className = '' }) => {
  const getTaskTypeColor = (type) => {
    const colors = {
      'Watering': 'info',
      'Fertilizing': 'secondary',
      'Harvesting': 'accent',
      'Inspection': 'warning',
      'Cultivation': 'primary'
    };
    return colors[type] || 'default';
  };

const isOverdue = task.dueDate && !isNaN(new Date(task.dueDate)) && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className={`${task.completed ? 'opacity-75' : ''} ${isOverdue ? 'border-error' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={() => onToggleComplete(task.Id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${
                task.completed
                  ? 'bg-success border-success text-white'
                  : 'border-gray-300 hover:border-success'
              }`}
            >
              {task.completed && <ApperIcon name="Check" size={12} />}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </h3>
                <Badge variant={getTaskTypeColor(task.type)} size="sm">
                  {task.type}
                </Badge>
                {isOverdue && (
                  <Badge variant="error" size="sm">
                    Overdue
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
<div className="flex items-center gap-1">
                  <ApperIcon name="Calendar" size={14} />
                  {task.dueDate && !isNaN(new Date(task.dueDate)) 
                    ? format(new Date(task.dueDate), 'MMM dd, yyyy')
                    : 'No due date'
                  }
                </div>
                {task.completedDate && !isNaN(new Date(task.completedDate)) && (
                  <div className="flex items-center gap-1 text-success">
                    <ApperIcon name="CheckCircle" size={14} />
                    Completed {format(new Date(task.completedDate), 'MMM dd')}
                  </div>
                )}
              </div>
              {task.notes && (
                <p className="text-sm text-gray-600 line-clamp-2">{task.notes}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 ml-4">
            <Button
              variant="ghost"
              size="sm"
              icon="Edit"
              onClick={() => onEdit(task)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <Button
              variant="ghost"
              size="sm"
              icon="Trash2"
              onClick={() => onDelete(task.Id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:text-error"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TaskCard;