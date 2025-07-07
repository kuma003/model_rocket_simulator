import type {
  RocketParams,
  RocketSpecs,
} from "../../components/features/Rocket/types";
import { calculateNoseProperties } from "./noseCalculations";
import { calculateBodyProperties } from "./bodyCalculations";
import { calculateFinProperties } from "./finCalculations";
import {
  calculateSkinFrictionCd,
  calculateTotalDragCoefficient,
  calculateCenterOfPressure,
  calculatePitchingMomentCoefficient,
} from "./aerodynamics";
import { UNIT_CONVERSIONS, PHYSICS_CONSTANTS } from "../physics/constants";

export interface SimulationResults {
  dryMass: number; // g
  inertiaMoment: number; // g·cm²
  flightTime: number; // s
  maxAltitude: number; // m
  altitudeData: Array<{ time: number; altitude: number }>;
  // 以下は将来的に実装予定
  specs?: RocketSpecs;
}

export function runSimulation(params: RocketParams): SimulationResults {
  const { CM_TO_M, G_TO_KG, KG_TO_G } = UNIT_CONVERSIONS;
  const { GRAVITY } = PHYSICS_CONSTANTS;

  // 各コンポーネントの計算
  const noseResults = calculateNoseProperties(params.nose);
  const bodyResults = calculateBodyProperties(params.body);
  const finResults = calculateFinProperties(params.fins);

  // 総重量計算
  const totalMassKg =
    noseResults.mass + bodyResults.mass + finResults.totalMass;
  const dryMass = totalMassKg / G_TO_KG; // Convert to grams for display

  // 慣性モーメント計算
  const totalInertiaMoment = noseResults.Iyx + bodyResults.inertiaMoment;
  const inertiaMoment = totalInertiaMoment * 10000; // Convert to g·cm²

  // 空力計算
  const refLength = params.nose.length + params.body.length;

  const totalCd = noseResults.Cd;
  // bodyResults.dragCoefficient +
  // finResults.totalDragCoefficient;

  // DUMMY: 飛行軌道計算（実装予定）
  const maxAltitude = calculateMaxAltitude(dryMass, totalCd);
  const flightTime = calculateFlightTime(maxAltitude);
  const altitudeData = generateAltitudeData(maxAltitude, flightTime);

  // DUMMY: RocketSpecs の計算（実装予定）
  const specs: RocketSpecs = {
    ref_len: refLength,
    diam: params.body.diameter,
    mass_dry: dryMass,
    mass_i: dryMass + 100, // DUMMY: 推進剤重量
    mass_f: dryMass,
    CGlen_i: refLength * 0.5, // DUMMY
    CGlen_f: refLength * 0.5, // DUMMY
    Iyz: inertiaMoment,
    CPlen: calculateCenterOfPressure(
      params.nose.length,
      params.body.length,
      finResults.centerOfPressure
    ),
    Cd: totalCd,
    Cna: finResults.normalForceCoefficient,
    Cmq: calculatePitchingMomentCoefficient(),
    vel_1st: 0, // DUMMY: 1段目分離速度
    op_time: flightTime,
  };

  return {
    dryMass,
    inertiaMoment,
    flightTime,
    maxAltitude,
    altitudeData,
    specs,
  };
}

// DUMMY: 最高高度計算（実装予定）
function calculateMaxAltitude(
  massGrams: number,
  dragCoefficient: number
): number {
  // 簡易的な計算式
  const thrustToWeightRatio = 5.0; // DUMMY: 推力重量比
  const burnTime = 2.0; // DUMMY: 燃焼時間

  // 理想的な場合の最高高度の簡易計算
  const baseAltitude = Math.max(50, massGrams * 0.5);
  const dragFactor = Math.max(0.5, 1 - dragCoefficient);

  return baseAltitude * dragFactor * thrustToWeightRatio;
}

// DUMMY: 飛行時間計算（実装予定）
function calculateFlightTime(maxAltitude: number): number {
  // 自由落下時間の簡易計算
  const { GRAVITY } = PHYSICS_CONSTANTS;
  return Math.sqrt((2 * maxAltitude) / GRAVITY) * 1.5; // 上昇時間も考慮
}

// DUMMY: 高度データ生成（実装予定）
function generateAltitudeData(
  maxAltitude: number,
  totalFlightTime: number
): Array<{ time: number; altitude: number }> {
  const dataPoints = 20;
  const altitudeData = [];

  for (let i = 0; i <= dataPoints; i++) {
    const timeRatio = i / dataPoints;
    const time = timeRatio * totalFlightTime;

    let altitude = 0;
    if (timeRatio <= 0.2) {
      // 加速上昇フェーズ
      altitude = maxAltitude * Math.pow(timeRatio * 5, 2) * 0.04;
    } else if (timeRatio <= 0.4) {
      // 減速上昇フェーズ
      const adjustedRatio = (timeRatio - 0.2) * 5;
      altitude = maxAltitude * (0.04 + adjustedRatio * 0.96);
    } else {
      // 下降フェーズ
      const adjustedRatio = (timeRatio - 0.4) / 0.6;
      altitude = maxAltitude * (1 - Math.pow(adjustedRatio, 2));
    }

    altitudeData.push({ time, altitude: Math.max(0, altitude) });
  }

  return altitudeData;
}
