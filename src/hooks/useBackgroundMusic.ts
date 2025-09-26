import { useState, useEffect, useRef } from "react";

export const useBackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element with a romantic background track
    // Note: In production, you would host the audio file or use a CDN
    const audio = new Audio();
    
    // Using a royalty-free romantic track URL (placeholder)
    // In production, replace with your hosted audio file
    audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="; // Silent placeholder
    audio.loop = true;
    audio.volume = 0.3;
    
    audio.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
    });

    audio.addEventListener('error', () => {
      console.log('Audio failed to load');
      setIsLoaded(false);
    });

    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current || !isLoaded) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Handle potential browser autoplay restrictions
      audioRef.current.play().catch(error => {
        console.log('Autoplay prevented:', error);
        // You could show a toast here asking user to interact with the page first
      });
      setIsPlaying(true);
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  };

  return {
    isPlaying,
    isLoaded,
    toggleMusic,
    setVolume
  };
};