import { PHYSICS_CONSTANTS } from "../physics/constants";

export function calculateSkinFrictionCd(
  refLength: number,
  surfaceArea: number,
  refArea: number
): number {
  const { REF_VEL, NU_AIR } = PHYSICS_CONSTANTS;

  const reynoldsNumber = (REF_VEL * refLength) / NU_AIR;
  const Cf = Math.max(
    reynoldsNumber > 5e5
      ? 0.455 / Math.pow(Math.log10(reynoldsNumber), 2.58) // turbulent flow
      : 1.328 / Math.sqrt(reynoldsNumber), // laminar flow
    0.032 * Math.pow(3e-5 / refLength, 0.2) // empirical correlation for low Reynolds numbers
  );

  return (Cf * surfaceArea) / refArea;
}
