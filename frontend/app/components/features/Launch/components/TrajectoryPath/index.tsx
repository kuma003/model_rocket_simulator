import React, { useMemo } from "react";
import type { RocketTrajectory } from "~/utils/calculations/4DoF";

interface TrajectoryPathProps {
  trajectoryData: RocketTrajectory;
  altitude: number;
  step: number;
}

const TrajectoryPath: React.FC<TrajectoryPathProps> = ({
  trajectoryData,
  altitude,
  step,
}) => {
  const altitudeLevel = altitude / step;

  function clampedAltitude(altLevel: number): number {
    if (altLevel < 0) return 0;
    else if (altLevel < 3) return altLevel;
    else return altLevel - Math.floor(altLevel) + 3;
  }

  const clampedAlt = clampedAltitude(altitudeLevel);
  console.log(
    "TrajectoryPath - altitude:",
    altitude,
    "altitudeLevel:",
    altitudeLevel,
    "clampedAlt:",
    clampedAlt
  );

  const trajectoryPath = useMemo(() => {
    if (!trajectoryData || trajectoryData.position.length < 2) return "";

    const pathData = trajectoryData.position
      .map((point, index) => {
        // x position: screen center (50%) + horizontal displacement scaled by step
        const x = 50 + (point.x / step) * 500;
        // y position: from bottom - altitude offset, matching background behavior
        const y = 50 - (point.y / step) * 500;
        const command = index === 0 ? "M" : "L";
        return `${command} ${x} ${y}`;
      })
      .join(" ");

    return pathData;
  }, [trajectoryData, step, altitudeLevel]);

  return (
    // <div
    //   style={{
    //     position: "absolute",
    //     top: `calc(-${500 * (1 - clampedAlt)}vw + 100%)`,
    //     bottom: 0,
    //     width: "100vw",
    //     height: "500vw",
    //     zIndex: 10,
    //   }}
    // >
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: `calc(-${100 * (1 - clampedAlt)}vw + 100%)`,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 5,
      }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
        d={trajectoryPath}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeDasharray="1 1"
        opacity="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
    // </div>
  );
};

export default TrajectoryPath;
