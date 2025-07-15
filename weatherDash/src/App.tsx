import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WeatherDashboard from './pages/weatherDashboard.js';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<WeatherDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
