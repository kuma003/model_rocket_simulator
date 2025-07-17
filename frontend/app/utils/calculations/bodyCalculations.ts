import type { RocketParams } from "../../components/features/Rocket/types";
import { Materials } from "../../components/features/Rocket/types";
import { UNIT_CONVERSIONS } from "../physics/constants";
import { calculateSkinFrictionCd } from "./aerodynamics";
import type { ComponentCalculationResult } from "./types";

export function calculateBodyProperties(
  param: RocketParams
): ComponentCalculationResult {
  const bodyParams = param.body;

  // 円筒殻の体積計算
  const volume =
    Math.PI * bodyParams.diameter * bodyParams.length * bodyParams.thickness;

  const mass = volume * Materials[bodyParams.material].density;

  // 円筒の慣性モーメント計算
  const inertiaMoment =
    mass *
    (Math.pow(bodyParams.diameter, 2) / 8 +
      Math.pow(bodyParams.length, 2) / 12);

  const Cg = bodyParams.length / 2 + param.nose.length; // m from nose tip
  const Cd = calculateSkinFrictionCd(
    bodyParams.length,
    Math.PI * bodyParams.diameter * bodyParams.length,
    Math.PI * Math.pow(bodyParams.diameter, 2)
  );
  const Cna = 0; // for Barrowman method, Cna is typically 0 for cylindrical bodies
  const Cp = 0; // since Cna is 0, Cp is not defined for cylindrical bodies

  return {
    volume: volume,
    mass: mass,
    Cg: Cg,
    Iyx: inertiaMoment,
    Cd: Cd,
    Cna: Cna,
    Cp: Cp,
  };
}
