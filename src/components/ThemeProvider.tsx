import React, { createContext, useContext, useEffect } from 'react';
import { ThemeConfig, getDefaultTheme } from '@/types/themes';

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  theme: ThemeConfig;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme, children }) => {
  useEffect(() => {
    // Apply theme colors to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.colors.primary);
    root.style.setProperty('--secondary', theme.colors.secondary);
    root.style.setProperty('--accent', theme.colors.accent);
    root.style.setProperty('--background', theme.colors.background);
    root.style.setProperty('--foreground', theme.colors.foreground);
    root.style.setProperty('--gradient-romantic', theme.colors.gradient);
    root.style.setProperty('--glow-romantic', theme.colors.glow);

    // Add theme class to body for conditional styling
    document.body.className = `theme-${theme.id}`;
    
    return () => {
      document.body.className = '';
    };
  }, [theme]);

  const setTheme = (newTheme: ThemeConfig) => {
    // This function will be used by components that need to change theme
    // For now, themes are static per proposal
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};