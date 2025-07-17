import React from "react";

/**
 * Props for CenterOfGravityMarker component
 * @interface CenterOfGravityMarkerProps
 * @property {number} [size=8] - Radius of the marker in pixels
 * @property {string} [color="#FF0000"] - Color of the marker
 * @property {boolean} [showLabel=true] - Whether to show the "CG" label
 * @property {number} [labelOffset=12] - Horizontal offset for the label
 */
interface CenterOfGravityMarkerProps {
  size?: number;
  color?: string;
  showLabel?: boolean;
  labelOffset?: number;
}

/**
 * Engineering standard center of gravity marker
 * @component
 * @param {CenterOfGravityMarkerProps} props - Component properties
 * @returns {JSX.Element} Center of gravity marker with filled alternating quadrants
 * @description
 * Renders a standard engineering symbol for center of gravity with:
 * - Circle outline
 * - Filled 1st and 3rd quadrants (upper-right and lower-left)
 * - Optional "CG" label
 */
export const CenterOfGravityMarker: React.FC<CenterOfGravityMarkerProps> = ({
  size = 8,
  color = "#FF0000",
  showLabel = true,
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
      {showLabel && (
        <text
          x={labelOffset}
          y="0"
          dy="0.35em"
          fontSize="12"
          fill={color}
          fontWeight="bold"
        >
          CG
        </text>
      )}
    </g>
  );
};

/**
 * Props for CenterOfPressureMarker component
 * @interface CenterOfPressureMarkerProps
 * @property {number} [size=8] - Radius of the marker in pixels
 * @property {string} [color="#0000FF"] - Color of the marker
 * @property {boolean} [showLabel=true] - Whether to show the "CP" label
 * @property {number} [labelOffset=12] - Horizontal offset for the label
 */
interface CenterOfPressureMarkerProps {
  size?: number;
  color?: string;
  showLabel?: boolean;
  labelOffset?: number;
}

/**
 * Center of pressure marker based on center of gravity design
 * @component
 * @param {CenterOfPressureMarkerProps} props - Component properties
 * @returns {JSX.Element} Center of pressure marker with filled alternating quadrants
 * @description
 * Renders a marker for center of pressure using the same design as CG marker but in blue:
 * - Circle outline
 * - Filled 1st and 3rd quadrants (upper-right and lower-left)
 * - Optional "CP" label
 */
export const CenterOfPressureMarker: React.FC<CenterOfPressureMarkerProps> = ({
  size = 8,
  color = "#0000FF",
  showLabel = true,
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
      {showLabel && (
        <text
          x={labelOffset}
          y="0"
          dy="0.35em"
          fontSize="12"
          fill={color}
          fontWeight="bold"
        >
          CP
        </text>
      )}
    </g>
  );
};

/**
 * Props for generic CenterMarker component
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
 * Generic center marker with customizable label
 * @component
 * @param {CenterMarkerProps} props - Component properties
 * @returns {JSX.Element} Generic center marker with filled alternating quadrants
 * @description
 * Renders a generic center marker that can be customized for various uses:
 * - Circle outline
 * - Filled 1st and 3rd quadrants (upper-right and lower-left)
 * - Customizable label and color
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