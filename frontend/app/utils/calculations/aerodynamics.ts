import { PHYSICS_CONSTANTS } from "../physics/constants";

export function calculateSkinFrictionCd(
  refLength: number,
  surfaceArea: number,
  refArea: number
): number {
  const { REF_VEL, NU_AIR } = PHYSICS_CONSTANTS;

  const reynoldsNumber = (REF_VEL * refLength) / NU_AIR;
  const Cf =
    reynoldsNumber > 5e5
      ? 0.455 / Math.pow(Math.log10(reynoldsNumber), 2.58) // turbulent flow
      : 1.328 / Math.sqrt(reynoldsNumber); // laminar flow

  return (Cf * surfaceArea) / refArea;
}

// DUMMY: 以下の関数は実装予定
export function calculateTotalDragCoefficient(
  noseCd: number,
  bodyCd: number,
  finCd: number
): number {
  return noseCd + bodyCd + finCd;
}

export function calculateCenterOfPressure(
  noseLength: number,
  bodyLength: number,
  finCenterOfPressure: number
): number {
  // DUMMY: 重心位置の簡易計算
  const totalLength = noseLength + bodyLength;
  return totalLength * 0.6; // 全長の60%位置 (DUMMY)
}

export function calculatePitchingMomentCoefficient(): number {
  // DUMMY: ピッチングモーメント係数
  return -0.02; // DUMMY値
}
