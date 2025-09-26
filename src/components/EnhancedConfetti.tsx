import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  symbol: string;
  rotation: number;
  scale: number;
  vx: number;
  vy: number;
}

interface EnhancedConfettiProps {
  trigger?: boolean;
  onComplete?: () => void;
}

const EnhancedConfetti = ({ trigger = false, onComplete }: EnhancedConfettiProps) => {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (trigger) {
      // Create confetti pieces
      const pieces: ConfettiPiece[] = [];
      const symbols = ['🎉', '💖', '✨', '🌟', '💕', '🎊', '💐', '🌹', '💍', '👰', '🤵', '💒'];
      const colors = ['#ff69b4', '#ff1493', '#ffc0cb', '#ffd700', '#ff6347', '#ff4500'];
      
      for (let i = 0; i < 80; i++) {
        pieces.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -50,
          color: colors[Math.floor(Math.random() * colors.length)],
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 1.5,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * 3 + 2
        });
      }
      
      setConfettiPieces(pieces);
      
      // Clear confetti after animation
      const timeout = setTimeout(() => {
        setConfettiPieces([]);
        onComplete?.();
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [trigger, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute text-2xl"
          style={{
            color: piece.color,
            fontSize: `${piece.scale}rem`
          }}
          initial={{
            x: piece.x,
            y: piece.y,
            rotate: piece.rotation,
            scale: piece.scale,
            opacity: 1
          }}
          animate={{
            x: piece.x + piece.vx * 50,
            y: window.innerHeight + 100,
            rotate: piece.rotation + 720,
            opacity: [1, 1, 0.8, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            ease: "easeOut"
          }}
        >
          {piece.symbol}
        </motion.div>
      ))}
    </div>
  );
};

export default EnhancedConfetti;