/**
 * Unit conversion utilities for the rocket simulator
 * Internal calculations use SI units (meters, kg, seconds)
 * User interface displays convenient units (cm, g, etc.)
 */

// Length conversions
export const LENGTH_UNITS = {
  METERS: 'm',
  CENTIMETERS: 'cm',
  MILLIMETERS: 'mm',
} as const;

export type LengthUnit = typeof LENGTH_UNITS[keyof typeof LENGTH_UNITS];

/**
 * Convert length from display units to SI units (meters)
 * @param value - Value in display units
 * @param fromUnit - Source unit
 * @returns Value in meters
 */
export const toSILength = (value: number, fromUnit: LengthUnit = LENGTH_UNITS.CENTIMETERS): number => {
  switch (fromUnit) {
    case LENGTH_UNITS.METERS:
      return value;
    case LENGTH_UNITS.CENTIMETERS:
      return value / 100;
    case LENGTH_UNITS.MILLIMETERS:
      return value / 1000;
    default:
      return value;
  }
};

/**
 * Convert length from SI units (meters) to display units
 * @param value - Value in meters
 * @param toUnit - Target unit
 * @returns Value in target unit
 */
export const fromSILength = (value: number, toUnit: LengthUnit = LENGTH_UNITS.CENTIMETERS): number => {
  switch (toUnit) {
    case LENGTH_UNITS.METERS:
      return value;
    case LENGTH_UNITS.CENTIMETERS:
      return value * 100;
    case LENGTH_UNITS.MILLIMETERS:
      return value * 1000;
    default:
      return value;
  }
};

// Mass conversions
export const MASS_UNITS = {
  KILOGRAMS: 'kg',
  GRAMS: 'g',
} as const;

export type MassUnit = typeof MASS_UNITS[keyof typeof MASS_UNITS];

/**
 * Convert mass from display units to SI units (kilograms)
 * @param value - Value in display units
 * @param fromUnit - Source unit
 * @returns Value in kilograms
 */
export const toSIMass = (value: number, fromUnit: MassUnit = MASS_UNITS.GRAMS): number => {
  switch (fromUnit) {
    case MASS_UNITS.KILOGRAMS:
      return value;
    case MASS_UNITS.GRAMS:
      return value / 1000;
    default:
      return value;
  }
};

/**
 * Convert mass from SI units (kilograms) to display units
 * @param value - Value in kilograms
 * @param toUnit - Target unit
 * @returns Value in target unit
 */
export const fromSIMass = (value: number, toUnit: MassUnit = MASS_UNITS.GRAMS): number => {
  switch (toUnit) {
    case MASS_UNITS.KILOGRAMS:
      return value;
    case MASS_UNITS.GRAMS:
      return value * 1000;
    default:
      return value;
  }
};

// Volume conversions
export const VOLUME_UNITS = {
  CUBIC_METERS: 'm³',
  CUBIC_CENTIMETERS: 'cm³',
  LITERS: 'L',
} as const;

export type VolumeUnit = typeof VOLUME_UNITS[keyof typeof VOLUME_UNITS];

/**
 * Convert volume from display units to SI units (cubic meters)
 * @param value - Value in display units
 * @param fromUnit - Source unit
 * @returns Value in cubic meters
 */
export const toSIVolume = (value: number, fromUnit: VolumeUnit = VOLUME_UNITS.CUBIC_CENTIMETERS): number => {
  switch (fromUnit) {
    case VOLUME_UNITS.CUBIC_METERS:
      return value;
    case VOLUME_UNITS.CUBIC_CENTIMETERS:
      return value / 1000000; // 1 m³ = 1,000,000 cm³
    case VOLUME_UNITS.LITERS:
      return value / 1000; // 1 m³ = 1,000 L
    default:
      return value;
  }
};

/**
 * Convert volume from SI units (cubic meters) to display units
 * @param value - Value in cubic meters
 * @param toUnit - Target unit
 * @returns Value in target unit
 */
export const fromSIVolume = (value: number, toUnit: VolumeUnit = VOLUME_UNITS.CUBIC_CENTIMETERS): number => {
  switch (toUnit) {
    case VOLUME_UNITS.CUBIC_METERS:
      return value;
    case VOLUME_UNITS.CUBIC_CENTIMETERS:
      return value * 1000000;
    case VOLUME_UNITS.LITERS:
      return value * 1000;
    default:
      return value;
  }
};

// Utility functions for rocket parameters
export interface RocketParamsDisplay {
  name: string;
  designer: string;
  nose: {
    length: number; // cm
    diameter: number; // cm
    thickness: number; // cm
    material: string;
    color: string;
    type: string;
  };
  body: {
    length: number; // cm
    diameter: number; // cm
    thickness: number; // cm
    material: string;
    color: string;
  };
  fins: {
    thickness: number; // cm
    material: string;
    color: string;
    count: number;
    offset: number; // cm
    type: string;
    // Type-specific properties in cm
    rootChord?: number;
    tipChord?: number;
    sweepLength?: number;
    height?: number;
    points?: { x: number; y: number }[];
  };
  engine: {
    name: string;
  };
}

