export interface SkyObject {
  type: string;
  altitude: number;
  x: number;
  icon: string;
  size?: number;
  opacity?: number;
}

export interface AltitudeBackgroundProps {
  altitude: number;
  stepInterval?: number;
  objects?: SkyObject[];
  containerHeight: number;
  containerWidth: number;
}

export interface BackgroundSegment {
  minAltitude: number;
  maxAltitude: number;
  imagePath: string;
  isRepeating?: boolean;
}