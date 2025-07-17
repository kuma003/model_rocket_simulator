import type { RocketParams } from "../../components/features/Rocket/types";
import { Materials } from "../../components/features/Rocket/types";
import { UNIT_CONVERSIONS } from "../physics/constants";
import { calculateSkinFrictionCd } from "./aerodynamics";
import type { ComponentCalculationResult } from "./types";

export function calculateFinProperties(
  param: RocketParams
): ComponentCalculationResult {
  const { CM_TO_M } = UNIT_CONVERSIONS;
  const finParams = param.fins;

  let totalMass = 0;
  let totalArea = 0;
  let Cg = 0;

  if (finParams.type === "trapozoidal") {
    const singleFinArea =
      ((finParams.rootChord + finParams.tipChord) * finParams.height) / 2;
    totalArea = singleFinArea * Math.pow(CM_TO_M, 2) * finParams.count;
    Cg =
      ((finParams.tipChord * finParams.sweepLength) /
        (finParams.rootChord + finParams.tipChord) +
        finParams.rootChord / 2) *
      CM_TO_M;
  } else if (finParams.type === "elliptical") {
    const singleFinArea =
      (Math.PI * finParams.rootChord * finParams.height) / 4;
    totalArea = singleFinArea * Math.pow(CM_TO_M, 2) * finParams.count;
    Cg = (finParams.rootChord / 2) * CM_TO_M;
  } else if (finParams.type === "freedom") {
    // Shoelace formula (expected non-closed polygon)
    let estimatedArea = 0;
    for (let i = 0; i < finParams.points.length; i++) {
      const j = (i + 1) % finParams.points.length;
      const temp =
        finParams.points[i].x * finParams.points[j].y -
        finParams.points[j].x * finParams.points[i].y;
      estimatedArea += temp;
      Cg += (finParams.points[i].y + finParams.points[j].y) * temp;
    }
    estimatedArea = Math.abs(estimatedArea) / 2;
    Cg = (Cg / (6 * estimatedArea)) * CM_TO_M;
    totalArea = estimatedArea * Math.pow(CM_TO_M, 2) * finParams.count;
  }
  const volume = totalArea * finParams.thickness * CM_TO_M;
  totalMass = volume * Materials[finParams.material].density;

  const Iyx = 0; // since fins are typically thin, we can assume negligible inertia moment for simplicity
  const Cd = calculateSkinFrictionCd(
    totalArea,
    totalArea * 2,
    Math.PI * Math.pow(param.body.diameter * CM_TO_M, 2)
  );
  const Cna = 0;
  const centerOfPressure = 0;

  return {
    volume: volume,
    mass: totalMass,
    Cg: finParams.offset * CM_TO_M, // m from nose tip
    Iyx: Iyx, // Simplified inertia moment
    Cd: Cd,
    Cna: Cna, // dimensionless
    Cp: centerOfPressure, // m from nose tip
  };
}
