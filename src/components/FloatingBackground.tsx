import { Canvas } from "@react-three/fiber";
import { Float, Text3D, Center } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

// 3D Heart component
function Heart({ position, scale, color }: { position: [number, number, number]; scale: number; color: string }) {
  const heartShape = new THREE.Shape();
  
  heartShape.moveTo(25, 25);
  heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
  heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
  heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
  heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
  heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
  heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={2}
    >
      <mesh position={position} scale={scale * 0.002}>
        <extrudeGeometry args={[heartShape, { depth: 8, bevelEnabled: false }]} />
        <meshPhongMaterial color={color} />
      </mesh>
    </Float>
  );
}

// 3D Rose component (simplified)
function Rose({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <Float
      speed={2}
      rotationIntensity={1}
      floatIntensity={1.5}
    >
      <group position={position} scale={scale}>
        {/* Rose petals as simple spheres */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.3, 8, 6]} />
          <meshPhongMaterial color="#ff69b4" />
        </mesh>
        <mesh position={[0.2, 0.3, 0.1]} scale={0.8}>
          <sphereGeometry args={[0.25, 8, 6]} />
          <meshPhongMaterial color="#ff1493" />
        </mesh>
        <mesh position={[-0.1, 0.4, -0.1]} scale={0.7}>
          <sphereGeometry args={[0.2, 8, 6]} />
          <meshPhongMaterial color="#ff69b4" />
        </mesh>
        {/* Stem */}
        <mesh position={[0, -0.3, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8]} />
          <meshPhongMaterial color="#228b22" />
        </mesh>
      </group>
    </Float>
  );
}

// Sparkle component
function Sparkle({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <Float
      speed={3}
      rotationIntensity={2}
      floatIntensity={3}
    >
      <group position={position} scale={scale}>
        <mesh>
          <octahedronGeometry args={[0.1]} />
          <meshPhongMaterial color="#ffd700" emissive="#ffff80" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

// Main 3D Scene
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffb6c1" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffc0cb" />

      {/* Hearts */}
      <Heart position={[-8, 4, -5]} scale={1.2} color="#ff69b4" />
      <Heart position={[6, -3, -8]} scale={0.8} color="#ff1493" />
      <Heart position={[8, 6, -3]} scale={1.0} color="#ffc0cb" />
      <Heart position={[-6, -6, -6]} scale={0.9} color="#ff69b4" />
      <Heart position={[3, 8, -7]} scale={0.7} color="#ff1493" />

      {/* Roses */}
      <Rose position={[-10, 2, -4]} scale={0.8} />
      <Rose position={[9, -5, -6]} scale={1.0} />
      <Rose position={[-4, 8, -8]} scale={0.6} />
      <Rose position={[7, 3, -5]} scale={0.9} />

      {/* Sparkles */}
      <Sparkle position={[-5, 7, -3]} scale={1.5} />
      <Sparkle position={[4, 5, -4]} scale={1.2} />
      <Sparkle position={[-8, -2, -7]} scale={1.0} />
      <Sparkle position={[10, -4, -2]} scale={1.3} />
      <Sparkle position={[-3, -7, -5]} scale={0.8} />
      <Sparkle position={[1, 9, -6]} scale={1.1} />
    </>
  );
}

const FloatingBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      {/* 2D floating hearts overlay */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
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
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            {i % 4 === 0 ? "💕" : i % 4 === 1 ? "💖" : i % 4 === 2 ? "✨" : "🌹"}
          </motion.div>
        ))}
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default FloatingBackground;