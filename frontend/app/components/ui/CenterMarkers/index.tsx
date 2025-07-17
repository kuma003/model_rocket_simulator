import React from "react";

/**
 * Props for CenterMarker component
 * @interface CenterMarkerProps
 * @property {number} [size=8] - Radius of the marker in pixels
 * @property {string} [color="#FF0000"] - Color of the marker
 * @property {boolean} [showLabel=true] - Whether to show the label
 * @property {string} [label=""] - Custom label text
 * @property {number} [labelOffset=12] - Horizontal offset for the label
 */
interface CenterMarkerProps {
  size?: number;
  color?: string;
  showLabel?: boolean;
  label?: string;
  labelOffset?: number;
}

/**
 * Engineering standard center marker with customizable color and label
 * @component
 * @param {CenterMarkerProps} props - Component properties
 * @returns {JSX.Element} Center marker with filled alternating quadrants
 * @description
 * Renders a standard engineering symbol for center markers with:
 * - Circle outline
 * - Filled 1st and 3rd quadrants (upper-right and lower-left)
 * - Customizable color and label
 * - Suitable for CG, CP, and other center point markers
 * @example
 * ```tsx
 * // Center of Gravity marker
 * <CenterMarker color="#FF0000" label="CG" />
 * 
 * // Center of Pressure marker
 * <CenterMarker color="#0000FF" label="CP" />
 * 
 * // Custom center marker
 * <CenterMarker color="#00AA00" label="CM" />
 * ```
 */
export const CenterMarker: React.FC<CenterMarkerProps> = ({
  size = 8,
  color = "#FF0000",
  showLabel = true,
  label = "",
  labelOffset = 12,
}) => {
  return (
    <g>
      <circle
        cx="0"
        cy="0"
        r={size}
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      {/* 第1象限（右上）の塗りつぶし */}
      <path 
        d={`M 0 0 L ${size} 0 A ${size} ${size} 0 0 0 0 -${size} Z`} 
        fill={color} 
      />
      {/* 第3象限（左下）の塗りつぶし */}
      <path 
        d={`M 0 0 L -${size} 0 A ${size} ${size} 0 0 0 0 ${size} Z`} 
        fill={color} 
      />
      {showLabel && label && (
        <text
          x={labelOffset}
          y="0"
          dy="0.35em"
          fontSize="12"
          fill={color}
          fontWeight="bold"
        >
          {label}
        </text>
      )}
    </g>
  );
};

/**
 * Convenience component for Center of Gravity marker
 * @component
 * @param {Omit<CenterMarkerProps, "label">} props - Component properties (excluding label)
 * @returns {JSX.Element} Center of Gravity marker with red color and "CG" label
 */
export const CenterOfGravityMarker: React.FC<Omit<CenterMarkerProps, "label">> = (props) => (
  <CenterMarker {...props} color={props.color || "#FF0000"} label="CG" />
);

/**
 * Convenience component for Center of Pressure marker
 * @component
 * @param {Omit<CenterMarkerProps, "label">} props - Component properties (excluding label)
 * @returns {JSX.Element} Center of Pressure marker with blue color and "CP" label
 */
export const CenterOfPressureMarker: React.FC<Omit<CenterMarkerProps, "label">> = (props) => (
  <CenterMarker {...props} color={props.color || "#0000FF"} label="CP" />
);