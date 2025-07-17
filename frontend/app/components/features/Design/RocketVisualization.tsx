import React, { useMemo } from "react";
import type { RocketParams } from "../Rocket/types";
import RocketComponent from "./RocketComponent";
import styles from "./rocketVisualization.module.scss";

/**
 * Props for RocketVisualization component
 * @interface RocketVisualizationProps
 * @property {RocketParams} rocketParams - Rocket design parameters
 * @property {number} [pitchAngle=0] - Pitch angle in degrees
 * @property {number} [rollAngle=0] - Roll angle in degrees
 * @property {boolean} [showCenterMarkers=false] - Whether to show center markers
 */
interface RocketVisualizationProps {
  rocketParams: RocketParams;
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
  pitchAngle = 0,
  rollAngle = 0,
  showCenterMarkers = false,
}) => {
  const { nose, body, fins } = rocketParams;

  // Calculate dimensions and scaling
  const { totalHeightCM, scale, svgWidth, svgHeight } = useMemo(() => {
    const totalHeightCM = nose.length + body.length;
    const finHeight = fins.type === "trapozoidal" ? fins.height : 0;
    const finChord =
      fins.type === "trapozoidal" ? Math.max(fins.rootChord, fins.tipChord) : 0;
    const totalWidthCM = body.diameter + finChord;

    // Target SVG dimensions
    const targetHeight = 800;
    const targetWidth = 500;

    // Calculate scale based on dimensions
    const scaleByHeight = targetHeight / (totalHeightCM + finHeight);
    const scaleByWidth = targetWidth / totalWidthCM;
    const scale = Math.min(scaleByHeight, scaleByWidth) * 0.8; // 80% to leave margin

    // Calculate actual SVG dimensions
    const svgWidth = Math.max(targetWidth, totalWidthCM * scale + 40); // 40px margin
    const svgHeight = Math.max(
      targetHeight,
      (totalHeightCM + finHeight) * scale + 40
    ); // 40px margin

    return {
      totalHeightCM,
      scale,
      svgWidth,
      svgHeight,
    };
  }, [nose.length, body.length, body.diameter, fins]);

  // ロケットを中央配置するためのオフセット計算
  const finChord = fins.type === "trapozoidal" ? Math.max(fins.rootChord, fins.tipChord) : 0;
  const bodyWidth = body.diameter * scale;
  const finRootChord = fins.type === "trapozoidal" ? fins.rootChord * scale : 0;
  
  // RocketComponentと同じ計算を使用
  const rocketWidth = Math.max(bodyWidth + finRootChord, 200);
  const rocketHeight = (totalHeightCM + (fins.type === "trapozoidal" ? fins.height : 0)) * scale;
  
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
