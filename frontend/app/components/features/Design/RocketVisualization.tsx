import React, { useMemo } from "react";
import type { RocketParams } from "../Rocket/types";
import type { RocketProperties } from "../../../utils/calculations/simulationEngine";
import RocketComponent from "./RocketComponent";
import styles from "./rocketVisualization.module.scss";

/**
 * Props for RocketVisualization component
 * @interface RocketVisualizationProps
 * @property {RocketParams} rocketParams - Rocket design parameters
 * @property {RocketProperties} rocketProperties - Calculated rocket properties
 * @property {number} [pitchAngle=0] - Pitch angle in degrees
 * @property {number} [rollAngle=0] - Roll angle in degrees
 * @property {boolean} [showCenterMarkers=false] - Whether to show center markers
 */
interface RocketVisualizationProps {
  rocketParams: RocketParams;
  rocketProperties: RocketProperties;
  pitchAngle?: number;
  rollAngle?: number;
  showCenterMarkers?: boolean;
}

/**
 * React component for visualizing rocket design with proper scaling and layout
 * @component
 * @param {RocketVisualizationProps} props - Component properties
 * @returns {JSX.Element} Styled rocket visualization with scale information
 * @description
 * Renders a rocket design with automatic scaling to fit the container,
 * displays scale information, and applies proper styling for better presentation.
 */
const RocketVisualization: React.FC<RocketVisualizationProps> = ({
  rocketParams,
  rocketProperties,
  pitchAngle = 0,
  rollAngle = 0,
  showCenterMarkers = false,
}) => {
  const { nose, body, fins } = rocketParams;

  // Calculate dimensions and scaling (using meter units)
  const { totalHeightM, scale, svgWidth, svgHeight } = useMemo(() => {
    const totalHeightM = nose.length + body.length;
    const totalWidthM = body.diameter;

    // Target SVG dimensions
    const targetHeight = 800;
    const targetWidth = 500;

    // Calculate scale based on dimensions (pixels per meter)
    const scaleByHeight = targetHeight / totalHeightM;
    const scaleByWidth = targetWidth / totalWidthM;
    const scale = Math.min(scaleByHeight, scaleByWidth) * 0.8; // 80% to leave margin

    // Calculate actual SVG dimensions
    const svgWidth = Math.max(targetWidth, totalWidthM * scale + 40); // 40px margin
    const svgHeight = Math.max(targetHeight, totalHeightM * scale + 40); // 40px margin

    return {
      totalHeightM,
      scale,
      svgWidth,
      svgHeight,
    };
  }, [nose.length, body.length, body.diameter, fins]);

  // ロケットを中央配置するためのオフセット計算
  const finChord =
    fins.type === "trapozoidal" ? Math.max(fins.rootChord, fins.tipChord) : 0;
  const bodyWidth = body.diameter * scale;

  const rocketWidth = Math.max(bodyWidth, 200);
  const rocketHeight = totalHeightM * scale;

  const rocketOffsetX = (svgWidth - rocketWidth) / 2;
  const rocketOffsetY = (svgHeight - rocketHeight) / 2;

  return (
    <div>
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        <g transform={`translate(${rocketOffsetX}, ${rocketOffsetY})`}>
          <RocketComponent
            rocketParams={rocketParams}
            rocketProperties={rocketProperties}
            scale={scale}
            pitchAngle={pitchAngle}
            rollAngle={rollAngle}
            showCenterMarkers={showCenterMarkers}
          />
        </g>
      </svg>
    </div>
  );
};

export default RocketVisualization;
