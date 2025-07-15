import { useState, useEffect } from "react";

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [savedLocations, setSavedLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  
  // Load saved locations from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("weatherLocations") || "[]");
    setSavedLocations(saved);
  }, []);

  // Save locations to localStorage when they change
  useEffect(() => {
    localStorage.setItem("weatherLocations", JSON.stringify(savedLocations));
  }, [savedLocations]);

  // Fetch weather by city name or coordinates
  const fetchWeather = async ({ city, lat, lon }: { city?: string; lat?: number; lon?: number }) => {
    if (!apiKey) {
      setMessage("Weather API key is missing");
      return null;
    }

    try {
      setIsLoading(true);
      setMessage("Loading weather data...");
      
      let url;
      if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      } else if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=imperial`;
      } else {
        setMessage("No location provided");
        return null;
      }

      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) {
          setMessage("City not found. Please try a different location.");
          return null;
        }
        if (res.status === 401) {
          setMessage("Invalid API key. Please check your configuration.");
          return null;
        }
        setMessage(`Weather service error: ${res.status}`);
        return null;
      }
      
      const data = await res.json();

      // Validate the response data
      if (!data.coord || !data.weather || !data.main) {
        setMessage("Invalid weather data received");
        return null;
      }

      // Save to localStorage for quick access
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
      setMessage(""); // Clear message on success
      return data;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch weather data";
      setMessage(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch 5-day forecast
  const fetchForecast = async ({ lat, lon }: { lat: number; lon: number }) => {
    if (!apiKey) {
      return null;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      const res = await fetch(url);
      if (!res.ok) {
        return null;
      }
      const data = await res.json();

      // Validate forecast data
      if (!data.list || !Array.isArray(data.list)) {
        return null;
      }

      setForecastData(data);
      return data;
    } catch (error) {
      return null;
    }
  };

  return {
    weatherData,
    forecastData,
    savedLocations,
    isLoading,
    message,
    setMessage,
    fetchWeather,
    fetchForecast,
  };
};