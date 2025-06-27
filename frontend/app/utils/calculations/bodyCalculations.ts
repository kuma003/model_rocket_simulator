import type { RocketParams } from "../../components/features/Rocket/types";
import { MaterialDensities } from "../../components/features/Rocket/types";
import { UNIT_CONVERSIONS } from "../physics/constants";

export interface BodyCalculationResult {
  volume: number; // m³
  mass: number; // kg
  inertiaMoment: number; // kg·m²
}

export function calculateBodyProperties(
  bodyParams: RocketParams["body"]
): BodyCalculationResult {
  const { CM_TO_M } = UNIT_CONVERSIONS;

  // 円筒殻の体積計算
  const volume =
    Math.PI *
    (bodyParams.diameter * CM_TO_M) *
    (bodyParams.length * CM_TO_M) *
    (bodyParams.thickness * CM_TO_M);

  const mass = volume * MaterialDensities[bodyParams.material].density;

  // 円筒の慣性モーメント計算
  const inertiaMoment =
    mass *
    (Math.pow(bodyParams.diameter * CM_TO_M, 2) / 8 +
      Math.pow(bodyParams.length * CM_TO_M, 2) / 12);

  return {
    volume,
    mass,
    inertiaMoment,
  };
}