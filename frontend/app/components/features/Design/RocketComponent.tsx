import React, { useMemo } from "react";
import type { RocketParams } from "../Rocket/types";
import { CenterMarker } from "../../ui/CenterMarkers";

/**
 * Type definition for a point in 2D coordinate system
 * @interface Point2D
 * @property {number} x - X coordinate (horizontal)
 * @property {number} y - Y coordinate (vertical)
 */
interface Point2D {
  x: number;
  y: number;
}

/**
 * Generate fin vertex coordinates in local coordinate system
 * @param {RocketParams["fins"]} finParams - Fin parameters
 * @param {number} pixelsPerCm - Pixels per centimeter conversion rate
 * @returns {Point2D[]} Array of fin vertex coordinates in local coordinate system
 * @description
 * Local coordinate system:
 * - X-axis: Outward from body tube (chord direction)
 * - Y-axis: Upward (height direction)
 * - Origin: Root chord tip (body tube surface)
 */
function generateFinVertices(
  finParams: RocketParams["fins"],
  pixelsPerCm: number
): Point2D[] {
  if (finParams.type !== "trapozoidal") {
    return [];
  }

  const rootChord = finParams.rootChord * pixelsPerCm;
  const tipChord = finParams.tipChord * pixelsPerCm;
  const height = finParams.height * pixelsPerCm;
  const sweepLength = finParams.sweepLength * pixelsPerCm;

  // フィンの頂点を定義（ローカル座標系）
  // X軸：ボディチューブから外向き（chord方向）
  // Y軸：上向き（高さ方向）
  // 原点：root chordの先端（ボディチューブ表面）
  return [
    { x: 0, y: 0 }, // root leading edge (ボディ接続点)
    { x: 0, y: rootChord }, // root trailing edge
    { x: height, y: sweepLength + tipChord }, // tip trailing edge
    { x: height, y: sweepLength }, // tip leading edge
  ];
}

/**
 * Project fin from 3D placement to 2D view
 * @param {Point2D[]} vertices - Fin vertex coordinates in local coordinate system
 * @param {number} finAngleDeg - Fin placement angle in degrees
 * @param {number} bodyCenterX - Body tube center X coordinate
 * @param {number} bodyRadius - Body tube radius
 * @param {number} finAttachmentY - Fin attachment position Y coordinate
 * @returns {{ projectedVertices: Point2D[], opacity: number, zOrder: number }} Projection result
 * @description
 * Projects fin placement from 3D space to 2D side view, calculating visibility and Z-order based on depth
 */
function projectFinTo2D(
  vertices: Point2D[],
  finAngleDeg: number,
  bodyCenterX: number,
  bodyRadius: number,
  finAttachmentY: number
): { projectedVertices: Point2D[]; zOrder: number } {
  const finAngleRad = (finAngleDeg * Math.PI) / 180;
  const cos = Math.cos(finAngleRad);
  const sin = Math.sin(finAngleRad);

  // 側面図での圧縮率（角度による見え方の変化）
  const compressionFactor = cos;

  // フィンの取り付け位置（ボディチューブ表面）
  const finBaseX = bodyCenterX + bodyRadius * cos;

  // Z-order（右側面図なのでcosの値で決定、負の値が後方）
  const zOrder = sin;

  // 各頂点を2D投影
  const projectedVertices = vertices.map((vertex) => ({
    x: finBaseX + vertex.x * compressionFactor,
    y: finAttachmentY + vertex.y,
  }));

  return { projectedVertices, zOrder };
}

/**
 * Calculate center of gravity position
 * @param {RocketParams} rocketParams - Rocket design parameters
 * @returns {number} Center of gravity position from nose tip in cm
 */
function calculateCenterOfGravity(rocketParams: RocketParams): number {
  const { nose, body, fins } = rocketParams;

  // 材質の密度（kg/m³）
  const Materials = {
    plastic: { density: 1250 },
    balsa: { density: 170 },
    cardboard: { density: 680 },
  };

  // 各部品の体積と重心位置を計算
  const noseVolume =
    (Math.PI * Math.pow(nose.diameter / 2, 2) * nose.length) / 3; // 円錐の体積
  const noseCG = nose.length * 0.75; // 円錐の重心は高さの3/4
  const noseMass =
    noseVolume * Materials[nose.material].density * nose.thickness;

  const bodyVolume = Math.PI * Math.pow(body.diameter / 2, 2) * body.length; // 円筒の体積
  const bodyCG = nose.length + body.length / 2; // 円筒の重心は中央
  const bodyMass =
    bodyVolume * Materials[body.material].density * body.thickness;

  let finsMass = 0;
  let finsCG = 0;

  if (fins.type === "trapozoidal") {
    // 台形フィンの面積
    const finArea = ((fins.rootChord + fins.tipChord) / 2) * fins.height;
    const finVolume = finArea * fins.thickness;
    finsMass = finVolume * Materials[fins.material].density * fins.count;
    // フィンの重心位置（フィンの中心）
    finsCG = nose.length + body.length - fins.offset - fins.height / 2;
  }

  // 全体の重心位置を計算
  const totalMass = noseMass + bodyMass + finsMass;
  const totalMoment = noseMass * noseCG + bodyMass * bodyCG + finsMass * finsCG;

  return totalMoment / totalMass;
}

