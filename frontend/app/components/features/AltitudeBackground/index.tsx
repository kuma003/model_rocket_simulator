import React, { useMemo } from "react";
import type { AltitudeBackgroundProps } from "./types";
import { getBackgroundStyle } from "./backgroundUtils";
import { 
  calculateObjectPosition, 
  getVisibleObjects, 
  getObjectClassName,
  sampleSkyObjects 
} from "./skyObjectUtils";
import styles from "./AltitudeBackground.module.scss";

const AltitudeBackground: React.FC<AltitudeBackgroundProps> = ({
  altitude,
  stepInterval = 50,
  objects = sampleSkyObjects,
  containerHeight,
  containerWidth,
}) => {
  const backgroundStyle = useMemo(() => 
    getBackgroundStyle(altitude, stepInterval, containerHeight),
    [altitude, stepInterval, containerHeight]
  );

  const visibleObjects = useMemo(() => 
    getVisibleObjects(objects, altitude, stepInterval),
    [objects, altitude, stepInterval]
  );

  const objectPositions = useMemo(() => 
    visibleObjects.map((obj) => ({
      ...obj,
      position: calculateObjectPosition(obj, altitude, stepInterval, containerHeight),
    })),
    [visibleObjects, altitude, stepInterval, containerHeight]
  );

  return (
    <div 
      className={styles.container}
      style={{ 
        width: containerWidth,
        height: containerHeight,
      }}
    >
      <div
        className={styles.backgroundLayer}
        style={{
          backgroundImage: backgroundStyle.backgroundImage,
          backgroundPosition: backgroundStyle.backgroundPosition,
          backgroundSize: "cover",
        }}
      />
      
      <div className={styles.objectsLayer}>
        {objectPositions.map((obj, index) => (
          <div
            key={`${obj.type}-${obj.altitude}-${index}`}
            className={`${styles.skyObject} ${styles[getObjectClassName(obj.type)]}`}
            style={{
              left: `${obj.position.x}%`,
              top: `${obj.position.y}px`,
              opacity: obj.position.opacity,
              fontSize: `${(obj.size || 1) * 1.5}rem`,
              transform: `translate(-50%, -50%)`,
            }}
          >
            {obj.icon}
          </div>
        ))}
      </div>
      
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "8px",
            fontSize: "12px",
            borderRadius: "4px",
            pointerEvents: "none",
          }}
        >
          <div>Altitude: {altitude.toFixed(1)}m</div>
          <div>Step: {stepInterval}m</div>
          <div>Objects: {visibleObjects.length}</div>
          <div>Image: {backgroundStyle.backgroundImage}</div>
          <div>Position: {backgroundStyle.backgroundPosition}</div>
        </div>
      )}
    </div>
  );
};

export default AltitudeBackground;