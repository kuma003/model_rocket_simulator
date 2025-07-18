import type { MotorData } from "~/utils/motorParser";

// Material densities in kg/m^3 (SI units)
export const Materials = {
  plastic: {
    label: "プラスチック",
    density: 1250,
  },
  balsa: {
    label: "バルサ材",
    density: 170,
  },
  cardboard: {
    label: "厚紙",
    density: 680,
  },
};

// RocketBaseParam uses SI units (meters) for internal storage
// Display components handle unit conversion for user interface
interface RocketBaseParam {
  length: number; // meters
  diameter: number; // meters
  thickness: number; // meters
  material: keyof typeof Materials;
  color: string;
}

// RocketParams interface using SI units (meters) for internal storage
// Display components handle unit conversion for user interface
export interface RocketParams {
  name: string;
  designer: string;
  nose: RocketBaseParam & {
    type: "conical" | "ogive" | "elliptical";
  };
  body: RocketBaseParam;
  fins: Omit<RocketBaseParam, "length" | "diameter"> & {
    count: number;
    offset: number; // meters
  } & (
      | {
          type: "trapozoidal";
          rootChord: number; // meters
          tipChord: number; // meters
          sweepLength: number; // meters
          height: number; // meters
        }
      | {
          type: "elliptical";
          rootChord: number; // meters
          height: number; // meters
        }
      | {
          type: "freedom";
          points: {
            x: number; // meters
            y: number; // meters
          }[];
        }
    );
  engine: MotorData;
}

// RocketSpecs interface for calculations (SI units)
export interface RocketSpecs {
  ref_len: number; // Referential length for scaling (meters)
  diam: number; // Diameter of the rocket (meters)
  mass_dry: number; // Dry mass of the rocket (kg)
  mass_i: number; // Initial mass of the rocket (kg)
  mass_f: number; // Final mass of the rocket after fuel burn (kg)
  CGlen_i: number; // Initial center of gravity length (meters)
  CGlen_f: number; // Final center of gravity length (meters)
  Iyz: number; // Moment of inertia around the y-axis (kg⋅m²)

  CPlen: number; // Center of pressure length (meters)
  Cd: number; // Drag coefficient (dimensionless)
  Cna: number; // Normal force coefficient (dimensionless)
  Cmq: number; // Pitching moment coefficient (dimensionless)

  vel_1st: number; // Velocity at first stage separation (m/s)
  op_time: number; // Operational time of the rocket (seconds)
}
