import type { RocketParams } from "../../components/features/Rocket/types";
import { MaterialDensities } from "../../components/features/Rocket/types";
import { UNIT_CONVERSIONS } from "../physics/constants";

export interface NoseCalculationResult {
  volume: number; // m³
  mass: number; // kg
  centerOfGravity: number; // m from nose tip
  inertiaMoment: number; // kg·m²
  dragCoefficient: number; // dimensionless
}

export function calculateNoseProperties(
  noseParams: RocketParams["nose"]
): NoseCalculationResult {
  const { CM_TO_M } = UNIT_CONVERSIONS;
  
  let volume = 0;
  let mass = 0;
  let centerOfGravity = 0;
  let inertiaMoment = 0;
  let dragCoefficient = 0;

  const phi = Math.atan(noseParams.diameter / (2 * noseParams.length));

  switch (noseParams.type) {
    case "conical":
      volume =
        (Math.PI *
          Math.pow(noseParams.diameter * CM_TO_M, 2) *
          (noseParams.length * CM_TO_M)) /
        12;
      mass =
        ((Math.PI *
          (noseParams.diameter *
            CM_TO_M *
            (noseParams.thickness * CM_TO_M) -
            Math.pow((noseParams.diameter * CM_TO_M) / 2, 2)) *
          (noseParams.length * CM_TO_M)) /
          3) *
        MaterialDensities[noseParams.material].density;
      centerOfGravity = (noseParams.length * CM_TO_M) / 4;
      inertiaMoment =
        (Math.PI *
          (noseParams.length * CM_TO_M) *
          (Math.pow((noseParams.diameter * CM_TO_M) / 2, 4) -
            Math.pow(
              (noseParams.diameter * CM_TO_M) / 2 - noseParams.thickness,
              4
            )) *
          MaterialDensities[noseParams.material].density) /
        10;
      dragCoefficient = 0.8 * Math.pow(Math.sin(phi), 2);
      break;

    case "ogive":
      volume =
        (Math.PI *
          Math.pow(noseParams.length * CM_TO_M, 2) *
          (1.5 * noseParams.diameter - noseParams.length) *
          CM_TO_M) /
        3;
      mass =
        Math.PI *
        Math.pow(noseParams.length * CM_TO_M, 2) *
        (noseParams.thickness * CM_TO_M) *
        MaterialDensities[noseParams.material].density;
      centerOfGravity =
        (noseParams.length * CM_TO_M) / 4 +
        Math.pow(noseParams.length * CM_TO_M, 2) /
          (3 * (noseParams.diameter * CM_TO_M));
      inertiaMoment =
        (3 *
          Math.PI *
          Math.pow(noseParams.length * CM_TO_M, 2) *
          Math.pow((noseParams.diameter * CM_TO_M) / 2, 2) *
          (noseParams.thickness * CM_TO_M) *
          MaterialDensities[noseParams.material].density) /
        10;
      dragCoefficient = 0.82 * 0.8 * Math.pow(Math.sin(phi), 2); // kappa = 0.5
      break;

    case "elliptical":
      volume =
        (Math.PI *
          Math.pow(noseParams.diameter * CM_TO_M, 2) *
          (noseParams.length * CM_TO_M)) /
        6;
      mass =
        ((2 *
          Math.PI *
          (noseParams.diameter *
            CM_TO_M *
            (noseParams.thickness * CM_TO_M) -
            Math.pow((noseParams.diameter * CM_TO_M) / 2, 2)) *
          (noseParams.length * CM_TO_M)) /
          3) *
        MaterialDensities[noseParams.material].density;
      centerOfGravity = (3 * noseParams.length * CM_TO_M) / 8;
      inertiaMoment =
        (2 *
          Math.PI *
          (noseParams.length * CM_TO_M) *
          (Math.pow((noseParams.diameter * CM_TO_M) / 2, 4) -
            Math.pow(
              (noseParams.diameter * CM_TO_M) / 2 - noseParams.thickness,
              4
            )) *
          MaterialDensities[noseParams.material].density) /
        15;
      dragCoefficient =
        1 / Math.pow(noseParams.length / noseParams.diameter + 1, 2.5);
      break;

    default:
      throw new Error("Unsupported nose type");
  }

  return {
    volume,
    mass,
    centerOfGravity,
    inertiaMoment,
    dragCoefficient,
  };
}