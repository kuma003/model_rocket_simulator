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

// Note: These types represent display units (cm) for UI components
// Internal calculations should use SI units (meters) via unit conversion
interface RocketBaseParam {
  length: number; // cm (display unit)
  diameter: number; // cm (display unit)
  thickness: number; // cm (display unit)
  material: keyof typeof Materials; // Material type
  color: string;
}

// RocketParams interface for UI components (display units in cm)
// For internal calculations, use unit conversion utilities
export interface RocketParams {
  name: string;
  designer: string;
  nose: RocketBaseParam & {
    type: "conical" | "ogive" | "elliptical";
  };
  body: RocketBaseParam;
  fins: Omit<RocketBaseParam, "length" | "diameter"> & {
    count: number;
    offset: number; // cm (display unit)
  } & (
      | {
          type: "trapozoidal";
          rootChord: number; // cm (display unit)
          tipChord: number; // cm (display unit)
          sweepLength: number; // cm (display unit)
          height: number; // cm (display unit)
        }
      | {
          type: "elliptical";
          rootChord: number; // cm (display unit)
          height: number; // cm (display unit)
        }
      | {
          type: "freedom";
          points: {
            x: number; // cm (display unit)
            y: number; // cm (display unit)
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
