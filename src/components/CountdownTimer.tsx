import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Clock, Calendar } from "lucide-react";

interface CountdownTimerProps {
  targetDate: Date;
  partnerName: string;
  onCountdownComplete: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = ({ targetDate, partnerName, onCountdownComplete }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setIsComplete(true);
        onCountdownComplete();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onCountdownComplete]);

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-center space-y-8"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="text-8xl mb-8"
        >
          🎉
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-romantic text-primary mb-4">
          The moment has arrived! ✨
        </h1>
        
        <p className="text-xl text-muted-foreground">
          {partnerName}, your special surprise is ready...
        </p>
      </motion.div>
    );
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, color: 'text-red-400' },
    { label: 'Hours', value: timeLeft.hours, color: 'text-pink-400' },
    { label: 'Minutes', value: timeLeft.minutes, color: 'text-purple-400' },
    { label: 'Seconds', value: timeLeft.seconds, color: 'text-blue-400' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center space-y-8 max-w-4xl mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="space-y-6"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-romantic rounded-full shadow-glow-romantic mb-6">
          <Clock className="w-10 h-10 text-white animate-heart-pulse" />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-romantic text-primary mb-4">
          Something magical is waiting for you, {partnerName}... ✨
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          A special surprise will be revealed when the countdown reaches zero
        </p>
      </motion.div>

      <Card className="glass border-white/30 shadow-glow-romantic">
        <CardContent className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {timeUnits.map((unit, index) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  className={`text-4xl md:text-6xl font-bold ${unit.color} mb-2`}
                  animate={{ scale: unit.value !== timeLeft.seconds ? 1 : [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={unit.value}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {unit.value.toString().padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
                <div className="text-sm md:text-lg text-muted-foreground font-medium">
                  {unit.label}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            Revealing on {targetDate.toLocaleDateString()} at {targetDate.toLocaleTimeString()}
          </span>
        </div>
        
        <div className="flex justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-2xl"
            >
              {['💖', '✨', '💍', '🌹', '💕'][i]}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CountdownTimer;