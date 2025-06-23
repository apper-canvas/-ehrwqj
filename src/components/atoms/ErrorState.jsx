import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from './Button';

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="w-16 h-16 mx-auto mb-4 bg-error/10 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertCircle" size={24} className="text-error" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;