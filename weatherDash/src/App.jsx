import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WeatherDashboard from './components/form.jsx';
import Navbar from './components/Navbar.jsx';
import AccountPage from './components/AccountPage.jsx';
import FavoritesPage from './components/FavoritesPage.jsx';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<WeatherDashboard />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
