import React, { useMemo } from "react";
import type { RocketParams } from "../Rocket/types";
import type { RocketProperties } from "../../../utils/calculations/simulationEngine";
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
  pixelsPerM: number
): Point2D[] {
  if (finParams.type === "trapozoidal") {
    const rootChord = finParams.rootChord * pixelsPerM;
    const tipChord = finParams.tipChord * pixelsPerM;
    const height = finParams.height * pixelsPerM;
    const sweepLength = finParams.sweepLength * pixelsPerM;

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
  } else if (finParams.type === "elliptical") {
    const rootChord = finParams.rootChord * pixelsPerM;
    const height = finParams.height * pixelsPerM;

    // 楕円形フィンの頂点を計算（10点で近似）
    const points: Point2D[] = [];
    const numPoints = 10;

    // 楕円の中心と半径
    const centerY = rootChord / 2;

    // 楕円の外周上の点を計算（時計回り）
    for (let i = 0; i <= numPoints; i++) {
      const angle = (Math.PI * i) / numPoints - Math.PI / 2;
      let x = height * Math.cos(angle);
      let y = centerY - centerY * Math.sin(angle);

      // X座標を0以上に制限（ボディチューブより外側のみ）
      // x = Math.max(0, x);

      points.push({ x, y });
    }

    // // ボディチューブ接続線を追加して閉じたポリゴンにする
    // const orderedPoints: Point2D[] = [
    //   { x: 0, y: 0 }, // leading edge (前端)
    //   ...points.filter((p, i) => i <= numPoints / 2).sort((a, b) => a.y - b.y), // 上半分
    //   ...points.filter((p, i) => i > numPoints / 2).sort((a, b) => b.y - a.y), // 下半分
    //   { x: 0, y: rootChord }, // trailing edge (後端)
    // ];

    return points;
  }

  return [];
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
 * Calculate opacity for ghost mode based on z-order
 * @param {number} zOrder - Z-order value (-1 to 1, negative is back)
 * @param {boolean} isGhost - Whether ghost mode is enabled
 * @returns {number} Opacity value (0-1)
 */
function calculateGhostOpacity(zOrder: number, isGhost: boolean): number {
  if (!isGhost) return 1.0;

  // Base opacity for ghost mode
  const baseOpacity = 0.7;
  const minOpacity = 0.4;

  // For back fins (negative zOrder), reduce opacity further
  if (zOrder < 0) {
    const backOpacity = baseOpacity * (0.5 + Math.abs(zOrder) * 0.3);
    return Math.max(minOpacity, backOpacity);
  }

  // For front fins (positive zOrder), use higher opacity
  return baseOpacity + zOrder * 0.2;
}

/**
 * Get color with opacity for ghost mode
 * @param {string} color - Original color
 * @param {number} opacity - Opacity value (0-1)
 * @returns {string} Color with opacity
 */
function getColorWithOpacity(color: string, opacity: number): string {
  // Convert hex color to rgba if needed
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // If already rgba/rgb, modify opacity
  if (color.includes("rgba")) {
    return color.replace(/,\s*[\d.]+\)$/, `, ${opacity})`);
  }

  if (color.includes("rgb")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
  }

  return color;
}

/**
 * Props for RocketComponent
 * @interface RocketComponentProps
 * @property {RocketParams} rocketParams - Rocket design parameters
 * @property {RocketProperties} rocketProperties - Calculated rocket properties
 * @property {number} [scale=200] - Pixels per meter conversion rate
 * @property {number} [pitchAngle=0] - Pitch angle in degrees
 * @property {number} [rollAngle=0] - Roll angle in degrees
 * @property {boolean} [showCenterMarkers=false] - Whether to show center of gravity and pressure center markers
 * @property {boolean} [showPayload=false] - Whether to show payload section
 * @property {boolean} [isGhost=false] - Whether to render in ghost mode (semi-transparent)
 */
