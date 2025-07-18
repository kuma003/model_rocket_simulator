import type {
  RocketParams,
  RocketSpecs,
} from "../../components/features/Rocket/types";
import { calculateNoseProperties } from "./noseCalculations";
import { calculateBodyProperties } from "./bodyCalculations";
import { calculateFinProperties } from "./finCalculations";

import { UNIT_CONVERSIONS, PHYSICS_CONSTANTS } from "../physics/constants";
import { loadMotorData } from "../motorParser";
import run4DoFSimulation from "./4DoF";

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
  console.log("Engine Data:", params.engine);

  // ペイロード重心位置計算（ノーズ先端からの距離）
  const payloadCG =
    params.nose.length + params.payload.offset + params.payload.length / 2;

  // 総重量計算
  const dryMass =
    noseResults.mass + bodyResults.mass + finResults.mass + params.payload.mass;
  const mass_i = dryMass + params.engine.totalMass;
  const mass_f = mass_i - params.engine.propMass;

  // 空力計算
  const totalCd = noseResults.Cd + bodyResults.Cd + finResults.Cd;
  const totalCna = noseResults.Cna + bodyResults.Cna + finResults.Cna;
  const refLength = params.nose.length + params.body.length;

  // Calculate actual center of gravity and pressure center
  const totalMassKg_i =
    noseResults.mass +
    bodyResults.mass +
    finResults.mass +
    params.payload.mass +
    params.engine.totalMass;
  const totalMassKg_f =
    noseResults.mass +
    bodyResults.mass +
    finResults.mass +
    params.payload.mass +
    (params.engine.totalMass - params.engine.propMass);

  const CG_i =
    (noseResults.Cg * noseResults.mass +
      bodyResults.Cg * bodyResults.mass +
      finResults.Cg * finResults.mass +
      payloadCG * params.payload.mass +
      (refLength - params.engine.length / 2) * params.engine.totalMass) /
    totalMassKg_i;
  const CG_f =
    (noseResults.Cg * noseResults.mass +
      bodyResults.Cg * bodyResults.mass +
      finResults.Cg * finResults.mass +
      payloadCG * params.payload.mass +
      (refLength - params.engine.length / 2) *
        (params.engine.totalMass - params.engine.propMass)) /
    totalMassKg_f;

  const CP =
    (noseResults.Cp * noseResults.Cna +
      bodyResults.Cp * bodyResults.Cna +
      finResults.Cp * finResults.Cna) /
    totalCna;

  // 慣性モーメント計算
  const motorIyx =
    refLength * params.nose.length +
    params.body.length -
    params.engine.length / 2;
  const totalInertiaMoment = noseResults.Iyx + bodyResults.Iyx;

  const pitchMomentCoefficient =
    -2 *
    ((noseResults.Cna * (noseResults.Cg - CG_i)) / refLength +
      (bodyResults.Cna * (bodyResults.Cg - CG_i)) / refLength +
      (finResults.Cna * (finResults.Cg - CG_i)) / refLength);

  // RocketSpecs の計算（kg単位で統一）
  const specs: RocketSpecs = {
    ref_len: refLength,
    diam: params.body.diameter,
    mass_dry: dryMass,
    mass_i: mass_i,
    mass_f: mass_f,
    CGlen_i: CG_i, // Use actual center of gravity
    CGlen_f: CG_f, // Use actual center of gravity
    Iyz: totalInertiaMoment,
    CPlen: CP, // Use actual center of pressure
    Cd: totalCd,
    Cna: finResults.Cna,
    Cmq: pitchMomentCoefficient,
    vel_1st: 0, // DUMMY: 1段目分離速度
    op_time: 0, // Will be set by trajectory calculation
    engine: params.engine,
  };

  // Calculate stability margin: (CP - CG) / RefLength
  const stabilityMargin = (CP - CG_i) / refLength;

  console.log("Rocket Specs:", specs);
  console.log("Stability Margin:", stabilityMargin);
  return {
    dryMass,
    inertiaMoment: totalInertiaMoment,
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
  properties: RocketProperties,
  timestep: number = 0.1
): TrajectoryData {
  const trajectory = run4DoFSimulation(
    properties.specs,
    {
      lauchrodElevation: 89, // Launch rod elevation
      launchrodLength: 1, // DUMMY: Launch rod length
    },
    timestep
  );

  const maxAltitude = Math.max(...trajectory.position.map((p) => p.y)); // Find maximum altitude from trajectory data

  const flightTime = trajectory.time[trajectory.time.length - 1]; // Total flight time
  const altitudeData = trajectory.position.map((pos, index) => ({
    time: trajectory.time[index],
    altitude: pos.y,
  }));

  return {
    flightTime,
    maxAltitude,
    altitudeData,
  };
}
