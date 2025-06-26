import { useState, useEffect } from 'react';

export default function WeatherForm() {
  const [locationId, setLocationId] = useState('');
  const [message, setMessage] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // Fetch weather by city name or coordinates
  const fetchWeather = async ({ city, lat, lon }) => {
    try {
      let url;
      if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      } else if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=imperial`;
      } else {
        throw new Error('No location provided');
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
      const data = await res.json();
      setWeatherData(data);
      setLocationId(data.name); // Prefill city input with resolved city name
      return data;
    } catch (error) {
      setMessage('Failed to fetch weather data');
      return null;
    }
  };

  // On mount, get user's location and fetch weather
  useEffect(() => {
    if ('geolocation' in navigator) {
      setMessage('Detecting your location...');
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setMessage('Fetching weather for your location...');
          await fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setMessage('');
        },
        (err) => {
          setMessage('Could not detect location. Please enter a city.');
        }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Fetching weather...');
    const weather = await fetchWeather({ city: locationId });
    if (!weather) {
      setMessage('Could not get weather data');
      return;
    }
    const temp = weather.main?.temp;
    if (temp === undefined) {
      setMessage('Temperature data not available');
      return;
    }
    try {
      const res = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationId, temperature: temp }),
      });
      const data = await res.json();
      setMessage(data.message || 'Success!');
    } catch (err) {
      setMessage('Error sending data');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-200 via-sky-200 to-fuchsia-100">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl shadow-2xl p-8 relative">
        <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent bg-gradient-to-br from-cyan-400/60 via-fuchsia-300/40 to-sky-400/30 blur-[2px]"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-center mb-7 tracking-tight drop-shadow-lg">
            <span className="bg-gradient-to-r from-cyan-500 via-fuchsia-400 to-sky-500 bg-clip-text text-transparent">
              Weather Dashboard
            </span>
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label className="text-gray-700 font-semibold" htmlFor="location">
              City Name
            </label>
            <input
              id="location"
              className="rounded-lg px-4 py-2 bg-white/80 border border-cyan-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 transition"
              placeholder="e.g. Marietta"
              value={locationId}
              onChange={e => setLocationId(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 hover:from-fuchsia-400 hover:to-cyan-400 text-white font-bold py-2 rounded-lg shadow-lg transition-all duration-200"
            >
              Get Weather
            </button>
          </form>
          <div className="text-center mt-4 text-sm text-fuchsia-500 min-h-[1.5em]">{message}</div>
          {weatherData && (
            <div className="mt-8 flex flex-col items-center bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-lg border border-cyan-200">
              <div className="flex items-center gap-3 mb-3">
                {weatherData.weather[0]?.icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt={weatherData.weather[0]?.description}
                    className="w-14 h-14 drop-shadow-xl"
                  />
                )}
                <span className="text-2xl font-extrabold text-cyan-600 drop-shadow">
                  {weatherData.name}
                </span>
              </div>
              <div className="text-6xl font-extrabold text-cyan-700 mb-2 animate-pulse">
                {weatherData.main.temp}°F
              </div>
              <div className="capitalize text-lg text-fuchsia-400 font-medium tracking-wide">
                {weatherData.weather[0]?.description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
