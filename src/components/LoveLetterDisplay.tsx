import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface LoveLetterDisplayProps {
  letter: string;
  authorName: string;
  onComplete?: () => void;
}

const LoveLetterDisplay = ({ letter, authorName, onComplete }: LoveLetterDisplayProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!letter) return;
    
    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex <= letter.length) {
        setDisplayedText(letter.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
        setTimeout(() => {
          onComplete?.();
        }, 1500);
      }
    }, 50); // Writing speed

    return () => clearInterval(timer);
  }, [letter, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="glass border-white/30 shadow-glow-romantic overflow-hidden">
        <CardContent className="p-0 relative">
          {/* Vintage paper background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/90 to-yellow-50/80" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='paper' patternUnits='userSpaceOnUse' width='20' height='20'%3E%3Cpath d='M0 0h20v20H0z' fill='none'/%3E%3Cpath d='M0 20L20 0H0z' stroke='%23d4af37' stroke-width='0.5' opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23paper)'/%3E%3C/svg%3E")`
          }} />
          
          {/* Red lines like notebook paper */}
          <div className="absolute left-16 top-0 bottom-0 w-px bg-red-300/30" />
          
          <div className="relative z-10 p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <Heart className="w-8 h-8 text-red-400 mx-auto mb-4 animate-heart-pulse" />
              <h3 className="text-2xl font-romantic text-primary/80">My Dearest Love</h3>
            </motion.div>

            <div className="space-y-6">
              <div className="font-handwriting text-lg md:text-xl leading-relaxed text-slate-700 min-h-[200px]">
                {displayedText}
                {!isComplete && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-primary"
                  >
                    |
                  </motion.span>
                )}
              </div>
              
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-right pt-6"
                >
                  <div className="font-handwriting text-lg text-slate-600">
                    Forever yours,
                  </div>
                  <div className="font-handwriting text-xl text-primary font-semibold mt-2">
                    {authorName} 💕
                  </div>
                </motion.div>
              )}
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-20">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-4xl"
              >
                💌
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoveLetterDisplay;