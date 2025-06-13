export interface BaseParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export interface FloatingParticle extends BaseParticle {
  speed: number;
}

export interface StarParticle extends BaseParticle {
  twinkle: number;
  color: string;
}

export interface ParticleSystemProps {
  count?: number;
  className?: string;
}

export type ParticleType = 'floating' | 'star';

export interface ParticleConfig {
  type: ParticleType;
  count: number;
  animationInterval?: number;
  sizeRange: [number, number];
  opacityRange: [number, number];
  speedRange?: [number, number];
  twinkleRange?: [number, number];
  useRandomColors?: boolean;
}