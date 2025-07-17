import type { RocketParams } from "../../components/features/Rocket/types";
import { Materials } from "../../components/features/Rocket/types";
import { UNIT_CONVERSIONS } from "../physics/constants";
import { calculateSkinFrictionCd } from "./aerodynamics";
import type { ComponentCalculationResult } from "./types";

/**
 * Calculate the average mid-chord angle of a fin shape defined by a series of points (for freedom-fin).
 * @param points  Array of points defining the fin shape, where each point has x and y coordinates.
 * @param N  Number of segments to divide the x-axis for angle estimation.
 * @returns Average angle in radians.
 */
function estimateMidChordAngle(
  points: { x: number; y: number }[],
  N = 10
): number {
  const minX = Math.min(...points.map((p) => p.x));
  const maxX = Math.max(...points.map((p) => p.x));
  const dx = (maxX - minX) / N;

  const midpoints: { x: number; y: number }[] = [];

  for (let i = 0; i <= N; i++) {
    const x = minX + i * dx;

    // x = 定数 で切断したときの交点を探す（y方向に2つあるはず）
    const yValues: number[] = [];

    for (let j = 0; j < points.length; j++) {
      const a = points[j];
      const b = points[(j + 1) % points.length];

      if ((a.x - x) * (b.x - x) <= 0 && a.x !== b.x) {
        // 線分abとx定数線の交点を計算（線形補間）
        const t = (x - a.x) / (b.x - a.x);
        const y = a.y + t * (b.y - a.y);
        yValues.push(y);
      }
    }

    if (yValues.length >= 2) {
      const minY = Math.min(...yValues);
      const maxY = Math.max(...yValues);
      midpoints.push({ x, y: (minY + maxY) / 2 });
    }
  }

  // midpoints の傾きを順に取って平均
  const angles: number[] = [];

  for (let i = 0; i < midpoints.length - 2; i++) {
    const a = midpoints[i];
    const b = midpoints[midpoints.length - 1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    angles.push(Math.atan2(dy, dx));
  }

  // 平均角度（ラジアン）
  const avgAngle =
    angles.reduce((sum, theta) => sum + theta, 0) / angles.length;
  return avgAngle;
}

export function calculateFinProperties(
  param: RocketParams
): ComponentCalculationResult {
  const finParams = param.fins;

  let totalMass = 0;
  let singleFinArea = 0;
  let Cg = 0;

  // parameters for Cna and Cp calculations
  let X_t = 0;
  let C_r = 0;
  let C_t = 0;
  let gamma_C = 0;
  let span = 0;

  if (finParams.type === "trapozoidal") {
    singleFinArea =
      ((finParams.rootChord + finParams.tipChord) * finParams.height) / 2;
    Cg =
      (finParams.tipChord * finParams.sweepLength) /
        (finParams.rootChord + finParams.tipChord) +
      finParams.rootChord / 2;
    X_t = finParams.sweepLength;
    C_r = finParams.rootChord;
    C_t = finParams.tipChord;
    span = finParams.height;
    gamma_C = Math.atan((X_t + C_t / 2 - C_r / 2) / span);
  } else if (finParams.type === "elliptical") {
    singleFinArea = (Math.PI * finParams.rootChord * finParams.height) / 4;
    Cg = finParams.rootChord / 2;
    C_r = finParams.rootChord;
    X_t = C_r / 2;
    C_t = 0; // for elliptical fins, tip chord is not defined
    gamma_C = 0;
  } else if (finParams.type === "freedom") {
    // Shoelace formula (expected non-closed polygon)
    singleFinArea = 0;
    for (let i = 0; i < finParams.points.length; i++) {
      const j = (i + 1) % finParams.points.length;
      const temp =
        finParams.points[i].x * finParams.points[j].y -
        finParams.points[j].x * finParams.points[i].y;
      singleFinArea += temp;
      Cg += (finParams.points[i].y + finParams.points[j].y) * temp;
    }
    singleFinArea = Math.abs(singleFinArea) / 2;
    Cg = Cg / (6 * singleFinArea);

    // find most distant points x,y from y-axis
    const maxX = Math.max(...finParams.points.map((p) => p.x));
    span = maxX;
    X_t = finParams.points.filter((p) => p.x === maxX)[0].y;
    C_r =
      finParams.points.reduce((max, p) => Math.max(max, p.y), 0) -
      finParams.points.reduce((min, p) => Math.min(min, p.y), 0);
    C_t = 0;
    gamma_C = estimateMidChordAngle(finParams.points);
  }

  const volume = singleFinArea * finParams.count * finParams.thickness;
  totalMass = volume * Materials[finParams.material].density;
  const refArea = Math.PI * Math.pow(param.body.diameter / 2, 2);

  Cg += param.nose.length + param.body.length - finParams.offset - C_r; // tip of the fin from the nose tip

  const Iyx = 0; // since fins are typically thin, we can assume negligible inertia moment for simplicity
  const Cd = calculateSkinFrictionCd(
    C_r, // root chord
    singleFinArea * finParams.count * 2,
    refArea
  );
  const Cna =
    ((1 + param.body.diameter / (span * 2 + param.body.diameter)) * // body fin interference factor
      (finParams.count / 2) * //  number of fins factor
      ((2 * Math.PI * span * span) / refArea)) /
    (1 +
      Math.sqrt(
        1 + Math.pow((span * span) / (singleFinArea * Math.cos(gamma_C)), 2)
      ));
  const Cp =
    (X_t * (C_r + 2 * C_t)) / (3 * (C_r + C_t)) +
    (C_r * C_r + C_t * C_t + C_r * C_t) / (6 * (C_r + C_t)) +
    param.nose.length +
    param.body.length -
    finParams.offset -
    C_r; // tip of the fin from the nose tip;

  return {
    volume: volume,
    mass: totalMass,
    Cg: Cg, // m from nose tip
    Iyx: Iyx, // Simplified inertia moment
    Cd: Cd,
    Cna: Cna, // dimensionless
    Cp: Cp, // m from nose tip
  };
}
