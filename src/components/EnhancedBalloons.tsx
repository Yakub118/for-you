import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Balloon {
  id: number;
  x: number;
  delay: number;
  color: string;
  size: number;
}

interface EnhancedBalloonsProps {
  message: string;
  onComplete?: () => void;
}

const EnhancedBalloons = ({ message, onComplete }: EnhancedBalloonsProps) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  useEffect(() => {
    // Create balloon data
    const balloonData: Balloon[] = [];
    const colors = ['💖', '💕', '💝', '💗', '💘'];
    const positions = [20, 35, 50, 65, 80]; // Percentage positions
    
    for (let i = 0; i < 5; i++) {
      balloonData.push({
        id: i,
        x: positions[i],
        delay: i * 0.3,
        color: colors[i],
        size: 3 + Math.random() * 2
      });
    }
    
    setBalloons(balloonData);
    
    // Call onComplete after all balloons have risen
    const timeout = setTimeout(() => {
      onComplete?.();
    }, 4000);
    
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Message in the center */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 1, type: "spring", stiffness: 100 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-glow-romantic border border-white/30">
          <motion.h2 
            className="text-2xl md:text-4xl font-romantic text-primary text-center whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            {message}
          </motion.h2>
        </div>
      </motion.div>

      {/* Balloons rising */}
      {balloons.map((balloon) => (
        <motion.div
          key={balloon.id}
          className="absolute"
          style={{
            left: `${balloon.x}%`,
            fontSize: `${balloon.size}rem`
          }}
          initial={{
            y: window.innerHeight + 100,
            rotate: 0,
            scale: 0.5,
            opacity: 0
          }}
          animate={{
            y: -200,
            rotate: [0, 10, -10, 5, 0],
            scale: [0.5, 1, 1.1, 1],
            opacity: [0, 1, 1, 0.8, 0]
          }}
          transition={{
            duration: 6,
            delay: balloon.delay,
            ease: "easeOut"
          }}
        >
          {/* Balloon string */}
          <div className="relative">
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-20 bg-primary/30" />
            <div className="relative z-10">
              {balloon.color}
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* Sparkles around balloons */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute text-yellow-400 text-xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${50 + Math.random() * 30}%`
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            rotate: 360
          }}
          transition={{
            duration: 2,
            delay: 1 + Math.random() * 3,
            repeat: Infinity,
            repeatDelay: Math.random() * 2
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
};

export default EnhancedBalloons;