export interface RocketParamsSI {
  name: string;
  designer: string;
  nose: {
    length: number; // m
    diameter: number; // m
    thickness: number; // m
    material: string;
    color: string;
    type: string;
  };
  body: {
    length: number; // m
    diameter: number; // m
    thickness: number; // m
    material: string;
    color: string;
  };
  fins: {
    thickness: number; // m
    material: string;
    color: string;
    count: number;
    offset: number; // m
    type: string;
    // Type-specific properties in m
    rootChord?: number;
    tipChord?: number;
    sweepLength?: number;
    height?: number;
    points?: { x: number; y: number }[];
  };
  engine: {
    name: string;
  };
}

/**
 * Convert rocket parameters from display units to SI units
 * @param params - Rocket parameters in display units
 * @returns Rocket parameters in SI units
 */
export const toSIRocketParams = (params: RocketParamsDisplay): RocketParamsSI => {
  const result: RocketParamsSI = {
    name: params.name,
    designer: params.designer,
    nose: {
      length: toSILength(params.nose.length),
      diameter: toSILength(params.nose.diameter),
      thickness: toSILength(params.nose.thickness),
      material: params.nose.material,
      color: params.nose.color,
      type: params.nose.type,
    },
    body: {
      length: toSILength(params.body.length),
      diameter: toSILength(params.body.diameter),
      thickness: toSILength(params.body.thickness),
      material: params.body.material,
      color: params.body.color,
    },
    fins: {
      thickness: toSILength(params.fins.thickness),
      material: params.fins.material,
      color: params.fins.color,
      count: params.fins.count,
      offset: toSILength(params.fins.offset),
      type: params.fins.type,
    },
    engine: {
      name: params.engine.name,
    },
  };

  // Convert type-specific properties
  if (params.fins.rootChord !== undefined) {
    result.fins.rootChord = toSILength(params.fins.rootChord);
  }
  if (params.fins.tipChord !== undefined) {
    result.fins.tipChord = toSILength(params.fins.tipChord);
  }
  if (params.fins.sweepLength !== undefined) {
    result.fins.sweepLength = toSILength(params.fins.sweepLength);
  }
  if (params.fins.height !== undefined) {
    result.fins.height = toSILength(params.fins.height);
  }
  if (params.fins.points !== undefined) {
    result.fins.points = params.fins.points.map(point => ({
      x: toSILength(point.x),
      y: toSILength(point.y),
    }));
  }

  return result;
};

/**
 * Convert rocket parameters from SI units to display units
 * @param params - Rocket parameters in SI units
 * @returns Rocket parameters in display units
 */
export const fromSIRocketParams = (params: RocketParamsSI): RocketParamsDisplay => {
  const result: RocketParamsDisplay = {
    name: params.name,
    designer: params.designer,
    nose: {
      length: fromSILength(params.nose.length),
      diameter: fromSILength(params.nose.diameter),
      thickness: fromSILength(params.nose.thickness),
      material: params.nose.material,
      color: params.nose.color,
      type: params.nose.type,
    },
    body: {
      length: fromSILength(params.body.length),
      diameter: fromSILength(params.body.diameter),
      thickness: fromSILength(params.body.thickness),
      material: params.body.material,
      color: params.body.color,
    },
    fins: {
      thickness: fromSILength(params.fins.thickness),
      material: params.fins.material,
      color: params.fins.color,
      count: params.fins.count,
      offset: fromSILength(params.fins.offset),
      type: params.fins.type,
    },
    engine: {
      name: params.engine.name,
    },
  };

  // Convert type-specific properties
  if (params.fins.rootChord !== undefined) {
    result.fins.rootChord = fromSILength(params.fins.rootChord);
  }
  if (params.fins.tipChord !== undefined) {
    result.fins.tipChord = fromSILength(params.fins.tipChord);
  }
  if (params.fins.sweepLength !== undefined) {
    result.fins.sweepLength = fromSILength(params.fins.sweepLength);
  }
  if (params.fins.height !== undefined) {
    result.fins.height = fromSILength(params.fins.height);
  }
  if (params.fins.points !== undefined) {
    result.fins.points = params.fins.points.map(point => ({
      x: fromSILength(point.x),
      y: fromSILength(point.y),
    }));
  }

  return result;
};

/**
 * Format a number with appropriate precision for display
 * @param value - The number to format
 * @param decimals - Number of decimal places
 * @returns Formatted string
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

/**
 * Get the appropriate unit label for display
 * @param unitType - The type of unit
 * @returns Unit label string
 */
export const getUnitLabel = (unitType: 'length' | 'mass' | 'volume'): string => {
  switch (unitType) {
    case 'length':
      return LENGTH_UNITS.CENTIMETERS;
    case 'mass':
      return MASS_UNITS.GRAMS;
    case 'volume':
      return VOLUME_UNITS.CUBIC_CENTIMETERS;
    default:
      return '';
  }
};