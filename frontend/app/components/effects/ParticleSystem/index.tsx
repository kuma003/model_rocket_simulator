import React, { useState, useEffect } from 'react';
import type { FloatingParticle, StarParticle, ParticleSystemProps } from './types';
import { createFloatingParticles, createStarParticles, updateFloatingParticles, getParticleStyle } from './utils';
import styles from './ParticleSystem.module.scss';

interface BaseParticleSystemProps extends ParticleSystemProps {
  type: 'floating' | 'star';
  animationInterval?: number;
}

export const ParticleSystem: React.FC<BaseParticleSystemProps> = ({
  count = 50,
  type = 'floating',
  animationInterval = 50,
  className = '',
}) => {
  const [particles, setParticles] = useState<(FloatingParticle | StarParticle)[]>([]);

  useEffect(() => {
    const initialParticles = type === 'floating' 
      ? createFloatingParticles(count) 
      : createStarParticles(count);
    
    setParticles(initialParticles as any);

    if (type === 'floating') {
      const interval = setInterval(() => {
        setParticles((prev) => updateFloatingParticles(prev as FloatingParticle[]));
      }, animationInterval);

      return () => clearInterval(interval);
    }
  }, [count, type, animationInterval]);

  const containerClass = `${styles.container} ${className}`;
  const particleClass = type === 'floating' ? styles.floatingParticle : styles.starParticle;

  return (
    <div className={containerClass}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={particleClass}
          style={getParticleStyle(particle, type)}
        />
      ))}
    </div>
  );
};

export type { ParticleSystemProps } from './types';