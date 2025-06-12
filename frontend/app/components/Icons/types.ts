import React from "react";
import styles from "./types.module.scss";

export interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export interface StrokeIconProps extends IconProps {
  strokeWidth?: number;
}

export interface FilledIconProps extends IconProps {}