/**
 * Calculate center of pressure position (simplified)
 * @param {RocketParams} rocketParams - Rocket design parameters
 * @returns {number} Center of pressure position from nose tip in cm
 */
function calculateCenterOfPressure(rocketParams: RocketParams): number {
  const { nose, body, fins } = rocketParams;

  // 簡略化された圧力中心計算
  // 実際の計算は複雑ですが、ここでは近似値を使用

  // ノーズコーンの圧力中心
  const noseCpContribution = nose.length * 0.6; // ノーズコーンの圧力中心
  const noseArea = Math.PI * Math.pow(nose.diameter / 2, 2);

  // ボディの圧力中心（通常は中央付近）
  const bodyCpContribution = nose.length + body.length / 2;
  const bodyArea = body.diameter * body.length; // 側面積

  // フィンの圧力中心
  let finsCpContribution = 0;
  let finsArea = 0;

  if (fins.type === "trapozoidal") {
    finsArea =
      ((fins.rootChord + fins.tipChord) / 2) * fins.height * fins.count;
    // フィンの圧力中心は通常フィンの中心よりやや後方
    finsCpContribution =
      nose.length + body.length - fins.offset - fins.height * 0.3;
  }

  // 面積重み付き平均
  const totalArea = noseArea + bodyArea + finsArea;
  const totalMoment =
    noseArea * noseCpContribution +
    bodyArea * bodyCpContribution +
    finsArea * finsCpContribution;

  return totalMoment / totalArea;
}

/**
 * Props for RocketComponent
 * @interface RocketComponentProps
 * @property {RocketParams} rocketParams - Rocket design parameters
 * @property {number} [scale=2] - Pixels per centimeter conversion rate
 * @property {number} [pitchAngle=0] - Pitch angle in degrees
 * @property {number} [rollAngle=0] - Roll angle in degrees
 * @property {boolean} [showCenterMarkers=false] - Whether to show center of gravity and pressure center markers
 */
interface RocketComponentProps {
  rocketParams: RocketParams;
  scale?: number;
  pitchAngle?: number;
  rollAngle?: number;
  showCenterMarkers?: boolean;
}

/**
 * React component for rendering 2D side view of a rocket
 * @component
 * @param {RocketComponentProps} props - Component properties
 * @returns {JSX.Element} SVG-based 2D rocket rendering
 * @description
 * Renders rocket nose cone, body tube, and fins considering their 3D spatial placement
 * as a 2D side view. Fins are rendered with depth perception using 3D to 2D projection.
 * @example
 * ```tsx
 * <RocketComponent
 *   rocketParams={rocketParams}
 *   scale={2}
 *   pitchAngle={15}
 *   rollAngle={45}
 * />
 * ```
 */
