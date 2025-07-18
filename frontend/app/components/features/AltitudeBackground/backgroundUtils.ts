import type { BackgroundSegment } from "./types";

export function createBackgroundSegments(stepInterval: number): BackgroundSegment[] {
  return [
    {
      minAltitude: 0,
      maxAltitude: stepInterval,
      imagePath: "/0-50.png",
    },
    {
      minAltitude: stepInterval,
      maxAltitude: stepInterval * 2,
      imagePath: "/50-100.png",
    },
    {
      minAltitude: stepInterval * 2,
      maxAltitude: stepInterval * 3,
      imagePath: "/100-150.png",
    },
    {
      minAltitude: stepInterval * 3,
      maxAltitude: Infinity,
      imagePath: "/150-.png",
      isRepeating: true,
    },
  ];
}

export function getCurrentBackgroundSegment(
  altitude: number,
  segments: BackgroundSegment[]
): BackgroundSegment | null {
  return segments.find(
    (segment) => altitude >= segment.minAltitude && altitude < segment.maxAltitude
  ) || null;
}

export function calculateBackgroundPosition(
  altitude: number,
  segment: BackgroundSegment,
  stepInterval: number
): number {
  if (segment.isRepeating) {
    // For repeating segments (150m+), calculate position within the repeating cycle
    const cycleAltitude = altitude - segment.minAltitude;
    const cyclePosition = (cycleAltitude % stepInterval) / stepInterval;
    return cyclePosition * 100;
  } else {
    // For normal segments, calculate position within the segment
    const segmentProgress = (altitude - segment.minAltitude) / (segment.maxAltitude - segment.minAltitude);
    return segmentProgress * 100;
  }
}

export function getBackgroundStyle(
  altitude: number,
  stepInterval: number,
  containerHeight: number
): { backgroundImage: string; backgroundPosition: string } {
  const segments = createBackgroundSegments(stepInterval);
  const currentSegment = getCurrentBackgroundSegment(altitude, segments);
  
  if (!currentSegment) {
    return {
      backgroundImage: `url(${segments[0].imagePath})`,
      backgroundPosition: "center bottom",
    };
  }

  const positionPercent = calculateBackgroundPosition(altitude, currentSegment, stepInterval);
  
  return {
    backgroundImage: `url(${currentSegment.imagePath})`,
    backgroundPosition: `center ${100 - positionPercent}%`,
  };
}