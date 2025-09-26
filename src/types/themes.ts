export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    gradient: string;
    glow: string;
  };
  elements: {
    floatingItems: string[];
    backgroundPattern?: string;
    musicType?: string;
  };
  animations: {
    speed: number;
    intensity: number;
    style: 'gentle' | 'energetic' | 'dreamy' | 'cosmic' | 'classic';
  };
}

export const ROMANTIC_THEMES: ThemeConfig[] = [
  {
    id: "romantic-garden",
    name: "Romantic Garden",
    description: "Pink roses and dreamy gardens",
    icon: "🌹",
    colors: {
      primary: "340 75% 75%",
      secondary: "20 100% 85%",
      accent: "280 65% 85%",
      background: "350 100% 98%",
      foreground: "340 15% 25%",
      gradient: "linear-gradient(135deg, hsl(340 75% 75%), hsl(20 100% 85%))",
      glow: "0 0 30px hsl(340 75% 75% / 0.5)"
    },
    elements: {
      floatingItems: ["🌹", "🌸", "💕", "🦋"],
      backgroundPattern: "petals",
      musicType: "acoustic"
    },
    animations: {
      speed: 1.5,
      intensity: 2,
      style: "gentle"
    }
  },
  {
    id: "pastel-sky",
    name: "Pastel Sky",
    description: "Soft clouds and cotton candy colors",
    icon: "☁️",
    colors: {
      primary: "200 50% 80%",
      secondary: "330 50% 85%",
      accent: "180 40% 85%",
      background: "210 100% 98%",
      foreground: "200 15% 30%",
      gradient: "linear-gradient(135deg, hsl(200 50% 80%), hsl(330 50% 85%))",
      glow: "0 0 25px hsl(200 50% 80% / 0.4)"
    },
    elements: {
      floatingItems: ["☁️", "💙", "✨", "🎈"],
      backgroundPattern: "clouds",
      musicType: "dreamy"
    },
    animations: {
      speed: 1,
      intensity: 1.5,
      style: "dreamy"
    }
  },
  {
    id: "galaxy-love",
    name: "Galaxy Love",
    description: "Cosmic romance among the stars",
    icon: "🌌",
    colors: {
      primary: "270 80% 70%",
      secondary: "300 60% 80%",
      accent: "240 70% 85%",
      background: "260 30% 15%",
      foreground: "280 20% 90%",
      gradient: "linear-gradient(135deg, hsl(270 80% 70%), hsl(300 60% 80%))",
      glow: "0 0 40px hsl(270 80% 70% / 0.6)"
    },
    elements: {
      floatingItems: ["⭐", "🌟", "💫", "🌌"],
      backgroundPattern: "stars",
      musicType: "ambient"
    },
    animations: {
      speed: 2,
      intensity: 3,
      style: "cosmic"
    }
  },
  {
    id: "crystal-love",
    name: "Crystal Love",
    description: "Sparkling diamonds and shimmering light",
    icon: "💎",
    colors: {
      primary: "180 30% 85%",
      secondary: "200 40% 90%",
      accent: "160 25% 88%",
      background: "190 100% 98%",
      foreground: "180 15% 20%",
      gradient: "linear-gradient(135deg, hsl(180 30% 85%), hsl(200 40% 90%))",
      glow: "0 0 35px hsl(180 30% 85% / 0.5)"
    },
    elements: {
      floatingItems: ["💎", "✨", "🔮", "💠"],
      backgroundPattern: "crystals",
      musicType: "harp"
    },
    animations: {
      speed: 1.2,
      intensity: 2.5,
      style: "dreamy"
    }
  },
  {
    id: "classic-valentine",
    name: "Classic Valentine",
    description: "Bold red hearts and golden ribbons",
    icon: "❤️",
    colors: {
      primary: "0 80% 60%",
      secondary: "350 70% 70%",
      accent: "45 90% 75%",
      background: "0 50% 95%",
      foreground: "0 20% 15%",
      gradient: "linear-gradient(135deg, hsl(0 80% 60%), hsl(350 70% 70%))",
      glow: "0 0 30px hsl(0 80% 60% / 0.5)"
    },
    elements: {
      floatingItems: ["❤️", "💖", "🎀", "💝"],
      backgroundPattern: "hearts",
      musicType: "jazz"
    },
    animations: {
      speed: 1.8,
      intensity: 2.2,
      style: "classic"
    }
  }
];

export const getThemeById = (id: string): ThemeConfig | undefined => {
  return ROMANTIC_THEMES.find(theme => theme.id === id);
};

export const getDefaultTheme = (): ThemeConfig => {
  return ROMANTIC_THEMES[0]; // romantic-garden
};