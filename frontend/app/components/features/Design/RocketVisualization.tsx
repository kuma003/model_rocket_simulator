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
 * @property {number} [targetWidth] - Target width in pixels (defaults to 500)
 * @property {number} [targetHeight] - Target height in pixels (defaults to 800)
 * @property {number} [referenceLength] - Reference rocket length for consistent scaling across multiple rockets
 * @property {number} [fixedScale] - Fixed scale value to override automatic scaling
 * @property {number} [marginPercent=0.8] - Margin percentage for automatic scaling (0.8 = 80% of container)
 */
interface RocketVisualizationProps {
  rocketParams: RocketParams;
  rocketProperties: RocketProperties;
  pitchAngle?: number;
  rollAngle?: number;
  showCenterMarkers?: boolean;
  targetWidth?: number;
  targetHeight?: number;
  referenceLength?: number;
  fixedScale?: number;
  marginPercent?: number;
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
  targetWidth = 500,
  targetHeight = 800,
  referenceLength,
  fixedScale,
  marginPercent = 0.8,
}) => {
  const { nose, body, fins } = rocketParams;

  // Calculate dimensions and scaling (using meter units)
  const { totalHeightM, scale, svgWidth, svgHeight } = useMemo(() => {
    const totalHeightM = nose.length + body.length;
    
    // Calculate actual rocket width considering fins
    let totalWidthM = body.diameter;
    if (fins.type === "trapozoidal" || fins.type === "elliptical") {
      // Add fin protrusion to both sides
      totalWidthM = body.diameter + (fins.height * 2);
    } else if (fins.type === "freedom" && fins.points.length > 0) {
      const maxFinX = Math.max(...fins.points.map(p => p.x));
      totalWidthM = body.diameter + (maxFinX * 2);
    }
    
    // Use reference length for consistent scaling across multiple rockets
    const lengthForScaling = referenceLength || totalHeightM;
    const widthForScaling = totalWidthM;

    let calculatedScale: number;
    
    if (fixedScale !== undefined) {
      // Use fixed scale if provided
      calculatedScale = fixedScale;
    } else {
      // Calculate scale based on dimensions to maximize usage of available space
      const scaleByHeight = (targetHeight * marginPercent) / lengthForScaling;
      const scaleByWidth = (targetWidth * marginPercent) / widthForScaling;
      calculatedScale = Math.min(scaleByHeight, scaleByWidth);
    }

    // Calculate actual SVG dimensions
    const rocketWidthPx = totalWidthM * calculatedScale;
    const rocketHeightPx = totalHeightM * calculatedScale;
    
    // Use target dimensions or calculated minimum size
    const svgWidth = Math.max(targetWidth, rocketWidthPx + 40);
    const svgHeight = Math.max(targetHeight, rocketHeightPx + 40);

    return {
      totalHeightM,
      scale: calculatedScale,
      svgWidth,
      svgHeight,
    };
  }, [
    nose.length, 
    body.length, 
    body.diameter, 
    fins, 
    targetWidth, 
    targetHeight, 
    referenceLength, 
    fixedScale, 
    marginPercent
  ]);

  // ロケットを中央配置するためのオフセット計算
  const finMaxWidth = useMemo(() => {
    let maxFinWidth = 0;
    if (fins.type === "trapozoidal" || fins.type === "elliptical") {
      maxFinWidth = fins.height * scale * 1.5; // フィンの最大突出幅を估算
    } else if (fins.type === "freedom" && fins.points.length > 0) {
      const maxX = Math.max(...fins.points.map(p => p.x));
      maxFinWidth = maxX * scale;
    }
    return maxFinWidth;
  }, [fins, scale]);
  
  const bodyWidth = body.diameter * scale;
  const rocketWidth = Math.max(bodyWidth, bodyWidth + finMaxWidth);
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