interface RocketComponentProps {
  rocketParams: RocketParams;
  rocketProperties: RocketProperties;
  scale?: number;
  pitchAngle?: number;
  rollAngle?: number;
  showCenterMarkers?: boolean;
  showPayload?: boolean;
  isGhost?: boolean;
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
  rocketProperties,
  scale = 200,
  pitchAngle = 0,
  rollAngle = 0,
  showCenterMarkers = false,
  showPayload = false,
  isGhost = false,
}) => {
  const { nose, body, fins, payload } = rocketParams;

  // 物理寸法をピクセルに変換（メートル単位）
  const pixelsPerM = scale;

  // 各部品の寸法をピクセルに変換（メートル単位）
  const noseHeight = nose.length * pixelsPerM;
  const noseWidth = nose.diameter * pixelsPerM;
  const bodyHeight = body.length * pixelsPerM;
  const bodyWidth = body.diameter * pixelsPerM;
  const finHeight =
    fins.type === "trapozoidal" || fins.type === "elliptical"
      ? fins.height * pixelsPerM
      : 0;
  const finOffset = fins.offset * pixelsPerM;

  const payloadOffset = payload.offset * pixelsPerM;
  const payloadDiameter = payload.diameter * pixelsPerM;
  const payloadLength = payload.length * pixelsPerM;

  // 全体の高さを計算
  const totalHeight = noseHeight + bodyHeight;

  // フィンを考慮した全体の幅を計算
  const finExtension =
    fins.type === "trapozoidal" || fins.type === "elliptical"
      ? finHeight
      : fins.type === "freedom"
        ? Math.max(...fins.points.map((p) => p.x)) * pixelsPerM
        : 0;
  const totalWidth = Math.max(bodyWidth, bodyWidth + finExtension * 2);

  // 回転の中心点を計算
  const centerX = totalWidth / 2;
  const centerY = totalHeight / 2;

  // ピッチ角による回転変換
  const pitchTransform = `rotate(${-pitchAngle + 90}, ${centerX}, ${centerY})`;

  // フィンデータを事前計算し、z-order順にソート
  const { backFins, frontFins } = useMemo(() => {
    let baseVertices: Point2D[] = [];
    let finAttachmentY = 0;

    // フィンの基本頂点座標を生成
    if (fins.type === "trapozoidal") {
      baseVertices = generateFinVertices(fins, pixelsPerM);
      // フィンの取り付け位置
      finAttachmentY =
        noseHeight + bodyHeight - finOffset - fins.rootChord * pixelsPerM;
    } else if (fins.type === "elliptical") {
      baseVertices = generateFinVertices(fins, pixelsPerM);
      // フィンの取り付け位置（楕円形フィンの場合）
      finAttachmentY =
        noseHeight + bodyHeight - finOffset - fins.rootChord * pixelsPerM;
    } else if (fins.type === "freedom") {
      // 自由形状フィンの頂点を直接使用
      baseVertices = fins.points.map((p) => ({
        x: p.x * pixelsPerM,
        y: p.y * pixelsPerM,
      }));
      const rootChord =
        baseVertices.reduce((max, p) => Math.max(max, p.y), 0) -
        baseVertices.reduce((min, p) => Math.min(min, p.y), 0);
      finAttachmentY = noseHeight + bodyHeight - finOffset - rootChord;
    }

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
    pixelsPerM,
    noseHeight,
    bodyHeight,
    finHeight,
    bodyWidth,
    totalWidth,
    rollAngle,
  ]);

  // 重心と圧力中心の位置を計算（実際の計算結果を使用）
  const { cgPosition, cpPosition } = useMemo(() => {
    // Use calculated rocket properties with meter-to-pixel conversion
    const cgPosition = rocketProperties.specs.CGlen_f * pixelsPerM; // m to pixels
    const cpPosition = rocketProperties.specs.CPlen * pixelsPerM; // m to pixels
    return { cgPosition, cpPosition };
  }, [rocketProperties, pixelsPerM]);

  return (
    <g transform={pitchTransform}>
      {/* ノーズコーン */}
      <g transform={`translate(${(totalWidth - noseWidth) / 2}, 0)`}>
        {nose.type === "conical" ? (
          <polygon
            points={`${noseWidth / 2},0 0,${noseHeight} ${noseWidth},${noseHeight}`}
            fill={isGhost ? getColorWithOpacity(nose.color, 0.9) : nose.color}
            stroke={isGhost ? getColorWithOpacity("#000", 0.9) : "#000"}
            strokeWidth="1"
          />
        ) : nose.type === "ogive" ? (
          <path
            d={`M ${noseWidth / 2} 0 Q 0 ${noseHeight * 0.3} 0 ${noseHeight} L ${noseWidth} ${noseHeight} Q ${noseWidth} ${noseHeight * 0.3} ${noseWidth / 2} 0 Z`}
            fill={isGhost ? getColorWithOpacity(nose.color, 0.9) : nose.color}
            stroke={isGhost ? getColorWithOpacity("#000", 0.9) : "#000"}
            strokeWidth="1"
          />
        ) : (
          <ellipse
            cx={noseWidth / 2}
            cy={noseHeight}
            rx={noseWidth / 2}
            ry={noseHeight}
            fill={isGhost ? getColorWithOpacity(nose.color, 0.9) : nose.color}
            stroke={isGhost ? getColorWithOpacity("#000", 0.9) : "#000"}
            strokeWidth="1"
          />
        )}
      </g>

      {/* フィン（後方のもののみ先に描画） */}
      {backFins.map((fin) => {
        const opacity = calculateGhostOpacity(fin.zOrder, isGhost);
        const fillColor = getColorWithOpacity(fins.color, opacity);
        const strokeColor = "#000";

        return (
          <polygon
            key={fin.index}
            points={fin.points}
            fill={fillColor}
            stroke={
              isGhost ? getColorWithOpacity(strokeColor, 0.9) : strokeColor
            }
            strokeWidth="1"
          />
        );
      })}

      {/* ボディチューブ */}
      <g
        transform={`translate(${(totalWidth - bodyWidth) / 2}, ${noseHeight})`}
      >
        <rect
          width={bodyWidth}
          height={bodyHeight}
          fill={isGhost ? getColorWithOpacity(body.color, 0.9) : body.color}
          stroke={isGhost ? getColorWithOpacity("#000", 0.9) : "#000"}
          strokeWidth="1"
        />
      </g>

      {/* フィン（前方のもののみ後で描画） */}
      {frontFins.map((fin) => {
        const opacity = calculateGhostOpacity(fin.zOrder, isGhost);
        const fillColor = getColorWithOpacity(fins.color, opacity);
        const strokeColor = "#000";

        return (
          <polygon
            key={fin.index}
            points={fin.points}
            fill={fillColor}
            stroke={
              isGhost ? getColorWithOpacity(strokeColor, 0.9) : strokeColor
            }
            strokeWidth="1"
          />
        );
      })}
      {/* ペイロードセクション */}
      {showPayload && payload.length > 0 && (
        <g
          transform={`translate(${(totalWidth - bodyWidth) / 2}, ${noseHeight})`}
        >
          <rect
            x={(bodyWidth - payloadDiameter) / 2}
            y={payloadOffset}
            width={payloadDiameter}
            height={payloadLength}
            fill={"None"}
            stroke={isGhost ? getColorWithOpacity("#000", 0.9) : "#000"}
            strokeWidth="3"
            strokeDasharray="3.5,3.5"
            rx="5"
            ry="5"
          />
        </g>
      )}

      {/* 重心と圧力中心のマーカー */}
      {showCenterMarkers && (
        <g>
          {/* 重心マーカー */}
          <g transform={`translate(${totalWidth / 2}, ${cgPosition})`}>
            <CenterMarker color="#0000FF" />
          </g>

          {/* 圧力中心マーカー */}
          <g transform={`translate(${totalWidth / 2}, ${cpPosition})`}>
            <CenterMarker color="#FF0000" />
          </g>
        </g>
      )}
    </g>
  );
};

export default RocketComponent;
