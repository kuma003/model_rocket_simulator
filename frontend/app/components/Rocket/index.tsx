import react, { useEffect } from "react";
import useMotorExtractor from "./motors";

interface RocketBaseParam {
  length: number;
  diameter: number;
  thickness: number;
  material: "plastic" | "balsa" | "cardboard";
  color: string;
}

interface RocektParams {
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

const Rocket = () => {
  const { motorData, loading, error, extractAllMotors, getMotorByName } =
    useMotorExtractor();

  useEffect(() => {
    console.log("Rocket component mounted, starting motor extraction...");
    extractAllMotors();
  }, []);

  useEffect(() => {
    console.log("Motor data updated:", {
      motorCount: motorData.length,
      loading,
      error,
      motors: motorData.map(m => m.header.name)
    });
  }, [motorData, loading, error]);

  return <></>;
};

export default Rocket;
