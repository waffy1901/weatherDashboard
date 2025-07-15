import { motion } from "framer-motion";
import { FaBookmark, FaChevronRight } from "react-icons/fa";

interface SavedLocation {
  id: number;
  name: string;
  country: string;
}

interface SavedLocationsProps {
  savedLocations: SavedLocation[];
  onLocationSelect: (location: SavedLocation) => void;
}

export default function SavedLocations({ savedLocations, onLocationSelect }: SavedLocationsProps) {
  if (savedLocations.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto mb-12"
    >
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        <FaBookmark className="text-yellow-300 mr-2 inline" />
        Saved Locations
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {savedLocations.map((location, index) => (
          <motion.div
            key={location.id}
            className="saved-location rounded-xl p-4 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onLocationSelect(location)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">{location.name}</h3>
                <p className="text-white/70 text-sm">{location.country}</p>
              </div>
              <FaChevronRight className="text-white/50" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}