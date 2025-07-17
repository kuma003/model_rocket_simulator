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

// Note: RocketParams interface now uses SI units directly
// These legacy conversion functions are kept for backward compatibility

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