import { useEffect, useRef } from 'react';

interface ARModeProps {
  enabled: boolean;
  onARSupported?: (supported: boolean) => void;
}

const ARMode = ({ enabled, onARSupported }: ARModeProps) => {
  const arContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Check if AR.js and Three.js are available
    const checkARSupport = async () => {
      try {
        // Simple AR.js integration for floating hearts
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/three.js/build/ar-threex.js';
          document.head.appendChild(script);
          
          script.onload = () => {
            initializeAR();
            onARSupported?.(true);
          };
          
          script.onerror = () => {
            onARSupported?.(false);
            showFallbackAnimation();
          };
        } else {
          onARSupported?.(false);
          showFallbackAnimation();
        }
      } catch (error) {
        console.log('AR not supported:', error);
        onARSupported?.(false);
        showFallbackAnimation();
      }
    };

    const initializeAR = () => {
      if (!arContainerRef.current) return;

      // Create floating hearts animation as fallback
      showFallbackAnimation();
    };

    const showFallbackAnimation = () => {
      if (!arContainerRef.current) return;

      // Create beautiful 2D floating hearts animation
      const container = arContainerRef.current;
      container.innerHTML = '';
      
      // Add floating hearts
      for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.cssText = `
          position: absolute;
          font-size: ${20 + Math.random() * 20}px;
          left: ${Math.random() * 100}%;
          top: 100%;
          pointer-events: none;
          z-index: 1000;
          animation: float-up ${3 + Math.random() * 2}s infinite linear;
        `;
        
        container.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
          if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
          }
        }, 5000);
      }
    };

    checkARSupport();

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float-up {
        from {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        to {
          transform: translateY(-100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [enabled, onARSupported]);

  if (!enabled) return null;

  return (
    <div 
      ref={arContainerRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};

export default ARMode;