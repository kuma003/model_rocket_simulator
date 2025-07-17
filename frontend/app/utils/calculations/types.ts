export interface ComponentCalculationResult {
  volume: number; // m³
  mass: number; // kg
  Cg: number; // m from nose tip
  Iyx: number; // kg·m²
  Cd: number; // dimensionless
  Cna: number; // dimensionless
  Cp: number; // m from nose tip
}
