import React, { useMemo } from "react";
import type { RocketTrajectory } from "~/utils/calculations/4DoF";

interface TrajectoryPathProps {
  trajectoryData: RocketTrajectory;
  index: number;
  step: number;
}

const TrajectoryPath: React.FC<TrajectoryPathProps> = ({
  trajectoryData,
  index,
  step,
}) => {
  if (index < 0) index = 0;
  if (index >= trajectoryData.position.length) {
    index = trajectoryData.position.length - 1;
  }
  const altitude = trajectoryData.position[index].y; // y position in meters
  const horizontalDisplacement = trajectoryData.position[index].x; // x position in meters
  const altitudeLevel = altitude / step;

  function clampedAltitude(altLevel: number): number {
    if (altLevel < 0) return 0;
    else if (altLevel < 3) return altLevel;
    else return altLevel - Math.floor(altLevel) + 3;
  }

  const clampedAlt = clampedAltitude(altitudeLevel);

  const trajectoryPath = useMemo(() => {
    if (!trajectoryData || trajectoryData.position.length < 2) return "";

    const pathData = trajectoryData.position
      .map((point, index) => {
        // x position: screen center (50%) + horizontal displacement scaled by step
        const x = 512 + (point.x / step) * 5120;
        // y position: from bottom - altitude offset, matching background behavior
        const y = 512 - (point.y / step) * 5120;
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
        left: `-${(horizontalDisplacement / step) * 500}vw `,
        top: `calc(${500 * clampedAlt}vw + 0%)`,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 5,
        overflow: "visible",
      }}
      viewBox="0 0 1024 1024"
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
