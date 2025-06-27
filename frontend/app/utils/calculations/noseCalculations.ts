import type { RocketParams } from "../../components/features/Rocket/types";
import { MaterialDensities } from "../../components/features/Rocket/types";
import { UNIT_CONVERSIONS } from "../physics/constants";

export interface NoseCalculationResult {
  volume: number; // m³
  mass: number; // kg
  centerOfGravity: number; // m from nose tip
  inertiaMoment: number; // kg·m²
  dragCoefficient: number; // dimensionless
}

export function calculateNoseProperties(
  noseParams: RocketParams["nose"]
): NoseCalculationResult {
  const { CM_TO_M } = UNIT_CONVERSIONS;
  
  let volume = 0;
  let mass = 0;
  let centerOfGravity = 0;
  let inertiaMoment = 0;
  let dragCoefficient = 0;

  const phi = Math.atan(noseParams.diameter / (2 * noseParams.length));

  switch (noseParams.type) {
    case "conical":
      // 円錐殻の体積計算（正確な殻体積）
      const coneRadius = (noseParams.diameter * CM_TO_M) / 2;
      const coneLength = noseParams.length * CM_TO_M;
      const coneThickness = noseParams.thickness * CM_TO_M;
      
      // 外径円錐から内径円錐を引いた体積
      const outerVolume = (Math.PI * Math.pow(coneRadius, 2) * coneLength) / 3;
      const innerRadius = Math.max(0, coneRadius - coneThickness);
      const innerLength = Math.max(0, coneLength * (innerRadius / coneRadius));
      const innerVolume = (Math.PI * Math.pow(innerRadius, 2) * innerLength) / 3;
      volume = outerVolume - innerVolume;
      
      mass = volume * MaterialDensities[noseParams.material].density;
      centerOfGravity = coneLength / 4;
      
      // 円錐殻の慣性モーメント（簡易計算）
      inertiaMoment = mass * (Math.pow(coneRadius, 2) / 10 + Math.pow(coneLength, 2) / 18);
      dragCoefficient = 0.8 * Math.pow(Math.sin(phi), 2);
      break;

    case "ogive":
      // オジャイブ形状の近似計算（薄肉殻として計算）
      const ogiveRadius = (noseParams.diameter * CM_TO_M) / 2;
      const ogiveLength = noseParams.length * CM_TO_M;
      const ogiveThickness = noseParams.thickness * CM_TO_M;
      
      // 表面積ベースの質量計算（近似）
      const ogiveSlantHeight = Math.sqrt(Math.pow(ogiveLength, 2) + Math.pow(ogiveRadius, 2));
      const ogiveSurfaceArea = Math.PI * ogiveRadius * ogiveSlantHeight;
      volume = ogiveSurfaceArea * ogiveThickness;
      
      mass = volume * MaterialDensities[noseParams.material].density;
      centerOfGravity = ogiveLength * 0.4; // オジャイブの重心位置（近似）
      
      // オジャイブの慣性モーメント（円錐に近い形状として計算）
      inertiaMoment = mass * (Math.pow(ogiveRadius, 2) / 10 + Math.pow(ogiveLength, 2) / 18);
      dragCoefficient = 0.82 * 0.8 * Math.pow(Math.sin(phi), 2); // kappa = 0.5
      break;

    case "elliptical":
      // 楕円形ノーズコーンの計算（薄肉殻として計算）
      const ellipseRadius = (noseParams.diameter * CM_TO_M) / 2;
      const ellipseLength = noseParams.length * CM_TO_M;
      const ellipseThickness = noseParams.thickness * CM_TO_M;
      
      // 楕円体の表面積（近似）- ゼロ除算を防ぐ
      const aspectRatio = ellipseRadius / ellipseLength;
      let ellipseSurfaceArea;
      
      if (aspectRatio >= 1.0) {
        // 長さよりも径が大きい場合は球として計算
        ellipseSurfaceArea = 4 * Math.PI * Math.pow(ellipseRadius, 2);
      } else {
        const eccentricity = Math.sqrt(1 - Math.pow(aspectRatio, 2));
        if (eccentricity > 0.001) {
          ellipseSurfaceArea = 2 * Math.PI * Math.pow(ellipseRadius, 2) * 
            (1 + (ellipseLength / ellipseRadius) * Math.asin(eccentricity) / eccentricity);
        } else {
          // 細長い楕円の場合は円錐として近似
          const slantHeight = Math.sqrt(Math.pow(ellipseLength, 2) + Math.pow(ellipseRadius, 2));
          ellipseSurfaceArea = Math.PI * ellipseRadius * slantHeight;
        }
      }
      
      // 半分の楕円体なので表面積を半分にして厚みをかける
      volume = (ellipseSurfaceArea / 2) * ellipseThickness;
      
      mass = volume * MaterialDensities[noseParams.material].density;
      centerOfGravity = (3 * ellipseLength) / 8;
      
      // 楕円体の慣性モーメント（近似）
      inertiaMoment = mass * (Math.pow(ellipseRadius, 2) / 5 + Math.pow(ellipseLength, 2) / 20);
      dragCoefficient = 1 / Math.pow(noseParams.length / noseParams.diameter + 1, 2.5);
      break;

    default:
      throw new Error("Unsupported nose type");
  }

  // 安全性チェック：慣性モーメントが負になることを防ぐ
  inertiaMoment = Math.max(0, inertiaMoment);

  return {
    volume,
    mass,
    centerOfGravity,
    inertiaMoment,
    dragCoefficient,
  };
}