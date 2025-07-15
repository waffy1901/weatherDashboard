import { motion } from "framer-motion";
import { FaCalendarAlt, FaArrowUp, FaArrowDown, FaSpinner } from "react-icons/fa";

interface ForecastDisplayProps {
  forecastData: any;
  isLoading?: boolean;
}

export default function ForecastDisplay({ forecastData, isLoading }: ForecastDisplayProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <div className="weather-card rounded-3xl p-8">
          <div className="text-center py-12 text-white/70">
            <FaSpinner className="animate-spin text-3xl mb-4 mx-auto" />
            <p className="text-lg">Loading forecast data...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!forecastData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <div className="weather-card rounded-3xl p-8">
          <div className="text-center py-12 text-white/70">
            <p className="text-lg">Enter a location to see forecast</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const dailyForecasts = forecastData.list
    .filter((_: any, index: number) => index % 8 === 0)
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto"
    >
      <div className="weather-card rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          <FaCalendarAlt className="text-yellow-300 mr-3 inline" />
          5-Day Forecast
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {dailyForecasts.map((forecast: any, index: number) => (
            <motion.div
              key={index}
              className="forecast-card rounded-2xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="text-white/80 font-medium mb-3">
                {new Date(forecast.dt * 1000).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </div>
              
              {forecast.weather[0]?.icon && (
                <motion.img
                  src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                  alt={forecast.weather[0]?.description}
                  className="w-16 h-16 mx-auto mb-3 weather-icon-large"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                />
              )}
              
              <div className="text-white font-bold text-xl mb-2">
                {Math.round(forecast.main.temp)}°F
              </div>
              
              <div className="text-white/70 text-sm capitalize mb-3">
                {forecast.weather[0]?.description}
              </div>
              
              <div className="flex justify-center space-x-2">
                <div className="text-white/60 text-xs flex items-center">
                  <FaArrowUp className="mr-1" />
                  <span>{Math.round(forecast.main.temp_max)}°</span>
                </div>
                <div className="text-white/60 text-xs flex items-center">
                  <FaArrowDown className="mr-1" />
                  <span>{Math.round(forecast.main.temp_min)}°</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}