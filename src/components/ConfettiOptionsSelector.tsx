import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type ConfettiStyle = 'hearts' | 'stars' | 'petals' | 'bubbles' | 'rings' | 'mixed';

interface ConfettiOption {
  id: ConfettiStyle;
  name: string;
  emoji: string;
  description: string;
  preview: string[];
}

const confettiOptions: ConfettiOption[] = [
  {
    id: 'hearts',
    name: 'Romantic Hearts',
    emoji: '💖',
    description: 'Classic romantic hearts falling gracefully',
    preview: ['💖', '💕', '💗', '💘', '❤️']
  },
  {
    id: 'stars',
    name: 'Magical Stars',
    emoji: '✨',
    description: 'Twinkling stars and sparkles',
    preview: ['✨', '⭐', '🌟', '💫', '⚡']
  },
  {
    id: 'petals',
    name: 'Rose Petals',
    emoji: '🌹',
    description: 'Elegant rose petals dancing in the air',
    preview: ['🌹', '🌸', '🌺', '🌻', '🌷']
  },
  {
    id: 'bubbles',
    name: 'Champagne Bubbles',
    emoji: '🥂',
    description: 'Celebration bubbles floating upward',
    preview: ['🫧', '💎', '🥂', '🍾', '✨']
  },
  {
    id: 'rings',
    name: 'Diamond Rings',
    emoji: '💍',
    description: 'Sparkling engagement rings',
    preview: ['💍', '💎', '👑', '💖', '✨']
  },
  {
    id: 'mixed',
    name: 'Love Celebration',
    emoji: '🎉',
    description: 'Mix of hearts, stars, and wedding elements',
    preview: ['💖', '✨', '💍', '🌹', '🎉']
  }
];

interface ConfettiOptionsSelectorProps {
  selectedStyle: ConfettiStyle;
  onStyleChange: (style: ConfettiStyle) => void;
}

const ConfettiOptionsSelector = ({ selectedStyle, onStyleChange }: ConfettiOptionsSelectorProps) => {
  return (
    <div className="space-y-4">
      <Label className="text-lg font-romantic text-primary flex items-center gap-2">
        🎉 Choose Your Celebration Style
      </Label>
      
      <RadioGroup
        value={selectedStyle}
        onValueChange={(value) => onStyleChange(value as ConfettiStyle)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {confettiOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Label htmlFor={option.id} className="cursor-pointer">
              <Card className={`glass border-white/30 transition-all duration-300 hover:shadow-glow-romantic ${
                selectedStyle === option.id 
                  ? 'border-primary/50 shadow-glow-romantic bg-primary/5' 
                  : 'hover:border-primary/30'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={option.id} id={option.id} className="text-primary" />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{option.emoji}</span>
                        <h3 className="font-romantic text-lg text-primary">
                          {option.name}
                        </h3>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {option.description}
                      </p>
                      
                      <div className="flex gap-1">
                        {option.preview.map((emoji, index) => (
                          <motion.span
                            key={index}
                            animate={{ 
                              y: [0, -5, 0],
                              rotate: [0, 10, -10, 0]
                            }}
                            transition={{ 
                              duration: 2,
                              delay: index * 0.2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="text-lg"
                          >
                            {emoji}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Label>
          </motion.div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ConfettiOptionsSelector;