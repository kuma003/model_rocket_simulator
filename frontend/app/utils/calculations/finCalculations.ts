import type { RocketParams } from "../../components/features/Rocket/types";
import { Materials } from "../../components/features/Rocket/types";
import { UNIT_CONVERSIONS } from "../physics/constants";

export interface FinCalculationResult {
  totalMass: number; // kg
  totalArea: number; // m²
  // DUMMY: 以下は実装予定の項目（ダミー値を返す）
  centerOfPressure: number; // m from nose tip (DUMMY)
  normalForceCoefficient: number; // dimensionless (DUMMY)
}

export function calculateFinProperties(
  finParams: RocketParams["fins"]
): FinCalculationResult {
  const { CM_TO_M } = UNIT_CONVERSIONS;

  let totalMass = 0;
  let totalArea = 0;

  if (finParams.type === "trapozoidal") {
    const singleFinArea =
      ((finParams.rootChord + finParams.tipChord) * finParams.height) / 2;
    totalArea = singleFinArea * Math.pow(CM_TO_M, 2) * finParams.count;

    const volume = totalArea * finParams.thickness * CM_TO_M;
    totalMass = volume * Materials[finParams.material].density;
  } else if (finParams.type === "elliptical") {
    // DUMMY: 楕円フィンの計算（実装予定）
    const singleFinArea =
      (Math.PI * finParams.rootChord * finParams.height) / 4;
    totalArea = singleFinArea * Math.pow(CM_TO_M, 2) * finParams.count;

    const volume = totalArea * finParams.thickness * CM_TO_M;
    totalMass = volume * Materials[finParams.material].density;
  } else if (finParams.type === "freedom") {
    // DUMMY: 自由形状フィンの計算（実装予定）
    // 簡易的に矩形として計算
    const estimatedArea = 100; // cm² (DUMMY)
    totalArea = estimatedArea * Math.pow(CM_TO_M, 2) * finParams.count;

    const volume = totalArea * finParams.thickness * CM_TO_M;
    totalMass = volume * Materials[finParams.material].density;
  }

  // DUMMY: 以下の値は実装予定
  const centerOfPressure = 0.7; // m from nose tip (DUMMY)
  const normalForceCoefficient = 2.0; // dimensionless (DUMMY)

  return {
    totalMass,
    totalArea,
    centerOfPressure,
    normalForceCoefficient,
  };
}
