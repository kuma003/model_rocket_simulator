import React, { useEffect, useState } from "react";
import styles from "./starField.module.scss";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  twinkle: number;
  color: string;
}

interface StarFieldProps {
  count?: number;
}

export const StarField: React.FC<StarFieldProps> = ({ count = 100 }) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const starArray: Star[] = [];
    for (let i = 0; i < count; i++) {
      starArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() + 1,
        twinkle: Math.random() + 0.5,
        color: `hsl(${Math.random() * 360}, 100%, ${Math.random() * 50 + 50}%)`,
      });
    }
    setStars(starArray);
  }, [count]);

  return (
    <div className={styles.starField}>
      {stars.map((star) => (
        <div
          key={star.id}
          className={styles.star}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.twinkle * 3}s`,
            animationDuration: `${2 + star.twinkle * 2}s`,
            backgroundColor: star.color,
          }}
        />
      ))}
    </div>
  );
};
