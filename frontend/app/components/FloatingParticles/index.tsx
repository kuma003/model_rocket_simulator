import React, { useState, useEffect } from "react";
import styles from "./floatingParticles.module.scss";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

interface FloatingParticlesProps {
  count?: number;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 50,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const particleArray: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particleArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.5 + 0.1,
      });
    }
    setParticles(particleArray);

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          y: p.y <= 0 ? 100 : p.y - p.speed,
          opacity: Math.sin(Date.now() * 0.001 + p.id) * 0.3 + 0.4,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className={styles.particleContainer}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={styles.particle}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  );
};
