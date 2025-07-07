import React from "react";
import type { RocketParams } from "../Rocket/types";

// 2D座標の型定義
interface Point2D {
  x: number;
  y: number;
}

// フィンの頂点座標を生成する関数（ローカル座標系）
function generateFinVertices(finParams: RocketParams["fins"], pixelsPerCm: number): Point2D[] {
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
    { x: 0, y: 0 },                              // root leading edge (ボディ接続点)
    { x: rootChord, y: 0 },                      // root trailing edge
    { x: rootChord - sweepLength, y: height },   // tip trailing edge
    { x: -tipChord + sweepLength, y: height },   // tip leading edge
  ];
}

// フィンを3D配置から2D投影する関数
function projectFinTo2D(
  vertices: Point2D[], 
  finAngleDeg: number, 
  bodyCenterX: number, 
  bodyRadius: number, 
  finAttachmentY: number
): { projectedVertices: Point2D[], opacity: number, zOrder: number } {
  const finAngleRad = (finAngleDeg * Math.PI) / 180;
  const cos = Math.cos(finAngleRad);
  const sin = Math.sin(finAngleRad);
  
  // 側面図での圧縮率（角度による見え方の変化）
  const compressionFactor = Math.abs(cos);
  
  // フィンの取り付け位置（ボディチューブ表面）
  const finBaseX = bodyCenterX + bodyRadius * cos;
  
  // 可視性の計算（前面にあるフィンほど不透明）
  const opacity = Math.max(0.2, (cos + 1) / 2);
  
  // Z-order（sinの値で決定、負の値が後方）
  const zOrder = sin;
  
  // 各頂点を2D投影
  const projectedVertices = vertices.map(vertex => ({
    x: finBaseX + vertex.x * compressionFactor,
    y: finAttachmentY + vertex.y,
  }));
  
  return { projectedVertices, opacity, zOrder };
}

interface RocketComponentProps {
  rocketParams: RocketParams;
  scale?: number; // px/cm - ピクセル/センチメートル比
  pitchAngle?: number; // ピッチ角（度）
  rollAngle?: number; // ロール角（度）
}

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
            cy={noseHeight / 2}
            rx={noseWidth / 2}
            ry={noseHeight / 2}
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
          
          // フィンの取り付け位置
          const finAttachmentY = noseHeight + bodyHeight;
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
              .map(v => `${v.x.toFixed(2)},${v.y.toFixed(2)}`)
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
