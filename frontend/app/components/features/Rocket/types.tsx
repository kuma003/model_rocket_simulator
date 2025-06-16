interface RocketBaseParam {
  length: number;
  diameter: number;
  thickness: number;
  material: "plastic" | "balsa" | "cardboard";
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
