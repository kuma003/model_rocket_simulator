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

export interface BackgroundLayer {
  imagePath: string;
  top: number;
  height: number;
  zIndex: number;
}

export function getBackgroundLayers(
  altitude: number,
  stepInterval: number,
  containerHeight: number
): BackgroundLayer[] {
  const segments = createBackgroundSegments(stepInterval);
  const layers: BackgroundLayer[] = [];

  // Calculate scroll amount: altitude / stepInterval = number of images scrolled
  const scrollAmount = altitude / stepInterval;

  // Create layers for all segments that might be visible
  segments.forEach((segment, index) => {
    let imagePath = segment.imagePath;
    
    // For repeating segments (150m+), we need to handle multiple copies
    if (segment.isRepeating && scrollAmount >= 3) {
      // Calculate how many additional copies we need
      const additionalCopies = Math.floor(scrollAmount - 3);
      
      // Add multiple copies of the repeating image
      for (let copyIndex = 0; copyIndex <= additionalCopies + 1; copyIndex++) {
        const layerIndex = 3 + copyIndex;
        const layerTop = layerIndex * containerHeight - scrollAmount * containerHeight;
        
        // Only add if the layer might be visible
        if (layerTop > -containerHeight && layerTop < containerHeight * 2) {
          layers.push({
            imagePath,
            top: layerTop,
            height: containerHeight,
            zIndex: 1,
          });
        }
      }
    } else if (!segment.isRepeating) {
      // Normal segments - calculate position
      // Each image starts at its index position, then moves down by scrollAmount
      const layerTop = index * containerHeight - scrollAmount * containerHeight;
      
      // Only add if the layer might be visible
      if (layerTop > -containerHeight && layerTop < containerHeight * 2) {
        layers.push({
          imagePath,
          top: layerTop,
          height: containerHeight,
          zIndex: 1,
        });
      }
    }
  });

  return layers;
}