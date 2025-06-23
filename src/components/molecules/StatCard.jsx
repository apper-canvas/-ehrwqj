import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  trend,
  className = '',
  ...props 
}) => {
  const colors = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    accent: 'text-accent bg-accent/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    error: 'text-error bg-error/10'
  };

  return (
    <Card className={`${className}`} {...props}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend.direction === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className={trend.direction === 'up' ? 'text-success' : 'text-error'}
              />
              <span className={`text-sm ml-1 ${trend.direction === 'up' ? 'text-success' : 'text-error'}`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
            <ApperIcon name={icon} size={20} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;