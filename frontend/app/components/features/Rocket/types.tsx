// Material densities in kg/m^3 (SI units)
export const Materials = {
  plastic: {
    label: "プラスチック",
    density: 1250, // kg/m³
  },
  balsa: {
    label: "バルサ材",
    density: 170, // kg/m³
  },
  cardboard: {
    label: "厚紙",
    density: 680, // kg/m³
  },
};

// RocketBaseParam uses SI units (meters) for internal storage
// Display components handle unit conversion for user interface
interface RocketBaseParam {
  length: number; // m (SI unit)
  diameter: number; // m (SI unit)
  thickness: number; // m (SI unit)
  material: keyof typeof Materials; // Material type
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
    offset: number; // m (SI unit)
  } & (
      | {
          type: "trapozoidal";
          rootChord: number; // m (SI unit)
          tipChord: number; // m (SI unit)
          sweepLength: number; // m (SI unit)
          height: number; // m (SI unit)
        }
      | {
          type: "elliptical";
          rootChord: number; // m (SI unit)
          height: number; // m (SI unit)
        }
      | {
          type: "freedom";
          points: {
            x: number; // m (SI unit)
            y: number; // m (SI unit)
          }[];
        }
    );
  engine: {
    name: string;
  };
}

// RocketSpecs interface for calculations (SI units)
export interface RocketSpecs {
  ref_len: number; // Referential length for scaling (m)
  diam: number; // Diameter of the rocket (m)
  mass_dry: number; // Dry mass of the rocket (kg)
  mass_i: number; // Initial mass of the rocket (kg)
  mass_f: number; // Final mass of the rocket after fuel burn (kg)
  CGlen_i: number; // Initial center of gravity length (m)
  CGlen_f: number; // Final center of gravity length (m)
  Iyz: number; // Moment of inertia around the y-axis (kg⋅m²)

  CPlen: number; // Center of pressure length (m)
  Cd: number; // Drag coefficient (dimensionless)
  Cna: number; // Normal force coefficient (dimensionless)
  Cmq: number; // Pitching moment coefficient (dimensionless)

  vel_1st: number; // Velocity at first stage separation (m/s)
  op_time: number; // Operational time of the rocket (s)
}
