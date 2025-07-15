import { motion } from "framer-motion";

interface WeatherParticlesProps {
  weatherCondition?: string;
}

export default function WeatherParticles({ weatherCondition }: WeatherParticlesProps) {
  const getParticleCount = () => {
    if (!weatherCondition) return 4;
    const condition = weatherCondition.toLowerCase();
    
    if (condition.includes("rain") || condition.includes("drizzle")) return 20;
    if (condition.includes("snow")) return 15;
    if (condition.includes("cloud")) return 8;
    return 4;
  };

  const getParticleType = () => {
    if (!weatherCondition) return "default";
    const condition = weatherCondition.toLowerCase();
    
    if (condition.includes("rain") || condition.includes("drizzle")) return "rain";
    if (condition.includes("snow")) return "snow";
    return "default";
  };

  const particleCount = getParticleCount();
  const particleType = getParticleType();

  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: particleType === "rain" ? 1 : particleType === "snow" ? 3 : 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${
            particleType === "rain" 
              ? "bg-blue-200/30 h-8 w-1" 
              : particleType === "snow"
              ? "bg-white/60"
              : "bg-white/30"
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particleType === "rain" ? "2px" : `${particle.size * 4}px`,
            height: particleType === "rain" ? "16px" : `${particle.size * 4}px`,
          }}
          animate={{
            y: particleType === "rain" ? [0, 20, 0] : [0, -10, 0],
            x: particleType === "rain" ? [0, 5, 0] : [0, 2, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
