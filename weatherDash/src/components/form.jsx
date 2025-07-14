import { useState, useEffect } from "react";
import { FaCloudSun, FaMapMarkerAlt, FaSearch } from "react-icons/fa";

export default function WeatherDashboard() {
  const [locationId, setLocationId] = useState("");
  const [message, setMessage] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // Fetch weather by city name or coordinates
  const fetchWeather = async ({ city, lat, lon }) => {
    try {
      let url;
      if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      } else if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${apiKey}&units=imperial`;
      } else {
        throw new Error("No location provided");
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
      const data = await res.json();

      // Save to localStorage
      const newLocation = {
        id: data.id,
        name: data.name,
        country: data.sys?.country || "",
      };

      setSavedLocations((prev) => {
        const exists = prev.some((loc) => loc.id === newLocation.id);
        return exists ? prev : [...prev, newLocation];
      });

      setWeatherData(data);
      setLocationId(data.name);
      return data;
    } catch (error) {
      setMessage("Failed to fetch weather data");
      return null;
    }
  };

  // Fetch 5-day forecast
  const fetchForecast = async ({ lat, lon }) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Forecast API error");
      const data = await res.json();
      setForecastData(data);
    } catch (error) {
      console.error("Failed to fetch forecast", error);
    }
  };

  // On mount, get user's location and fetch weather
  useEffect(() => {
    // Load saved locations from localStorage
    const saved = JSON.parse(localStorage.getItem("weatherLocations") || "[]");
    setSavedLocations(saved);

    if ("geolocation" in navigator) {
      setMessage("Detecting your location...");
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setMessage("Fetching weather for your location...");
          const weather = await fetchWeather({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
          if (weather) {
            fetchForecast({
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
            });
          }
          setMessage("");
        },
        (err) => {
          setMessage("Could not detect location. Please enter a city.");
        }
      );
    }
  }, []);

  // Save locations to localStorage when they change
  useEffect(() => {
    localStorage.setItem("weatherLocations", JSON.stringify(savedLocations));
  }, [savedLocations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Fetching weather...");
    const weather = await fetchWeather({ city: locationId });
    if (!weather) return;

    fetchForecast({
      lat: weather.coord.lat,
      lon: weather.coord.lon,
    });

    setMessage("");
  };

  const handleLocationSelect = (location) => {
    setLocationId(location.name);
    fetchWeather({ city: location.name });
  };

  return (
    <div className="min-h-screen flex flex-col font-cambria bg-blue-100">
      <main className="flex-grow">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-4xl mx-auto">
              {/* Left: Weather Form and Info */}
              <div className="w-full md:w-1/2 flex flex-col items-center">
                <h1 className="text-3xl font-bold text-gray-700 mb-6 flex items-center justify-center">
                  <FaCloudSun className="mr-2 text-yellow-400" />
                  Weather Dashboard
                </h1>
                <form
                  onSubmit={handleSubmit}
                  className="w-full flex flex-col gap-5 mb-6"
                >
                  <label
                    className="text-gray-700 font-semibold flex items-center"
                    htmlFor="location"
                  >
                    <FaMapMarkerAlt className="mr-2 text-cyan-600 inline" />
                    City Name
                  </label>
                  <div className="relative">
                    <input
                      id="location"
                      className="w-full rounded-lg px-4 py-2 pl-10 bg-white/80 border border-cyan-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 transition"
                      placeholder="e.g. Atlanta"
                      value={locationId}
                      onChange={(e) => setLocationId(e.target.value)}
                      required
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 hover:from-fuchsia-400 hover:to-cyan-400 text-white font-bold py-2 rounded-lg shadow-lg transition-all duration-200"
                  >
                    Get Weather
                  </button>
                </form>
                <div className="text-center mb-4 text-sm text-fuchsia-500 min-h-[1.5em]">
                  {message}
                </div>
                {/* Current Weather */}
                {weatherData && (
                  <div className="mt-8 flex flex-col items-center bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-cyan-200">
                    <div className="flex items-center gap-3 mb-4">
                      {weatherData.weather[0]?.icon && (
                        <img
                          src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                          alt={weatherData.weather[0]?.description}
                          className="w-16 h-16 drop-shadow-xl"
                        />
                      )}
                      <span className="text-2xl font-extrabold text-cyan-700">
                        {weatherData.name}
                        {weatherData.sys?.country &&
                          `, ${weatherData.sys.country}`}
                      </span>
                    </div>
                    <div className="text-6xl font-extrabold text-blue-600 mb-2">
                      {Math.round(weatherData.main.temp)}°F
                    </div>
                    <div className="capitalize text-lg text-fuchsia-600 font-medium tracking-wide mb-4">
                      {weatherData.weather[0]?.description}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-md">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="text-sm text-gray-600">Feels Like</div>
                        <div className="font-bold text-blue-700">
                          {Math.round(weatherData.main.feels_like)}°F
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="text-sm text-gray-600">Humidity</div>
                        <div className="font-bold text-blue-700">
                          {weatherData.main.humidity}%
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="text-sm text-gray-600">Wind</div>
                        <div className="font-bold text-blue-700">
                          {weatherData.wind.speed} mph
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="text-sm text-gray-600">Pressure</div>
                        <div className="font-bold text-blue-700">
                          {weatherData.main.pressure} hPa
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Right: Large Default Weather Icon */}
              <div className="w-full md:w-1/2 flex justify-center items-center mt-10 md:mt-0">
                <FaCloudSun className="text-[220px] text-yellow-300 drop-shadow-lg" />
              </div>
            </div>
          </div>
        </section>
        {/* 5-Day Forecast Box */}
        <div className="container mx-auto px-4 mt-8 max-w-xl">
          <div className="bg-white/90 rounded-xl shadow-lg border border-cyan-200 px-8 py-8 mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              5-Day Forecast
            </h2>
            {forecastData ? (
              <div className="flex justify-center">
                <table className="w-[45%] mx-auto">
                  <tbody>
                    {forecastData.list
                      .filter((_, index) => index % 8 === 0)
                      .slice(0, 5)
                      .map((forecast, index) => (
                        <tr key={index} className="text-center">
                          {/* Day of week, left-aligned with padding */}
                          <td className="pl-6 py-3 font-medium text-gray-700 text-left">
                            {new Date(forecast.dt * 1000).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                              }
                            )}
                          </td>
                          {/* Weather icon, centered */}
                          <td className="py-3">
                            {forecast.weather[0]?.icon && (
                              <img
                                src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                                alt={forecast.weather[0]?.description}
                                className="w-10 h-10 mx-auto"
                              />
                            )}
                          </td>
                          {/* Temperature, centered */}
                          <td className="py-3 text-lg font-bold text-blue-600 text-center">
                            {Math.round(forecast.main.temp)}°F
                          </td>
                          {/* Description, right-aligned with padding */}
                          <td className="pr-6 py-3 text-sm text-gray-600 capitalize text-right">
                            {forecast.weather[0]?.description}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                {weatherData
                  ? "Loading forecast..."
                  : "Enter a location to see forecast"}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
