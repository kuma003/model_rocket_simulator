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
 * @property {boolean} [showPayload=false] - Whether to show payload section
 * @property {number} [targetWidth] - Target width in pixels (defaults to 500)
 * @property {number} [targetHeight] - Target height in pixels (defaults to 800)
 * @property {number} [referenceLength] - Reference rocket length for consistent scaling across multiple rockets
 * @property {number} [fixedScale] - Fixed scale value to override automatic scaling
 * @property {number} [marginPercent=0.8] - Margin percentage for automatic scaling (0.8 = 80% of container)
 * @property {boolean} [isGhost=false] - Whether to render as ghost/transparent for rival rockets
 */
interface RocketVisualizationProps {
  rocketParams: RocketParams;
  rocketProperties: RocketProperties;
  pitchAngle?: number;
  rollAngle?: number;
  showCenterMarkers?: boolean;
  showPayload?: boolean;
  targetWidth?: number;
  targetHeight?: number;
  referenceLength?: number;
  fixedScale?: number;
  marginPercent?: number;
  isGhost?: boolean;
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
  showPayload = false,
  targetWidth = 800,
  targetHeight = 800,
  referenceLength,
  fixedScale,
  marginPercent = 0.8,
  isGhost = false,
}) => {
  const { nose, body, fins } = rocketParams;

  // Calculate dimensions and scaling (using meter units)
  const { totalHeightM, scale, svgWidth, svgHeight } = useMemo(() => {
    const totalHeightM = nose.length + body.length;
    const totalWidthM = body.diameter;

    // Use reference length for consistent scaling across multiple rockets
    const lengthForScaling = referenceLength || totalHeightM;

    let calculatedScale: number;

    if (fixedScale !== undefined) {
      // Use fixed scale if provided
      calculatedScale = fixedScale;
    } else {
      // Calculate scale based on dimensions (pixels per meter)
      const scaleByHeight = targetHeight / lengthForScaling;
      const scaleByWidth = targetWidth / totalWidthM;
      calculatedScale = Math.min(scaleByHeight, scaleByWidth);
    }

    // Calculate actual SVG dimensions with margin
    const marginPx = 40;
    const rocketWidthPx = totalWidthM * calculatedScale;
    const rocketHeightPx = totalHeightM * calculatedScale;

    const svgWidth = Math.max(targetWidth, rocketWidthPx + marginPx);
    const svgHeight = Math.max(targetHeight, rocketHeightPx + marginPx);

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
    marginPercent,
  ]);

  // ロケットを中央配置するためのオフセット計算
  const finExtension =
    fins.type === "trapozoidal" || fins.type === "elliptical"
      ? fins.height * scale
      : fins.type === "freedom"
        ? Math.max(...fins.points.map((p) => p.x)) * scale
        : 0;
  const bodyWidth = body.diameter * scale;

  const rocketWidth = Math.max(bodyWidth, bodyWidth + finExtension * 2);
  const rocketHeight = totalHeightM * scale;

  const rocketOffsetX = (svgWidth - rocketWidth) / 2;
  const rocketOffsetY = (svgHeight - rocketHeight) / 2;

  return (
    <div>
      <svg
        width={Math.max(svgWidth, svgHeight)}
        height={Math.max(svgWidth, svgHeight)}
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
            isGhost={isGhost}
          />
        </g>
      </svg>
    </div>
  );
};

export default RocketVisualization;
