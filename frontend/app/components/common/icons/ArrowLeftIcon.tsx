import React from "react";

interface ArrowLeftIconProps {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * Arrow Left Icon Component
 * Based on Tabler Icons arrow-left
 */
const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = ({ 
  size = 24, 
  color = "currentColor",
  className 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 12l14 0" />
      <path d="M5 12l6 6" />
      <path d="M5 12l6 -6" />
    </svg>
  );
};

export default ArrowLeftIcon;