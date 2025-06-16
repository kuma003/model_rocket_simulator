import React from 'react';
import { ParticleSystem } from '../ParticleSystem';
import type { ParticleSystemProps } from '../ParticleSystem/types';

export const FloatingParticles: React.FC<ParticleSystemProps> = ({
  count = 50,
  className,
}) => {
  return (
    <ParticleSystem
      type="floating"
      count={count}
      className={className}
      animationInterval={50}
    />
  );
};
