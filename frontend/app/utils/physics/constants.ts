export const PHYSICS_CONSTANTS = {
  REF_VEL: 30, // reference velocity in m/s
  NU_AIR: 15.01e-6, // air dynamic viscosity in m^2/s
  AIR_DENSITY: 1.225, // air density in kg/m^3
  GRAVITY: 9.81, // gravitational acceleration in m/s^2
} as const;

export const UNIT_CONVERSIONS = {
  CM_TO_M: 0.01,
  G_TO_KG: 0.001,
  M_TO_CM: 100,
  KG_TO_G: 1000,
} as const;