import React from "react";
import type { RocketParams } from "../Rocket/types";

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
    { x: rootChord, y: 0 }, // root trailing edge
    { x: sweepLength + tipChord, y: height }, // tip trailing edge
    { x: sweepLength, y: height }, // tip leading edge
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
): { projectedVertices: Point2D[]; opacity: number; zOrder: number } {
  const finAngleRad = (finAngleDeg * Math.PI) / 180;
  const cos = Math.cos(finAngleRad);
  const sin = Math.sin(finAngleRad);

  // 側面図での圧縮率（角度による見え方の変化）
  const compressionFactor = Math.abs(cos);

  // フィンの取り付け位置（ボディチューブ表面）
  const finBaseX = bodyCenterX + bodyRadius * cos;

  // 可視性の計算（前面にあるフィンほど不透明）
  const opacity = Math.max(0.2, (cos + 1) / 2);

  // Z-order（右側面図なのでcosの値で決定、負の値が後方）
  const zOrder = cos;

  // 各頂点を2D投影
  const projectedVertices = vertices.map((vertex) => ({
    x: finBaseX + vertex.x * compressionFactor,
    y: finAttachmentY + vertex.y,
  }));

  return { projectedVertices, opacity, zOrder };
}

/**
 * Props for RocketComponent
 * @interface RocketComponentProps
 * @property {RocketParams} rocketParams - Rocket design parameters
 * @property {number} [scale=2] - Pixels per centimeter conversion rate
 * @property {number} [pitchAngle=0] - Pitch angle in degrees
 * @property {number} [rollAngle=0] - Roll angle in degrees
 */
interface RocketComponentProps {
  rocketParams: RocketParams;
  scale?: number;
  pitchAngle?: number;
  rollAngle?: number;
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

      {/* フィン（正確な3D→2D投影で描画） */}
      {fins.type === "trapozoidal" &&
        (() => {
          // フィンの基本頂点座標を生成
          const baseVertices = generateFinVertices(fins, pixelsPerCm);

          // フィンの取り付け位置（offsetを考慮）
          const finAttachmentY =
            noseHeight + bodyHeight - fins.offset * pixelsPerCm;
          const bodyRadius = bodyWidth / 2;
          const bodyCenterX = totalWidth / 2;

          // 各フィンの投影データを計算
          const finData = Array.from({ length: fins.count }, (_, i) => {
            // フィンの配置角度（度）
            const finAngle = (360 / fins.count) * i + rollAngle;

            // 3D配置から2D投影
            const projection = projectFinTo2D(
              baseVertices,
              finAngle,
              bodyCenterX,
              bodyRadius,
              finAttachmentY
            );

            return {
              index: i,
              vertices: projection.projectedVertices,
              opacity: projection.opacity,
              zOrder: projection.zOrder,
            };
          });

          // z-orderでソート（後方のフィンから描画）
          finData.sort((a, b) => a.zOrder - b.zOrder);

          return finData.map((fin) => {
            const pointsString = fin.vertices
              .map((v) => `${v.x.toFixed(2)},${v.y.toFixed(2)}`)
              .join(" ");

            return (
              <polygon
                key={fin.index}
                points={pointsString}
                fill={fins.color}
                stroke="#000"
                strokeWidth="1"
                opacity={fin.opacity}
              />
            );
          });
        })()}
    </g>
  );
};

export default RocketComponent;
