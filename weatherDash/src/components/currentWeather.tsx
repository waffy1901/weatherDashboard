import { motion } from "framer-motion";
import { FaEye, FaTint, FaWind, FaThermometerHalf } from "react-icons/fa";

interface CurrentWeatherProps {
  weatherData: any;
}

export default function CurrentWeather({ weatherData }: CurrentWeatherProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto mb-12"
    >
      <div className="weather-card rounded-3xl p-8 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Weather Info */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              {weatherData.weather[0]?.icon && (
                <motion.img
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                  alt={weatherData.weather[0]?.description}
                  className="w-24 h-24 weather-icon-large"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <div className="ml-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {weatherData.name}
                  {weatherData.sys?.country && `, ${weatherData.sys.country}`}
                </h2>
                <p className="text-white/80 text-lg capitalize">
                  {weatherData.weather[0]?.description}
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <motion.div
                className="text-6xl md:text-7xl font-bold text-white mb-2"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {Math.round(weatherData.main.temp)}°F
              </motion.div>
              <div className="text-white/70 text-xl">
                Feels like {Math.round(weatherData.main.feels_like)}°F
              </div>
            </div>
          </div>
          
          {/* Weather Stats */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              className="forecast-card rounded-2xl p-6 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <FaEye className="text-blue-300 text-2xl mb-3 mx-auto" />
              <div className="text-white/70 text-sm mb-1">Visibility</div>
              <div className="text-white font-bold text-lg">
                {weatherData.visibility ? `${(weatherData.visibility / 1000).toFixed(1)} km` : "N/A"}
              </div>
            </motion.div>
            
            <motion.div
              className="forecast-card rounded-2xl p-6 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <FaTint className="text-blue-300 text-2xl mb-3 mx-auto" />
              <div className="text-white/70 text-sm mb-1">Humidity</div>
              <div className="text-white font-bold text-lg">
                {weatherData.main.humidity}%
              </div>
            </motion.div>
            
            <motion.div
              className="forecast-card rounded-2xl p-6 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <FaWind className="text-blue-300 text-2xl mb-3 mx-auto" />
              <div className="text-white/70 text-sm mb-1">Wind Speed</div>
              <div className="text-white font-bold text-lg">
                {weatherData.wind.speed} mph
              </div>
            </motion.div>
            
            <motion.div
              className="forecast-card rounded-2xl p-6 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <FaThermometerHalf className="text-blue-300 text-2xl mb-3 mx-auto" />
              <div className="text-white/70 text-sm mb-1">Pressure</div>
              <div className="text-white font-bold text-lg">
                {weatherData.main.pressure} hPa
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}