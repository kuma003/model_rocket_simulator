import React from 'react';
import styles from './spaceObjects.module.scss';

interface SpaceObjectProps {
  type: 'planet' | 'moon' | 'asteroid';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SpaceObject: React.FC<SpaceObjectProps> = ({
  type,
  size = 'medium',
  color,
  className,
  style,
}) => {
  const getClassNames = () => {
    let classes = [styles.spaceObject, styles[type], styles[size]];
    if (className) classes.push(className);
    return classes.join(' ');
  };

  const getStyle = () => {
    const baseStyle = { ...style };
    if (color) {
      baseStyle.backgroundColor = color;
    }
    return baseStyle;
  };

  return (
    <div 
      className={getClassNames()}
      style={getStyle()}
    >
      {type === 'planet' && (
        <div className={styles.planetRings}></div>
      )}
      {type === 'asteroid' && (
        <div className={styles.asteroidCraters}></div>
      )}
    </div>
  );
};

interface FloatingSpaceObjectsProps {
  count?: number;
  className?: string;
}

export const FloatingSpaceObjects: React.FC<FloatingSpaceObjectsProps> = ({
  count = 8,
  className,
}) => {
  const objects = Array.from({ length: count }, (_, i) => {
    const types: ('planet' | 'moon' | 'asteroid')[] = ['planet', 'moon', 'asteroid'];
    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'];
    
    return {
      id: i,
      type: types[Math.floor(Math.random() * types.length)],
      size: sizes[Math.floor(Math.random() * sizes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 90,
      top: Math.random() * 90,
      delay: Math.random() * 10,
    };
  });

  return (
    <div className={`${styles.floatingContainer} ${className || ''}`}>
      {objects.map((obj) => (
        <SpaceObject
          key={obj.id}
          type={obj.type}
          size={obj.size}
          color={obj.color}
          className={styles.floating}
          style={{
            left: `${obj.left}%`,
            top: `${obj.top}%`,
            animationDelay: `${obj.delay}s`,
          }}
        />
      ))}
    </div>
  );
};