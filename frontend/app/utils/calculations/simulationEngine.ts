import type {
  RocketParams,
  RocketSpecs,
} from "../../components/features/Rocket/types";
import { calculateNoseProperties } from "./noseCalculations";
import { calculateBodyProperties } from "./bodyCalculations";
import { calculateFinProperties } from "./finCalculations";

import { UNIT_CONVERSIONS, PHYSICS_CONSTANTS } from "../physics/constants";

export interface RocketProperties {
  dryMass: number; // g
  inertiaMoment: number; // g·cm²
  stabilityMargin: number; // (CP-CG) / RefLength
  specs: RocketSpecs;
}

export interface TrajectoryData {
  flightTime: number; // s
  maxAltitude: number; // m
  altitudeData: Array<{ time: number; altitude: number }>;
}

export interface SimulationResults extends RocketProperties, TrajectoryData {}

/**
 * Calculate rocket properties (mass, inertia, aerodynamic coefficients)
 * @param params - Rocket parameters
 * @returns Rocket properties including mass, inertia, and specs
 */
export function calculateRocketProperties(
  params: RocketParams
): RocketProperties {
  // 各コンポーネントの計算
  const noseResults = calculateNoseProperties(params);
  const bodyResults = calculateBodyProperties(params);
  const finResults = calculateFinProperties(params);

  console.log("Nose Results:", noseResults);
  console.log("Body Results:", bodyResults);
  console.log("Fin Results:", finResults);

  // 総重量計算
  const dryMass = noseResults.mass + bodyResults.mass + finResults.mass;

  // 慣性モーメント計算
  const totalInertiaMoment = noseResults.Iyx + bodyResults.Iyx;
  const inertiaMoment = totalInertiaMoment;

  // 空力計算
  const refLength = params.nose.length + params.body.length;
  const totalCd = noseResults.Cd + bodyResults.Cd + finResults.Cd;
  const totalCna = noseResults.Cna + bodyResults.Cna + finResults.Cna;

  // Calculate actual center of gravity and pressure center
  const CG =
    (noseResults.Cg * noseResults.mass +
      bodyResults.Cg * bodyResults.mass +
      finResults.Cg * finResults.mass) /
    dryMass;
  const CP =
    (noseResults.Cp * noseResults.Cna +
      bodyResults.Cp * bodyResults.Cna +
      finResults.Cp * finResults.Cna) /
    totalCna;

  const pitchMomentCoefficient =
    -2 *
    ((noseResults.Cna * (noseResults.Cg - CG)) / refLength +
      (bodyResults.Cna * (bodyResults.Cg - CG)) / refLength +
      (finResults.Cna * (finResults.Cg - CG)) / refLength);

  // RocketSpecs の計算
  const specs: RocketSpecs = {
    ref_len: refLength,
    diam: params.body.diameter,
    mass_dry: dryMass,
    mass_i: dryMass + 100, // DUMMY: 推進剤重量
    mass_f: dryMass,
    CGlen_i: CG, // Use actual center of gravity
    CGlen_f: CG, // Use actual center of gravity
    Iyz: inertiaMoment,
    CPlen: CP, // Use actual center of pressure
    Cd: totalCd,
    Cna: finResults.Cna,
    Cmq: pitchMomentCoefficient,
    vel_1st: 0, // DUMMY: 1段目分離速度
    op_time: 0, // Will be set by trajectory calculation
  };

  // Calculate stability margin: (CP - CG) / RefLength
  const stabilityMargin = (CP - CG) / refLength;

  console.log("Rocket Specs:", specs);
  console.log("Stability Margin:", stabilityMargin);
  return {
    dryMass,
    inertiaMoment,
    stabilityMargin,
    specs,
  };
}

/**
 * Calculate trajectory data (flight time, altitude, trajectory points)
 * @param properties - Rocket properties
 * @returns Trajectory data including flight time, max altitude, and altitude data
 */
export function calculateTrajectory(
  properties: RocketProperties
): TrajectoryData {
  const { dryMass, specs } = properties;
  const totalCd = specs.Cd;

  // 飛行軌道計算
  const maxAltitude = calculateMaxAltitude(dryMass, totalCd);
  const flightTime = calculateFlightTime(maxAltitude);
  const altitudeData = generateAltitudeData(maxAltitude, flightTime);

  return {
    flightTime,
    maxAltitude,
    altitudeData,
  };
}

/**
 * Complete simulation including both rocket properties and trajectory calculation
 * @param params - Rocket parameters
 * @returns Complete simulation results
 */
export function runSimulation(params: RocketParams): SimulationResults {
  const properties = calculateRocketProperties(params);
  const trajectory = calculateTrajectory(properties);

  // Update specs with flight time
  const updatedSpecs = {
    ...properties.specs,
    op_time: trajectory.flightTime,
  };

  return {
    ...properties,
    ...trajectory,
    specs: updatedSpecs,
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
