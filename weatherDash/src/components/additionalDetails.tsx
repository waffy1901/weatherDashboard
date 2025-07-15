import { motion } from "framer-motion";
import { FaSun, FaLeaf, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

interface AdditionalDetailsProps {
  weatherData: any;
}

export default function AdditionalDetails({ weatherData }: AdditionalDetailsProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto mt-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sunrise/Sunset */}
        <motion.div
          className="weather-card rounded-2xl p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-white font-semibold text-lg mb-4">
            <FaSun className="text-yellow-300 mr-2 inline" />
            Sun & Moon
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Sunrise</span>
              <span className="text-white font-medium">
                {weatherData.sys?.sunrise ? formatTime(weatherData.sys.sunrise) : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Sunset</span>
              <span className="text-white font-medium">
                {weatherData.sys?.sunset ? formatTime(weatherData.sys.sunset) : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">UV Index</span>
              <span className="text-white font-medium">N/A</span>
            </div>
          </div>
        </motion.div>
        
        {/* Air Quality */}
        <motion.div
          className="weather-card rounded-2xl p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-white font-semibold text-lg mb-4">
            <FaLeaf className="text-green-300 mr-2 inline" />
            Air Quality
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70">AQI</span>
              <span className="text-white font-medium">N/A</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">PM2.5</span>
              <span className="text-white font-medium">N/A</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Ozone</span>
              <span className="text-white font-medium">N/A</span>
            </div>
          </div>
        </motion.div>
        
        {/* Weather Alerts */}
        <motion.div
          className="weather-card rounded-2xl p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-white font-semibold text-lg mb-4">
            <FaExclamationTriangle className="text-red-300 mr-2 inline" />
            Weather Alerts
          </h3>
          <div className="text-center py-4">
            <FaCheckCircle className="text-green-300 text-2xl mb-2 mx-auto" />
            <p className="text-white/70">No active alerts</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}