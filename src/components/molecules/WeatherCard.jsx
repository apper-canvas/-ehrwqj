import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const WeatherCard = ({ weather, isToday = false, className = '' }) => {
  const getWeatherIcon = (condition) => {
    const icons = {
      'sunny': 'Sun',
      'cloudy': 'Cloud',
      'rainy': 'CloudRain',
      'stormy': 'CloudLightning',
      'partly-cloudy': 'CloudSun'
    };
    return icons[condition] || 'Sun';
  };

  const getWeatherGradient = (condition) => {
    const gradients = {
      'sunny': 'from-yellow-400 to-orange-400',
      'cloudy': 'from-gray-400 to-gray-500',
      'rainy': 'from-blue-400 to-blue-600',
      'stormy': 'from-purple-500 to-gray-700',
      'partly-cloudy': 'from-yellow-300 to-blue-400'
    };
    return gradients[condition] || 'from-yellow-400 to-orange-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={className}
    >
      <Card className={`text-center ${isToday ? 'ring-2 ring-accent' : ''}`}>
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-600">
            {isToday ? 'Today' : format(new Date(weather.date), 'EEE, MMM d')}
          </div>
          
          <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${getWeatherGradient(weather.condition)} flex items-center justify-center`}>
            <ApperIcon name={getWeatherIcon(weather.condition)} size={28} className="text-white" />
          </div>
          
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {weather.temperature}°F
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {weather.condition.replace('-', ' ')}
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <ApperIcon name="Droplets" size={12} />
              {weather.precipitation}%
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Wind" size={12} />
              {weather.windSpeed} mph
            </div>
          </div>
          
          {weather.farmingAlert && (
            <div className="bg-warning/10 text-warning text-xs p-2 rounded-lg">
              {weather.farmingAlert}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default WeatherCard;