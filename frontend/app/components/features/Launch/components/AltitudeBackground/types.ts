export interface SkyObject {
  type: string;
  altitude: number;
  x: number;
  icon: string;
  size?: number;
  opacity?: number;
}

export interface AltitudeBackgroundProps {
  altitudeLevel: number;
}

export interface BackgroundSegment {
  minAltitude: number;
  maxAltitude: number;
  imagePath: string;
  isRepeating?: boolean;
}
