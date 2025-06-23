import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: 1 }}
          className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="Sprout" size={32} className="text-primary" />
        </motion.div>
        
        <h1 className="text-6xl font-heading font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-heading font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Looks like this page got lost in the fields! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            icon="Home"
            className="w-full sm:w-auto"
          >
            Back to Dashboard
          </Button>
          <div className="text-sm text-gray-500">
            or try navigating using the sidebar menu
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;