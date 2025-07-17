import type { RocketParams } from "../../components/features/Rocket/types";
import { Materials } from "../../components/features/Rocket/types";
import { calculateSkinFrictionCd } from "./aerodynamics";
import { UNIT_CONVERSIONS } from "../physics/constants";
import type { ComponentCalculationResult } from "./types";

export function calculateNoseProperties(
  param: RocketParams
): ComponentCalculationResult {
  const { CM_TO_M } = UNIT_CONVERSIONS;
  const noseParams = param.nose;

  let volume = 0;
  let mass = 0;
  let Cg = 0;
  let Iyz = 0; // pich/yaw inertia moment
  let Cd = 0;
  let surfaceArea = 0;

  // convert parameters to SI units
  const radius = (noseParams.diameter * CM_TO_M) / 2;
  const length = noseParams.length * CM_TO_M;
  const thickness = noseParams.thickness * CM_TO_M;

  const refArea = Math.PI * Math.pow(radius, 2);
  const phi = Math.atan(noseParams.diameter / (2 * noseParams.length));

  switch (noseParams.type) {
    case "conical": // for conical nose cones
      const outerVolume = (refArea * length) / 3;
      const innerRadius = Math.max(0, radius - thickness);
      const innerLength = Math.max(0, length - thickness);
      const innerVolume =
        (Math.PI * Math.pow(innerRadius, 2) * innerLength) / 3;
      volume = outerVolume - innerVolume;
      surfaceArea = Math.PI * radius * (length + radius);

      mass = volume * Materials[noseParams.material].density;
      Cg = length / 4;

      // 円錐殻の慣性モーメント（簡易計算）
      Iyz = mass * (Math.pow(radius, 2) / 10 + Math.pow(length, 2) / 18);
      Cd = 0.8 * Math.pow(Math.sin(phi), 2); // Ref: OpenRocket Technical Documentation
      break;
    case "ogive": // for ogive nose cones
      const ogiveSlantHeight = Math.sqrt(
        Math.pow(length, 2) + Math.pow(radius, 2)
      );
      surfaceArea = Math.PI * radius * ogiveSlantHeight;
      volume = surfaceArea * thickness;

      mass = volume * Materials[noseParams.material].density;
      Cg = length * 0.4 + (length * length) / (6 * radius);

      Iyz = mass * (Math.pow(radius, 2) / 10 + Math.pow(length, 2) / 18); // same as conical
      Cd = 0.82 * 0.8 * Math.pow(Math.sin(phi), 2); // kappa = 0.5
      break;

    case "elliptical": // for elliptical nose cones
      const aspectRatio = radius / length;

      if (aspectRatio >= 1.0) {
        // 長さよりも径が大きい場合は球として計算
        surfaceArea = 4 * Math.PI * Math.pow(radius, 2);
      } else {
        const eccentricity = Math.sqrt(1 - Math.pow(aspectRatio, 2));
        if (eccentricity > 0.001) {
          surfaceArea =
            2 *
            Math.PI *
            Math.pow(radius, 2) *
            (1 + ((length / radius) * Math.asin(eccentricity)) / eccentricity);
        } else {
          // 細長い楕円の場合は円錐として近似
          const slantHeight = Math.sqrt(
            Math.pow(length, 2) + Math.pow(radius, 2)
          );
          surfaceArea = Math.PI * radius * slantHeight;
        }
      }
      surfaceArea /= 2;

      volume = (surfaceArea / 2) * thickness;

      mass = volume * Materials[noseParams.material].density;
      Cg = (3 * length) / 8;

      // 楕円体の慣性モーメント（近似）
      Iyz = mass * (Math.pow(radius, 2) / 5 + Math.pow(length, 2) / 20);
      Cd = 1 / Math.pow(noseParams.length / noseParams.diameter + 1, 2.5);
      break;
    default:
      throw new Error("Unsupported nose type");
  }

  Cd += calculateSkinFrictionCd(length, surfaceArea, refArea);

  const Cna = 2; // Normal force coefficient
  const Cp = length - volume / refArea; // Center of pressure from nose tip

  return {
    volume: volume,
    mass: mass,
    Cg: Cg,
    Iyx: Iyz,
    Cd: Cd,
    Cna: Cna,
    Cp: Cp,
  };
}
