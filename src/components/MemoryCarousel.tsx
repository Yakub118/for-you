import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

interface Photo {
  url: string;
  caption: string;
}

interface MemoryCarouselProps {
  photos: Photo[];
  className?: string;
}

const MemoryCarousel = ({ photos, className = "" }: MemoryCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile Carousel View */}
      <div className="block md:hidden">
        <Card className="glass border-white/30 shadow-glow-romantic overflow-hidden">
          <CardContent className="p-0 relative">
            <div className="relative aspect-square overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={photos[currentIndex].url}
                  alt={photos[currentIndex].caption}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              
              {/* Navigation arrows */}
              {photos.length > 1 && (
                <>
                  <Button
                    variant="dreamy"
                    size="icon"
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full shadow-soft"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="dreamy"
                    size="icon"
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full shadow-soft"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
            
            {/* Caption */}
            <div className="p-4 text-center">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-foreground flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 text-primary animate-heart-pulse" />
                {photos[currentIndex].caption || "Beautiful Memory"}
              </motion.p>
            </div>
            
            {/* Dots indicator */}
            {photos.length > 1 && (
              <div className="flex justify-center gap-2 pb-4">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-primary scale-125"
                        : "bg-primary/30 hover:bg-primary/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:block">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                delay: index * 0.15, 
                duration: 0.6,
                type: "spring",
                stiffness: 100 
              }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Card className="glass border-white/30 shadow-glow-romantic overflow-hidden transition-all duration-500 group-hover:shadow-glow-dreamy group-hover:border-primary/30">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <motion.img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      whileHover={{ scale: 1.05 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <motion.div 
                    className="p-3 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-sm font-medium text-foreground flex items-center justify-center gap-2 leading-snug">
                      <Heart className="w-3 h-3 text-primary animate-heart-pulse" />
                      {photo.caption || "Beautiful Memory"}
                    </p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemoryCarousel;