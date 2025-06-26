// Material densities in kg/m^3
export const MaterialDensities = {
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

interface RocketBaseParam {
  length: number;
  diameter: number;
  thickness: number;
  material: keyof typeof MaterialDensities; // Material type
  color: string;
}

export interface RocketParams {
  name: string;
  designer: string;
  nose: RocketBaseParam & {
    type: "conical" | "ogive" | "elliptical";
  };
  body: RocketBaseParam;
  fins: Omit<RocketBaseParam, "length" | "diameter"> & {
    count: number;
  } & (
      | {
          type: "trapozoidal";
          rootChord: number;
          tipChord: number;
          sweepLength: number;
          height: number;
        }
      | {
          type: "elliptical";
          rootChord: number;
          height: number;
        }
      | {
          type: "freedom";
          points: {
            x: number;
            y: number;
          }[];
        }
    );
  engine: {
    name: string;
  };
}

export interface RocketProps {
  ref_len: number; // Referential length for scaling
  diam: number; // Diameter of the rocket
  mass_dry: number; // Dry mass of the rocket
  mass_i: number; // Initial mass of the rocket
  mass_f: number; // Final mass of the rocket after fuel burn
  CGlen_i: number; // Initial center of gravity length
  CGlen_f: number; // Final center of gravity length
  Iyz: number; // Moment of inertia around the y-axis

  CPlen: number; // Center of pressure length
  Cd: number; // Drag coefficient
  Cna: number; // Normal force coefficient
  Cmq: number; // Pitching moment coefficient

  vel_1st: number; // Velocity at first stage separation
  op_time: number; // Operational time of the rocket
}
