import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ROMANTIC_THEMES, ThemeConfig } from '@/types/themes';

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (themeId: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedTheme, onThemeChange }) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Choose Your Theme</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {ROMANTIC_THEMES.map((theme) => (
          <motion.div
            key={theme.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 overflow-hidden ${
                selectedTheme === theme.id
                  ? "ring-2 ring-primary shadow-glow-romantic"
                  : "glass hover:shadow-soft"
              }`}
              onClick={() => onThemeChange(theme.id)}
            >
              <CardContent className="p-4">
                {/* Theme Preview */}
                <div 
                  className="w-full h-20 rounded-lg mb-3 relative overflow-hidden"
                  style={{ 
                    background: theme.colors.gradient,
                    boxShadow: selectedTheme === theme.id ? theme.colors.glow : 'none'
                  }}
                >
                  {/* Floating elements preview */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {theme.elements.floatingItems.slice(0, 3).map((item, index) => (
                      <motion.span
                        key={index}
                        className="text-lg opacity-70"
                        animate={{
                          y: [0, -5, 0],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 2 + index * 0.5,
                          repeat: Infinity,
                          delay: index * 0.3
                        }}
                        style={{ 
                          margin: '0 2px',
                          color: selectedTheme === theme.id ? 'white' : 'inherit'
                        }}
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </div>
                
                {/* Theme Info */}
                <div className="text-center">
                  <h3 className="font-medium text-sm mb-1 flex items-center justify-center gap-1">
                    <span>{theme.icon}</span>
                    <span>{theme.name}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">{theme.description}</p>
                </div>
                
                {/* Theme Characteristics */}
                <div className="flex justify-center gap-1 mt-2">
                  {theme.elements.floatingItems.slice(3).map((item, index) => (
                    <span key={index} className="text-xs opacity-60">{item}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;