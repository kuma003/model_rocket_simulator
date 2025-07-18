import type { SkyObject } from "./types";

export function calculateObjectPosition(
  object: SkyObject,
  currentAltitude: number,
  stepInterval: number,
  containerHeight: number
): { x: number; y: number; opacity: number } {
  const altitudeDiff = object.altitude - currentAltitude;
  const viewportRange = stepInterval * 2; // Objects visible within 2 step intervals
  
  // Calculate Y position based on altitude difference
  const relativePosition = altitudeDiff / viewportRange;
  const y = containerHeight * (0.5 - relativePosition);
  
  // Calculate opacity based on distance from current altitude
  const distanceRatio = Math.abs(altitudeDiff) / viewportRange;
  const opacity = Math.max(0, Math.min(1, 1 - distanceRatio));
  
  return {
    x: object.x,
    y: y,
    opacity: opacity,
  };
}

export function getVisibleObjects(
  objects: SkyObject[],
  currentAltitude: number,
  stepInterval: number
): SkyObject[] {
  const viewportRange = stepInterval * 2;
  const minAltitude = currentAltitude - viewportRange;
  const maxAltitude = currentAltitude + viewportRange;
  
  return objects.filter(
    (obj) => obj.altitude >= minAltitude && obj.altitude <= maxAltitude
  );
}

export function getObjectClassName(objectType: string): string {
  switch (objectType.toLowerCase()) {
    case "star":
      return "star";
    case "satellite":
      return "satellite";
    case "cloud":
      return "cloud";
    default:
      return "star";
  }
}

// Sample sky objects for demonstration
export const sampleSkyObjects: SkyObject[] = [
  // Low altitude objects
  { type: "cloud", altitude: 10, x: 20, icon: "☁️", size: 1.5 },
  { type: "cloud", altitude: 35, x: 70, icon: "☁️", size: 1.2 },
  { type: "cloud", altitude: 45, x: 15, icon: "☁️", size: 1.8 },
  
  // Mid altitude objects
  { type: "cloud", altitude: 80, x: 60, icon: "☁️", size: 1.3 },
  { type: "star", altitude: 120, x: 25, icon: "⭐", size: 0.8 },
  { type: "star", altitude: 135, x: 85, icon: "✨", size: 0.6 },
  
  // High altitude objects
  { type: "star", altitude: 180, x: 40, icon: "⭐", size: 1.0 },
  { type: "satellite", altitude: 200, x: 75, icon: "🛰️", size: 1.2 },
  { type: "star", altitude: 220, x: 10, icon: "✨", size: 0.7 },
  { type: "star", altitude: 250, x: 90, icon: "⭐", size: 0.9 },
  
  // Very high altitude objects
  { type: "star", altitude: 300, x: 30, icon: "⭐", size: 1.1 },
  { type: "satellite", altitude: 350, x: 65, icon: "🛰️", size: 1.0 },
  { type: "star", altitude: 400, x: 20, icon: "✨", size: 0.8 },
  { type: "star", altitude: 450, x: 80, icon: "⭐", size: 1.2 },
];