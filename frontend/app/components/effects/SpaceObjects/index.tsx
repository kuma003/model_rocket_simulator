import React from "react";
import styles from "./spaceObjects.module.scss";

export interface FloatingSpaceObjectsProps {
  count?: number;
  className?: string;
}

export const FloatingSpaceObjects: React.FC<FloatingSpaceObjectsProps> = ({
  count = 8,
  className,
}) => {
  return (
    <div className={`${styles.floatingContainer} ${className || ""}`}>
      {/* Orange Planet - Bottom Left */}
      <div className={styles.orangePlanet}>
        <div className={styles.orangePlanetBody}>
          <div className={styles.crater1}></div>
          <div className={styles.crater2}></div>
        </div>
      </div>
      {/* Green Moon - Top Left */}
      <div className={styles.greenMoon}>
        <div className={styles.greenMoonBody}>
          <div className={styles.moonCrater}></div>
        </div>
      </div>
      {/* Purple Planet - Bottom Right */}
      <div className={styles.purplePlanet}>
        <div className={styles.purplePlanetBody}>
          <div className={styles.purpleCrater1}></div>
          <div className={styles.purpleCrater2}></div>
          <div className={styles.purpleCrater3}></div>
        </div>
      </div>

      {/* Yellow Asteroid - Middle Left */}
      <div className={styles.yellowAsteroid}>
        <div className={styles.yellowAsteroidBody}>
          <div className={styles.yellowCrater1}></div>
          <div className={styles.yellowCrater2}></div>
        </div>
      </div>
      {/* Teal Planet - Middle Right */}
      <div className={styles.tealPlanet}>
        <div className={styles.tealPlanetBody}>
          <div className={styles.tealCrater1}></div>
          <div className={styles.tealCrater2}></div>
        </div>
      </div>
    </div>
  );
};
