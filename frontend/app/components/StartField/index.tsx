import React from 'react';
import { ParticleSystem } from '../ParticleSystem';
import type { ParticleSystemProps } from '../ParticleSystem/types';

export const StarField: React.FC<ParticleSystemProps> = ({
  count = 100,
  className,
}) => {
  return (
    <ParticleSystem
      type="star"
      count={count}
      className={className}
    />
  );
};
