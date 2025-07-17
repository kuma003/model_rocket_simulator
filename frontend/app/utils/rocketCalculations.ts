/**
 * Rocket calculation utilities using SI units
 * All calculations are performed in SI units (meters, kg, seconds)
 */

import { Materials, type RocketParams } from "~/components/features/Rocket/types";

/**
 * Calculate the volume of a component given its dimensions
 * @param length - Length in meters
 * @param diameter - Diameter in meters
 * @param thickness - Wall thickness in meters
 * @returns Volume in cubic meters
 */
export const calculateComponentVolume = (length: number, diameter: number, thickness: number): number => {
  const outerRadius = diameter / 2;
  const innerRadius = outerRadius - thickness;
  
  // Volume of cylindrical shell
  const outerVolume = Math.PI * outerRadius * outerRadius * length;
  const innerVolume = Math.PI * innerRadius * innerRadius * length;
  
  return outerVolume - innerVolume;
};

/**
 * Calculate the mass of a component given its volume and material
 * @param volume - Volume in cubic meters
 * @param material - Material type
 * @returns Mass in kilograms
 */
export const calculateComponentMass = (volume: number, material: keyof typeof Materials): number => {
  const density = Materials[material].density; // kg/m³
  return volume * density;
};

/**
 * Calculate the volume of a conical nose cone
 * @param length - Length in meters
 * @param diameter - Diameter in meters
 * @param thickness - Wall thickness in meters
 * @returns Volume in cubic meters
 */
export const calculateNoseVolume = (length: number, diameter: number, thickness: number): number => {
  const outerRadius = diameter / 2;
  const innerRadius = outerRadius - thickness;
  
  // Volume of conical shell
  const outerVolume = (Math.PI * outerRadius * outerRadius * length) / 3;
  const innerVolume = (Math.PI * innerRadius * innerRadius * length) / 3;
  
  return outerVolume - innerVolume;
};

/**
 * Calculate the total mass of the rocket
 * @param params - Rocket parameters in SI units
 * @returns Total mass in kilograms
 */
export const calculateTotalMass = (params: RocketParams): number => {
  // Parameters are already in SI units
  
  // Calculate nose mass
  const noseVolume = calculateNoseVolume(
    params.nose.length,
    params.nose.diameter,
    params.nose.thickness
  );
  const noseMass = calculateComponentMass(noseVolume, params.nose.material as keyof typeof Materials);
  
  // Calculate body mass
  const bodyVolume = calculateComponentVolume(
    params.body.length,
    params.body.diameter,
    params.body.thickness
  );
  const bodyMass = calculateComponentMass(bodyVolume, params.body.material as keyof typeof Materials);
  
  // Calculate fins mass
  let finsMass = 0;
  if (params.fins.type === "trapozoidal") {
    const fins = params.fins as any;
    const finArea = ((fins.rootChord + fins.tipChord) * fins.height) / 2;
    const finVolume = finArea * params.fins.thickness;
    finsMass = calculateComponentMass(finVolume, params.fins.material as keyof typeof Materials) * params.fins.count;
  } else if (params.fins.type === "elliptical") {
    const fins = params.fins as any;
    const finArea = (Math.PI * fins.rootChord * fins.height) / 4;
    const finVolume = finArea * params.fins.thickness;
    finsMass = calculateComponentMass(finVolume, params.fins.material as keyof typeof Materials) * params.fins.count;
  } else if (params.fins.type === "freedom") {
    // For freedom fins, approximate area using shoelace formula
    const fins = params.fins as any;
    const points = fins.points || [];
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    area = Math.abs(area) / 2;
    const finVolume = area * params.fins.thickness;
    finsMass = calculateComponentMass(finVolume, params.fins.material as keyof typeof Materials) * params.fins.count;
  }
  
  return noseMass + bodyMass + finsMass;
};

/**
 * Calculate the center of gravity of the rocket
 * @param params - Rocket parameters in SI units
 * @returns Center of gravity position from nose tip in meters
 */
export const calculateCenterOfGravity = (params: RocketParams): number => {
  // Parameters are already in SI units
  
  // Calculate component masses and their CG positions
  const noseVolume = calculateNoseVolume(
    params.nose.length,
    params.nose.diameter,
    params.nose.thickness
  );
  const noseMass = calculateComponentMass(noseVolume, params.nose.material as keyof typeof Materials);
  const noseCG = params.nose.length * 0.6; // CG of cone is at 60% of length
  
  const bodyVolume = calculateComponentVolume(
    params.body.length,
    params.body.diameter,
    params.body.thickness
  );
  const bodyMass = calculateComponentMass(bodyVolume, params.body.material as keyof typeof Materials);
  const bodyCG = params.nose.length + params.body.length / 2; // CG at middle of body
  
  // For fins, assume CG is at the geometric center
  let finsMass = 0;
  let finsCG = 0;
  if (params.fins.type === "trapozoidal") {
    const fins = params.fins as any;
    const finArea = ((fins.rootChord + fins.tipChord) * fins.height) / 2;
    const finVolume = finArea * params.fins.thickness;
    finsMass = calculateComponentMass(finVolume, params.fins.material as keyof typeof Materials) * params.fins.count;
    finsCG = params.nose.length + params.body.length - params.fins.offset + fins.rootChord / 3;
  } else if (params.fins.type === "elliptical") {
    const fins = params.fins as any;
    const finArea = (Math.PI * fins.rootChord * fins.height) / 4;
    const finVolume = finArea * params.fins.thickness;
    finsMass = calculateComponentMass(finVolume, params.fins.material as keyof typeof Materials) * params.fins.count;
    finsCG = params.nose.length + params.body.length - params.fins.offset + fins.rootChord / 2;
  }
  
  // Calculate weighted average
  const totalMass = noseMass + bodyMass + finsMass;
  const totalMoment = noseMass * noseCG + bodyMass * bodyCG + finsMass * finsCG;
  
  return totalMoment / totalMass;
};

/**
 * Calculate the center of pressure (simplified)
 * @param params - Rocket parameters in SI units
 * @returns Center of pressure position from nose tip in meters
 */
export const calculateCenterOfPressure = (params: RocketParams): number => {
  // Simplified CP calculation
  // For a basic rocket, CP is typically around 60-70% of total length
  const totalLength = params.nose.length + params.body.length;
  return totalLength * 0.65;
};

/**
 * Calculate stability margin
 * @param params - Rocket parameters in SI units
 * @returns Stability margin (positive = stable, negative = unstable)
 */
export const calculateStabilityMargin = (params: RocketParams): number => {
  const cg = calculateCenterOfGravity(params);
  const cp = calculateCenterOfPressure(params);
  
  // Stability margin = (CP - CG) / diameter
  const diameter = params.body.diameter;
  
  return (cp - cg) / diameter;
};