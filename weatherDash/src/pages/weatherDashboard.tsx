import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCloudSun, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { useWeatherTheme } from "../hooks/useWeatherTheme.js";
import { useWeatherData } from "../hooks/useWeatherData.js";
import WeatherParticles from "../components/weatherParticles.js";
import CurrentWeather from "../components/currentWeather.js";
import ForecastDisplay from "../components/forecastDisplay.js";
import SavedLocations from "../components/savedLocations.js";
import AdditionalDetails from "../components/additionalDetails.js";

export default function WeatherDashboard() {
  const [locationId, setLocationId] = useState("");
  
  const {
    weatherData,
    forecastData,
    savedLocations,
    isLoading,
    message,
    setMessage,
    fetchWeather,
    fetchForecast,
  } = useWeatherData();
  
  const weatherTheme = useWeatherTheme(weatherData?.weather[0]?.main);

  // On mount, get user's location and fetch weather
  useEffect(() => {
    if ("geolocation" in navigator) {
      setMessage("Detecting your location...");
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const weather = await fetchWeather({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
          if (weather) {
            await fetchForecast({
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
            });
          }
        },
        (err) => {
          setMessage("Could not detect location. Please enter a city.");
        }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationId.trim() || isLoading) return;
    
    const weather = await fetchWeather({ city: locationId.trim() });
    if (weather && weather.coord) {
      await fetchForecast({
        lat: weather.coord.lat,
        lon: weather.coord.lon,
      });
    }
  };

  const handleLocationSelect = async (location: any) => {
    if (isLoading) return;
    
    setLocationId(location.name);
    const weather = await fetchWeather({ city: location.name });
    if (weather && weather.coord) {
      await fetchForecast({
        lat: weather.coord.lat,
        lon: weather.coord.lon,
      });
    }
  };

  return (
    <div className={`min-h-screen ${weatherTheme} font-inter relative overflow-hidden`}>
      {/* Weather Particles Background */}
      <WeatherParticles weatherCondition={weatherData?.weather[0]?.main} />

      {/* Main Content */}
      <main className="relative z-10 pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Header */}
          <motion.header
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              <motion.span
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block"
              >
                <FaCloudSun className="text-yellow-300 mr-4" />
              </motion.span>
              Weather Dashboard
            </h1>
          </motion.header>

          {/* Search Section */}
          <motion.div
            className="max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="weather-card rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <label className="block text-white/90 font-medium mb-3 text-lg">
                    <FaMapMarkerAlt className="mr-2 text-yellow-300 inline" />
                    Enter Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-6 py-4 pl-12 rounded-xl input-glass text-white placeholder-white/60 text-lg focus:outline-none transition-all duration-300"
                      placeholder="e.g., New York, London, Tokyo"
                      value={locationId}
                      onChange={(e) => setLocationId(e.target.value)}
                      required
                    />
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" />
                  </div>
                </div>
                <motion.button
                  type="submit"
                  className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-300 btn-primary ${
                    isLoading 
                      ? 'cursor-not-allowed opacity-70' 
                      : 'hover:shadow-lg active:scale-95'
                  }`}
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  disabled={isLoading || !locationId.trim()}
                >
                  <FaSearch className="mr-2 inline" />
                  {isLoading ? "Searching..." : "Get Weather"}
                </motion.button>
              </form>
              
              {/* Status Message */}
              <div className="mt-6 text-center">
                <p className="text-white/80 font-medium min-h-[1.5em]">
                  {message}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Saved Locations */}
          <SavedLocations
            savedLocations={savedLocations}
            onLocationSelect={handleLocationSelect}
          />

          {/* Current Weather Display */}
          {weatherData && (
            <CurrentWeather weatherData={weatherData} />
          )}

          {/* 5-Day Forecast */}
          <ForecastDisplay
            forecastData={forecastData}
            isLoading={isLoading && !forecastData}
          />

          {/* Additional Weather Details */}
          {weatherData && (
            <AdditionalDetails weatherData={weatherData} />
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 py-8 text-center">
        <div className="container mx-auto px-4">
          <p className="text-white/60 text-sm">
            Powered by OpenWeatherMap API • Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </footer>
    </div>
  );
}