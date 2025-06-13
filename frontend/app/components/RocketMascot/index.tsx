import React from 'react';
import styles from './rocketMascot.module.scss';

interface RocketMascotProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  animated?: boolean;
  position?: 'left' | 'right' | 'center';
  showPlaceholder?: boolean;
}

export const RocketMascot: React.FC<RocketMascotProps> = ({
  size = 'medium',
  className,
  animated = true,
  position = 'center',
  showPlaceholder = true,
}) => {
  const getClassNames = () => {
    let classes = [styles.mascotContainer, styles[size], styles[position]];
    if (animated) classes.push(styles.animated);
    if (className) classes.push(className);
    return classes.join(' ');
  };

  return (
    <div className={getClassNames()}>
      {showPlaceholder ? (
        <div className={styles.placeholder}>
          <div className={styles.rocketBody}>
            <div className={styles.rocketNose}></div>
            <div className={styles.rocketWindow}></div>
            <div className={styles.rocketFins}>
              <div className={styles.fin}></div>
              <div className={styles.fin}></div>
            </div>
            <div className={styles.rocketFlame}></div>
          </div>
          <div className={styles.mascotFace}>
            <div className={styles.eyes}>
              <div className={styles.eye}></div>
              <div className={styles.eye}></div>
            </div>
            <div className={styles.mouth}></div>
          </div>
          <div className={styles.placeholderText}>
            <span>🚀 Mascot Character</span>
            <small>Replace with your rocket mascot image</small>
          </div>
        </div>
      ) : (
        <img 
          src="/path/to/mascot-image.png" 
          alt="Rocket Mascot" 
          className={styles.mascotImage}
        />
      )}
      
      {animated && (
        <div className={styles.sparkles}>
          <div className={styles.sparkle}></div>
          <div className={styles.sparkle}></div>
          <div className={styles.sparkle}></div>
        </div>
      )}
    </div>
  );
};

// Additional component for mascot speech bubble
interface MascotSpeechProps {
  message: string;
  visible?: boolean;
  className?: string;
}

export const MascotSpeech: React.FC<MascotSpeechProps> = ({
  message,
  visible = true,
  className,
}) => {
  if (!visible) return null;

  return (
    <div className={`${styles.speechBubble} ${className || ''}`}>
      <p>{message}</p>
      <div className={styles.speechTail}></div>
    </div>
  );
};