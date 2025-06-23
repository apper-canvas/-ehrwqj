import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';
import WeatherCard from '@/components/molecules/WeatherCard';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock weather data - in a real app, this would come from a weather API
  const generateWeatherData = () => {
    const conditions = ['sunny', 'partly-cloudy', 'cloudy', 'rainy', 'stormy'];
    const baseTemp = 72;
    
    return Array.from({ length: 5 }, (_, index) => ({
      date: addDays(new Date(), index).toISOString(),
      temperature: baseTemp + Math.floor(Math.random() * 20) - 10,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      precipitation: Math.floor(Math.random() * 100),
      windSpeed: Math.floor(Math.random() * 20) + 5,
      humidity: Math.floor(Math.random() * 40) + 40,
      farmingAlert: index === 0 && Math.random() > 0.5 
        ? 'Perfect conditions for planting'
        : index === 2 && Math.random() > 0.7
        ? 'High winds expected - secure equipment'
        : null
    }));
  };

  useEffect(() => {
    // Simulate API call
    const loadWeatherData = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = generateWeatherData();
      setWeatherData(data);
      setLoading(false);
    };

    loadWeatherData();
  }, []);

  const todayWeather = weatherData[0];
  const avgTemperature = weatherData.length 
    ? Math.round(weatherData.reduce((sum, day) => sum + day.temperature, 0) / weatherData.length)
    : 0;
  const rainyDays = weatherData.filter(day => day.precipitation > 50).length;
  
  const farmingAlerts = weatherData
    .filter(day => day.farmingAlert)
    .map(day => ({
      date: day.date,
      alert: day.farmingAlert,
      condition: day.condition
    }));

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-surface-300 rounded w-48 animate-pulse mb-2"></div>
          <div className="h-4 bg-surface-300 rounded w-64 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface-100 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-surface-300 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-surface-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-surface-100 rounded-xl p-6 animate-pulse">
              <div className="h-16 w-16 bg-surface-300 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-surface-300 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-6 bg-surface-300 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-900">
          Weather Forecast
        </h1>
        <p className="text-gray-600 mt-1">
          5-day weather outlook for your farming operations
        </p>
      </div>

      {/* Weather Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Thermometer" size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Temperature</p>
                <p className="text-2xl font-bold text-gray-900">{avgTemperature}°F</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="CloudRain" size={20} className="text-info" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Rainy Days</p>
                <p className="text-2xl font-bold text-gray-900">{rainyDays}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertTriangle" size={20} className="text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Weather Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{farmingAlerts.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Weather Alerts */}
      {farmingAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <ApperIcon name="AlertTriangle" size={20} className="text-warning" />
              <h2 className="text-lg font-heading font-semibold text-gray-900">
                Farming Alerts
              </h2>
            </div>
            <div className="space-y-3">
              {farmingAlerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-warning/5 rounded-lg">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{alert.alert}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(alert.date), 'EEEE, MMM dd')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* 5-Day Forecast */}
      <div className="mb-8">
        <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4">
          5-Day Forecast
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {weatherData.map((weather, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <WeatherCard
                weather={weather}
                isToday={index === 0}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weather Details */}
      {todayWeather && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4">
              Today's Details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ApperIcon name="Droplets" size={20} className="text-info" />
                </div>
                <p className="text-sm text-gray-600">Humidity</p>
                <p className="font-semibold text-gray-900">{todayWeather.humidity}%</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ApperIcon name="Wind" size={20} className="text-primary" />
                </div>
                <p className="text-sm text-gray-600">Wind Speed</p>
                <p className="font-semibold text-gray-900">{todayWeather.windSpeed} mph</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ApperIcon name="CloudRain" size={20} className="text-secondary" />
                </div>
                <p className="text-sm text-gray-600">Rain Chance</p>
                <p className="font-semibold text-gray-900">{todayWeather.precipitation}%</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ApperIcon name="Sun" size={20} className="text-accent" />
                </div>
                <p className="text-sm text-gray-600">Condition</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {todayWeather.condition.replace('-', ' ')}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Weather;