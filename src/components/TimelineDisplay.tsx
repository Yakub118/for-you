import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MapPin, Calendar } from "lucide-react";

interface TimelineMemory {
  id: string;
  title: string;
  date: string;
  photo: string;
  description: string;
}

interface TimelineDisplayProps {
  memories: TimelineMemory[];
  onComplete?: () => void;
}

const TimelineDisplay = ({ memories, onComplete }: TimelineDisplayProps) => {
  if (!memories || memories.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <Heart className="w-12 h-12 text-primary mx-auto mb-4 animate-heart-pulse" />
        <h2 className="text-4xl md:text-5xl font-romantic text-primary mb-4">
          Our Beautiful Journey Together ✨
        </h2>
        <p className="text-lg text-muted-foreground">
          Every moment with you has been magical...
        </p>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary/30 via-primary/50 to-primary/30 rounded-full" />

        <div className="space-y-16">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: index * 0.3,
                duration: 0.8,
                type: "spring",
                stiffness: 100 
              }}
              className={`flex items-center ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Content */}
              <div className="w-5/12">
                <Card className="glass border-white/30 shadow-glow-romantic hover:shadow-glow-dreamy transition-all duration-500">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <motion.img
                          src={memory.photo}
                          alt={memory.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-romantic text-primary mb-2">
                          {memory.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Calendar className="w-4 h-4" />
                          <span>{memory.date}</span>
                        </div>
                        
                        <p className="text-foreground leading-relaxed">
                          {memory.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline dot */}
              <div className="relative flex items-center justify-center w-2/12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.3 + 0.5 }}
                  className="w-6 h-6 bg-primary rounded-full border-4 border-white shadow-lg z-10"
                />
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.3 + 0.7 }}
                  className="absolute w-12 h-12 bg-primary/20 rounded-full animate-ping"
                />
              </div>

              {/* Spacer */}
              <div className="w-5/12" />
            </motion.div>
          ))}

          {/* Final timeline element - Proposal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: memories.length * 0.3 + 0.5 }}
            className="flex justify-center"
            onAnimationComplete={() => {
              setTimeout(() => {
                onComplete?.();
              }, 2000);
            }}
          >
            <Card className="glass border-primary/50 shadow-glow-romantic bg-gradient-romantic/20 max-w-md">
              <CardContent className="p-8 text-center">
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
                  className="text-6xl mb-4"
                >
                  💍
                </motion.div>
                <h3 className="text-2xl font-romantic text-primary mb-2">
                  And now...
                </h3>
                <p className="text-lg text-foreground">
                  The most important question of all ✨
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineDisplay;