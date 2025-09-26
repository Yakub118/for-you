import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text3D, Center } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { ThemeConfig } from "@/types/themes";

// Enhanced 3D Heart component with theme support
function Heart({ 
  position, 
  scale, 
  color, 
  theme 
}: { 
  position: [number, number, number]; 
  scale: number; 
  color: string;
  theme: ThemeConfig;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(25, 25);
    shape.bezierCurveTo(25, 25, 20, 0, 0, 0);
    shape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
    shape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
    shape.bezierCurveTo(60, 77, 80, 55, 80, 35);
    shape.bezierCurveTo(80, 35, 80, 0, 50, 0);
    shape.bezierCurveTo(35, 0, 25, 25, 25, 25);
    return shape;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Add gentle rotation based on theme
      meshRef.current.rotation.y += 0.005 * theme.animations.speed;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * theme.animations.speed) * 0.1;
    }
  });

  return (
    <Float
      speed={theme.animations.speed}
      rotationIntensity={theme.animations.intensity * 0.3}
      floatIntensity={theme.animations.intensity}
    >
      <mesh ref={meshRef} position={position} scale={scale * 0.002}>
        <extrudeGeometry args={[heartShape, { depth: 8, bevelEnabled: true, bevelSize: 2 }]} />
        <meshPhongMaterial color={color} shininess={30} />
      </mesh>
    </Float>
  );
}

// Enhanced Rose component
function Rose({ 
  position, 
  scale, 
  theme 
}: { 
  position: [number, number, number]; 
  scale: number;
  theme: ThemeConfig;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003 * theme.animations.speed;
    }
  });

  return (
    <Float
      speed={theme.animations.speed * 1.2}
      rotationIntensity={theme.animations.intensity * 0.5}
      floatIntensity={theme.animations.intensity * 0.8}
    >
      <group ref={groupRef} position={position} scale={scale}>
        {/* Rose petals */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.3, 12, 8]} />
          <meshPhongMaterial color="#ff69b4" shininess={20} />
        </mesh>
        <mesh position={[0.2, 0.3, 0.1]} scale={0.8}>
          <sphereGeometry args={[0.25, 12, 8]} />
          <meshPhongMaterial color="#ff1493" shininess={20} />
        </mesh>
        <mesh position={[-0.1, 0.4, -0.1]} scale={0.7}>
          <sphereGeometry args={[0.2, 12, 8]} />
          <meshPhongMaterial color="#ff69b4" shininess={20} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8]} />
          <meshPhongMaterial color="#228b22" />
        </mesh>
      </group>
    </Float>
  );
}

// Enhanced Sparkle component with theme colors
function Sparkle({ 
  position, 
  scale, 
  theme 
}: { 
  position: [number, number, number]; 
  scale: number;
  theme: ThemeConfig;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.02 * theme.animations.speed;
      meshRef.current.rotation.y += 0.01 * theme.animations.speed;
      
      // Pulsing effect
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3 * theme.animations.speed) * 0.3;
      meshRef.current.scale.setScalar(scale * pulse);
    }
  });

  return (
    <Float
      speed={theme.animations.speed * 2}
      rotationIntensity={theme.animations.intensity * 1.5}
      floatIntensity={theme.animations.intensity * 2}
    >
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.1]} />
        <meshPhongMaterial 
          color={`hsl(${theme.colors.primary})`} 
          emissive={`hsl(${theme.colors.accent})`}
          emissiveIntensity={0.3} 
          shininess={100}
        />
      </mesh>
    </Float>
  );
}

// Cloud component for pastel sky theme
function Cloud({ 
  position, 
  scale, 
  theme 
}: { 
  position: [number, number, number]; 
  scale: number;
  theme: ThemeConfig;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x += 0.005 * theme.animations.speed;
      if (groupRef.current.position.x > 15) {
        groupRef.current.position.x = -15;
      }
    }
  });

  return (
    <Float
      speed={theme.animations.speed * 0.5}
      rotationIntensity={0.2}
      floatIntensity={theme.animations.intensity * 0.5}
    >
      <group ref={groupRef} position={position} scale={scale}>
        {/* Cloud made of multiple spheres */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.8, 8, 6]} />
          <meshLambertMaterial color="#ffffff" opacity={0.8} transparent />
        </mesh>
        <mesh position={[0.6, 0.1, 0]}>
          <sphereGeometry args={[0.6, 8, 6]} />
          <meshLambertMaterial color="#ffffff" opacity={0.8} transparent />
        </mesh>
        <mesh position={[-0.6, 0.1, 0]}>
          <sphereGeometry args={[0.6, 8, 6]} />
          <meshLambertMaterial color="#ffffff" opacity={0.8} transparent />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.5, 8, 6]} />
          <meshLambertMaterial color="#ffffff" opacity={0.8} transparent />
        </mesh>
      </group>
    </Float>
  );
}

// Star component for galaxy theme
function Star({ 
  position, 
  scale, 
  theme 
}: { 
  position: [number, number, number]; 
  scale: number;
  theme: ThemeConfig;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && meshRef.current.material) {
      // Twinkling effect
      const twinkle = 0.5 + Math.sin(state.clock.elapsedTime * 4 * theme.animations.speed) * 0.5;
      const material = meshRef.current.material as THREE.MeshPhongMaterial;
      material.emissiveIntensity = twinkle;
      
      // Slow rotation
      meshRef.current.rotation.z += 0.01 * theme.animations.speed;
    }
  });

  return (
    <Float
      speed={theme.animations.speed * 0.8}
      rotationIntensity={theme.animations.intensity * 0.3}
      floatIntensity={theme.animations.intensity * 0.8}
    >
      <mesh ref={meshRef} position={position} scale={scale}>
        <coneGeometry args={[0.1, 0.4, 5]} />
        <meshPhongMaterial 
          color="#ffffff"
          emissive={`hsl(${theme.colors.primary})`}
          emissiveIntensity={0.5}
          shininess={100}
        />
      </mesh>
    </Float>
  );
}

// Main 3D Scene with theme support
function Scene({ theme }: { theme: ThemeConfig }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Mouse parallax effect
  useFrame((state) => {
    if (cameraRef.current) {
      const x = (state.mouse.x * 0.5);
      const y = (state.mouse.y * 0.5);
      cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, x, 0.03);
      cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, y, 0.03);
    }
  });

  const renderThemeElements = () => {
    const elements = [];
    
    // Base lighting
    elements.push(
      <ambientLight key="ambient" intensity={0.6} />,
      <pointLight 
        key="point1" 
        position={[10, 10, 10]} 
        intensity={1} 
        color={`hsl(${theme.colors.primary})`} 
      />,
      <pointLight 
        key="point2" 
        position={[-10, -10, -10]} 
        intensity={0.5} 
        color={`hsl(${theme.colors.secondary})`} 
      />
    );

    // Theme-specific elements
    switch (theme.id) {
      case 'romantic-garden':
        elements.push(
          <Heart key="heart1" position={[-8, 4, -5]} scale={1.2} color="#ff69b4" theme={theme} />,
          <Heart key="heart2" position={[6, -3, -8]} scale={0.8} color="#ff1493" theme={theme} />,
          <Heart key="heart3" position={[8, 6, -3]} scale={1.0} color="#ffc0cb" theme={theme} />,
          <Rose key="rose1" position={[-10, 2, -4]} scale={0.8} theme={theme} />,
          <Rose key="rose2" position={[9, -5, -6]} scale={1.0} theme={theme} />,
          <Rose key="rose3" position={[-4, 8, -8]} scale={0.6} theme={theme} />
        );
        break;
        
      case 'pastel-sky':
        elements.push(
          <Cloud key="cloud1" position={[-12, 4, -6]} scale={0.8} theme={theme} />,
          <Cloud key="cloud2" position={[8, -2, -8]} scale={1.0} theme={theme} />,
          <Cloud key="cloud3" position={[-6, 7, -4]} scale={0.6} theme={theme} />,
          <Heart key="heart1" position={[5, 5, -5]} scale={0.6} color="#87CEEB" theme={theme} />,
          <Heart key="heart2" position={[-7, -4, -7]} scale={0.8} color="#FFB6C1" theme={theme} />
        );
        break;
        
      case 'galaxy-love':
        elements.push(
          <Star key="star1" position={[-8, 6, -5]} scale={1.2} theme={theme} />,
          <Star key="star2" position={[7, -4, -8]} scale={0.9} theme={theme} />,
          <Star key="star3" position={[-5, -6, -6]} scale={1.1} theme={theme} />,
          <Star key="star4" position={[9, 8, -3]} scale={0.7} theme={theme} />,
          <Heart key="heart1" position={[4, 2, -7]} scale={0.8} color="#9966CC" theme={theme} />,
          <Heart key="heart2" position={[-9, -3, -5]} scale={1.0} color="#DA70D6" theme={theme} />
        );
        break;
        
      case 'crystal-love':
        elements.push(
          <Sparkle key="sparkle1" position={[-6, 5, -4]} scale={1.5} theme={theme} />,
          <Sparkle key="sparkle2" position={[8, -3, -6]} scale={1.2} theme={theme} />,
          <Sparkle key="sparkle3" position={[-9, -5, -7]} scale={1.0} theme={theme} />,
          <Sparkle key="sparkle4" position={[5, 7, -5]} scale={1.3} theme={theme} />,
          <Heart key="heart1" position={[3, 1, -8]} scale={0.9} color="#B0E0E6" theme={theme} />
        );
        break;
        
      case 'classic-valentine':
        elements.push(
          <Heart key="heart1" position={[-7, 5, -5]} scale={1.4} color="#DC143C" theme={theme} />,
          <Heart key="heart2" position={[8, -4, -7]} scale={1.0} color="#FF1493" theme={theme} />,
          <Heart key="heart3" position={[-5, -6, -6]} scale={1.2} color="#FF69B4" theme={theme} />,
          <Heart key="heart4" position={[6, 7, -4]} scale={0.8} color="#FFB6C1" theme={theme} />,
          <Sparkle key="sparkle1" position={[4, 3, -8]} scale={1.1} theme={theme} />
        );
        break;
    }

    // Add more sparkles for all themes
    for (let i = 0; i < 6; i++) {
      elements.push(
        <Sparkle 
          key={`sparkle-${i}`}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 16,
            -3 - Math.random() * 8
          ]} 
          scale={0.8 + Math.random() * 0.6} 
          theme={theme} 
        />
      );
    }

    return elements;
  };

  return (
    <>
      <perspectiveCamera ref={cameraRef} position={[0, 0, 10]} fov={50} />
      {renderThemeElements()}
    </>
  );
}

interface EnhancedFloatingBackgroundProps {
  theme: ThemeConfig;
}

const EnhancedFloatingBackground: React.FC<EnhancedFloatingBackgroundProps> = ({ theme }) => {
  return (
    <div className="fixed inset-0 z-0">
      {/* 2D floating elements overlay */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => {
          const item = theme.elements.floatingItems[i % theme.elements.floatingItems.length];
          return (
            <motion.div
              key={i}
              className="absolute text-xl md:text-2xl opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 15, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: (4 + Math.random() * 4) / theme.animations.speed,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: theme.animations.style === 'cosmic' ? 'linear' : 'easeInOut'
              }}
            >
              {item}
            </motion.div>
          );
        })}
      </div>

      {/* 3D Canvas with optimized rendering */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ antialias: false, alpha: true }}
        performance={{ min: 0.5 }}
      >
        <Scene theme={theme} />
      </Canvas>
    </div>
  );
};

export default EnhancedFloatingBackground;