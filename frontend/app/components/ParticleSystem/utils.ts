import type { FloatingParticle, StarParticle, ParticleConfig } from './types';

export const createFloatingParticles = (count: number): FloatingParticle[] => {
  const particles: FloatingParticle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 0.5 + 0.1,
    });
  }
  return particles;
};

export const createStarParticles = (count: number): StarParticle[] => {
  const particles: StarParticle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() + 1,
      opacity: 0.3,
      twinkle: Math.random() + 0.5,
      color: `hsl(${Math.random() * 360}, 100%, ${Math.random() * 50 + 50}%)`,
    });
  }
  return particles;
};

export const updateFloatingParticles = (particles: FloatingParticle[]): FloatingParticle[] => {
  return particles.map((p) => ({
    ...p,
    y: p.y <= 0 ? 100 : p.y - p.speed,
    opacity: Math.sin(Date.now() * 0.001 + p.id) * 0.3 + 0.4,
  }));
};

export const getParticleStyle = (
  particle: FloatingParticle | StarParticle,
  type: 'floating' | 'star'
): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    left: `${particle.x}%`,
    top: `${particle.y}%`,
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    opacity: particle.opacity,
  };

  if (type === 'star' && 'color' in particle && 'twinkle' in particle) {
    return {
      ...baseStyle,
      animationDelay: `${particle.twinkle * 3}s`,
      animationDuration: `${2 + particle.twinkle * 2}s`,
      backgroundColor: particle.color,
    };
  }

  return baseStyle;
};