const RocketComponent: React.FC<RocketComponentProps> = ({
  rocketParams,
  scale = 2,
  pitchAngle = 0,
  rollAngle = 0,
  showCenterMarkers = false,
}) => {
  const { nose, body, fins } = rocketParams;

  // 物理寸法をピクセルに変換
  const pixelsPerCm = scale;

  // 各部品の寸法をピクセルに変換
  const noseHeight = nose.length * pixelsPerCm;
  const noseWidth = nose.diameter * pixelsPerCm;
  const bodyHeight = body.length * pixelsPerCm;
  const bodyWidth = body.diameter * pixelsPerCm;
  const finHeight = fins.type === "trapozoidal" ? fins.height * pixelsPerCm : 0;
  const finRootChord =
    fins.type === "trapozoidal" ? fins.rootChord * pixelsPerCm : 0;
  const finTipChord =
    fins.type === "trapozoidal" ? fins.tipChord * pixelsPerCm : 0;
  const finSweepLength =
    fins.type === "trapozoidal" ? fins.sweepLength * pixelsPerCm : 0;

  // 全体の高さを計算
  const totalHeight = noseHeight + bodyHeight + finHeight;
  const totalWidth = Math.max(bodyWidth + finRootChord, 200);

  // 回転の中心点を計算
  const centerX = totalWidth / 2;
  const centerY = totalHeight / 2;

  // ピッチ角による回転変換
  const pitchTransform = `rotate(${pitchAngle}, ${centerX}, ${centerY})`;

  // フィンデータを事前計算し、z-order順にソート
  const { backFins, frontFins } = useMemo(() => {
    if (fins.type !== "trapozoidal") {
      return { backFins: [], frontFins: [] };
    }

    // フィンの基本頂点座標を生成
    const baseVertices = generateFinVertices(fins, pixelsPerCm);

    // フィンの取り付け位置
    const finAttachmentY =
      noseHeight + bodyHeight - fins.offset * pixelsPerCm - finRootChord;
    const bodyRadius = bodyWidth / 2;
    const bodyCenterX = totalWidth / 2;

    // 各フィンの投影データを計算
    const finData = Array.from({ length: fins.count }, (_, i) => {
      // フィンの配置角度（度）
      const finAngle = (360 / fins.count) * i + rollAngle + 12;

      // 3D配置から2D投影
      const projection = projectFinTo2D(
        baseVertices,
        finAngle,
        bodyCenterX,
        bodyRadius,
        finAttachmentY
      );

      const pointsString = projection.projectedVertices
        .map((v) => `${v.x.toFixed(2)},${v.y.toFixed(2)}`)
        .join(" ");

      return {
        index: i,
        points: pointsString,
        zOrder: projection.zOrder,
      };
    });

    // z-orderでソートし、前後に分割
    const sortedFins = finData.sort((a, b) => a.zOrder - b.zOrder);
    const backFins = sortedFins.filter((fin) => fin.zOrder < 0);
    const frontFins = sortedFins.filter((fin) => fin.zOrder >= 0);

    return { backFins, frontFins };
  }, [
    fins,
    pixelsPerCm,
    noseHeight,
    bodyHeight,
    finHeight,
    bodyWidth,
    totalWidth,
    rollAngle,
  ]);

  // 重心と圧力中心の位置を計算
  const { cgPosition, cpPosition } = useMemo(() => {
    const cgPosition = calculateCenterOfGravity(rocketParams) * pixelsPerCm;
    const cpPosition = calculateCenterOfPressure(rocketParams) * pixelsPerCm;
    return { cgPosition, cpPosition };
  }, [rocketParams, pixelsPerCm]);

  return (
    <g transform={pitchTransform}>
      {/* ノーズコーン */}
      <g transform={`translate(${(totalWidth - noseWidth) / 2}, 0)`}>
        {nose.type === "conical" ? (
          <polygon
            points={`${noseWidth / 2},0 0,${noseHeight} ${noseWidth},${noseHeight}`}
            fill={nose.color}
            stroke="#000"
            strokeWidth="1"
          />
        ) : nose.type === "ogive" ? (
          <path
            d={`M ${noseWidth / 2} 0 Q 0 ${noseHeight * 0.3} 0 ${noseHeight} L ${noseWidth} ${noseHeight} Q ${noseWidth} ${noseHeight * 0.3} ${noseWidth / 2} 0 Z`}
            fill={nose.color}
            stroke="#000"
            strokeWidth="1"
          />
        ) : (
          <ellipse
            cx={noseWidth / 2}
            cy={noseHeight}
            rx={noseWidth / 2}
            ry={noseHeight}
            fill={nose.color}
            stroke="#000"
            strokeWidth="1"
          />
        )}
      </g>

      {/* フィン（後方のもののみ先に描画） */}
      {backFins.map((fin) => (
        <polygon
          key={fin.index}
          points={fin.points}
          fill={fins.color}
          stroke="#000"
          strokeWidth="1"
        />
      ))}

      {/* ボディチューブ */}
      <g
        transform={`translate(${(totalWidth - bodyWidth) / 2}, ${noseHeight})`}
      >
        <rect
          width={bodyWidth}
          height={bodyHeight}
          fill={body.color}
          stroke="#000"
          strokeWidth="1"
        />
      </g>

      {/* フィン（前方のもののみ後で描画） */}
      {frontFins.map((fin) => (
        <polygon
          key={fin.index}
          points={fin.points}
          fill={fins.color}
          stroke="#000"
          strokeWidth="1"
        />
      ))}

      {/* 重心と圧力中心のマーカー */}
      {showCenterMarkers && (
        <g>
          {/* 重心マーカー（工学用シンボル） */}
          <g transform={`translate(${totalWidth / 2}, ${cgPosition})`}>
            <CenterMarker color="#FF0000" />
          </g>

          {/* 圧力中心マーカー（青色） */}
          <g transform={`translate(${totalWidth / 2}, ${cpPosition})`}>
            <CenterMarker color="#0000FF" />
          </g>
        </g>
      )}
    </g>
  );
};

export default RocketComponent;
