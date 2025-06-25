import { useState } from 'react';

export default function WeatherForm() {
  const [locationId, setLocationId] = useState('');
  const [message, setMessage] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Weather API error: ${res.status}`);
      }
      const data = await res.json();
      setWeatherData(data);
      return data;
    } catch (error) {
      setMessage('Failed to fetch weather data');
      console.error(error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Sending...');

    const weather = await fetchWeather(locationId);
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
        body: JSON.stringify({
          locationId,
          temperature: temp
        })
      });
      const data = await res.json();
      setMessage(data.message || 'Success!');
    } catch (err) {
      setMessage('Error sending data');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Location"
        value={locationId}
        onChange={e => setLocationId(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
      <div>{message}</div>
      {weatherData && (
        <div>
          <h3>Weather Data for {weatherData.name}</h3>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>Condition: {weatherData.weather[0]?.description}</p>
        </div>
      )}
    </form>
  );
}
