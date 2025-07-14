import { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function FavoritesPage() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("weatherLocations") || "[]");
    setLocations(saved);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Favorite Locations</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {locations.length === 0 ? (
          <p className="text-gray-500">No favorites saved yet</p>
        ) : (
          <ul className="space-y-4">
            {locations.map((loc) => (
              <li
                key={loc.id}
                className="flex items-center gap-3 text-lg text-blue-700 font-semibold"
              >
                <FaMapMarkerAlt className="text-cyan-600" />
                {loc.name}
                {loc.country && <span className="text-gray-500 ml-2">({loc.country})</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
