import React, { useMemo } from "react";
import type { AltitudeBackgroundProps } from "./types";

import styles from "./AltitudeBackground.module.scss";

const AltitudeBackground: React.FC<AltitudeBackgroundProps> = ({
  altitudeLevel,
  containerHeight,
  containerWidth,
}) => {
  const backgroundPath = [
    "/0-50.png",
    "/50-100.png",
    "/100-150.png",
    "/150-.png",
    "/150-.png",
  ];
  const objectsData: { path: string; altLevel: number; left: number }[] = [
    { path: "/objects/aurora3.png", altLevel: 1.92, left: 75 },
    { path: "/objects/aurora3.png", altLevel: 1.92, left: 10 },
    { path: "/objects/aurora3.png", altLevel: 1.95, left: 50 },
    { path: "/objects/aurora3.png", altLevel: 1.96, left: 90 },
    { path: "/objects/aurora3.png", altLevel: 1.98, left: 10 },
    { path: "/objects/aurora3.png", altLevel: 1.99, left: 75 },
    { path: "/objects/aurora3.png", altLevel: 2.0, left: 0 },
    { path: "/objects/aurora1.png", altLevel: 2.03, left: 50 },
    { path: "/objects/aurora1.png", altLevel: 2.045, left: 15 },
    { path: "/objects/aurora1.png", altLevel: 2.05, left: 0 },
    { path: "/objects/aurora1.png", altLevel: 2.05, left: 75 },
    { path: "/objects/aurora1.png", altLevel: 2.07, left: 80 },
    { path: "/objects/aurora1.png", altLevel: 2.085, left: 10 },
    { path: "/objects/aurora1.png", altLevel: 2.09, left: 50 },
    { path: "/objects/aurora1.png", altLevel: 2.1, left: 0 },
    { path: "/objects/aurora2.png", altLevel: 2.115, left: 90 },
    { path: "/objects/aurora2.png", altLevel: 2.122, left: 40 },
    { path: "/objects/aurora1.png", altLevel: 2.13, left: 85 },
    { path: "/objects/aurora2.png", altLevel: 2.15, left: 110 },
    { path: "/objects/aurora1.png", altLevel: 2.15, left: 25 },
    { path: "/objects/aurora1.png", altLevel: 2.16, left: 35 },
    { path: "/objects/aurora2.png", altLevel: 2.17, left: 5 },
    // { path: "/objects/aurora2.png", altLevel: 2.18, left: 65 },
    // { path: "/objects/aurora1.png", altLevel: 2.19, left: 20 },
    // { path: "/objects/aurora1.png", altLevel: 2.21, left: 45 },
    // { path: "/objects/aurora2.png", altLevel: 2.22, left: 95 },
    // { path: "/objects/aurora2.png", altLevel: 2.24, left: 20 },
  ];
  const backgroundHeight = 5121;

  function clampedAltitude(altLevel: number): number {
    if (altLevel < 0) return 0;
    else if (altLevel < 3) return altLevel;
    else return altLevel - Math.floor(altLevel) + 3;
  }

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
          backgroundImage: `url(${backgroundPath[0]})`,
          top: `calc(-${backgroundHeight * (1 - clampedAltitude(altitudeLevel))}px + 100%)`,
          bottom: 0,
        }}
      />
      <div
        className={styles.backgroundLayer}
        style={{
          backgroundImage: `url(${backgroundPath[1]})`,
          top: `calc(-${backgroundHeight * (2 - clampedAltitude(altitudeLevel))}px + 100%)`,
          bottom: 0,
        }}
      />
      <div
        className={styles.backgroundLayer}
        style={{
          backgroundImage: `url(${backgroundPath[2]})`,
          top: `calc(-${backgroundHeight * (3 - clampedAltitude(altitudeLevel))}px + 100%)`,
          bottom: 0,
        }}
      />
      <div
        className={styles.backgroundLayer}
        style={{
          backgroundImage: `url(${backgroundPath[3]})`,
          top: `calc(-${backgroundHeight * (4 - clampedAltitude(altitudeLevel))}px + 100%)`,
          bottom: 0,
        }}
      />
      <div
        className={styles.backgroundLayer}
        style={{
          backgroundImage: `url(${backgroundPath[4]})`,
          top: `calc(-${backgroundHeight * (5 - clampedAltitude(altitudeLevel))}px + 100%)`,
          bottom: 0,
        }}
      />
      {objectsData.map((obj, index) => (
        <img
          key={index}
          src={obj.path}
          alt={`Sky object ${index + 1}`}
          className={styles.skyObject}
          style={{
            left: `${obj.left}%`,
            transform: "translateX(-50%)",
            top: `calc(100% - ${backgroundHeight * (obj.altLevel - clampedAltitude(altitudeLevel))}px)`,
          }}
        />
      ))}
      <img
        src="/objects/moon.jpg"
        alt="moon"
        className={styles.skyObject}
        style={{
          left: "70%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          top: `calc(100% - ${backgroundHeight * (2.5 - clampedAltitude(altitudeLevel))}px)`,
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: "inset -30px 0 60px rgba(0,0,0,0.5)",
          border: "2px solid #4a4a48",
        }}
      />
      <img
        src="/objects/jupiter.jpg"
        alt="jupter"
        className={styles.skyObject}
        style={{
          left: "70%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          top: `calc(100% - ${backgroundHeight * (3 - clampedAltitude(altitudeLevel))}px)`,
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: "inset -30px 0 60px rgba(0,0,0,0.5)",
          border: "2px solid #4a4a48",
        }}
      />
    </div>
  );
};

export default AltitudeBackground;
