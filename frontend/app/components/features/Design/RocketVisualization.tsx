import React from "react";
import type { RocketParams } from "../Rocket/types";
import styles from "./rocketVisualization.module.scss";

interface RocketVisualizationProps {
  rocketParams: RocketParams;
  scale?: number; // cm/px - センチメートル/ピクセル比
}

const RocketVisualization: React.FC<RocketVisualizationProps> = ({
  rocketParams,
  scale = 0.5, // デフォルト: 0.5cm/px
}) => {
  const { nose, body, fins } = rocketParams;
  
  // 物理寸法をピクセルに変換
  const pixelsPerCm = 1 / scale;
  
  // 各部品の寸法をピクセルに変換
  const noseHeight = nose.length * pixelsPerCm;
  const noseWidth = nose.diameter * pixelsPerCm;
  const bodyHeight = body.length * pixelsPerCm;
  const bodyWidth = body.diameter * pixelsPerCm;
  const finHeight = fins.height * pixelsPerCm;
  const finRootChord = fins.rootChord * pixelsPerCm;
  const finTipChord = fins.tipChord * pixelsPerCm;
  const finSweepLength = fins.sweepLength * pixelsPerCm;
  
  // 全体の高さを計算
  const totalHeight = noseHeight + bodyHeight + finHeight;
  
  // フィンの角度を計算（3等分配置）
  const finAngles = Array.from({ length: fins.count }, (_, i) => 
    (360 / fins.count) * i
  );
  
  return (
    <div className={styles.container}>
      <div className={styles.scaleInfo}>
        スケール: {scale}cm/px
      </div>
      <svg
        width={Math.max(bodyWidth + finRootChord, 200)}
        height={totalHeight + 20}
        viewBox={`0 0 ${Math.max(bodyWidth + finRootChord, 200)} ${totalHeight + 20}`}
        className={styles.rocketSvg}
      >
        {/* ノーズコーン */}
        <g transform={`translate(${(bodyWidth - noseWidth) / 2}, 10)`}>
          {nose.type === "conical" ? (
            <polygon
              points={`${noseWidth / 2},0 0,${noseHeight} ${noseWidth},${noseHeight}`}
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
        <g transform={`translate(${(bodyWidth - bodyWidth) / 2}, ${noseHeight + 10})`}>
          <rect
            width={bodyWidth}
            height={bodyHeight}
            fill={body.color}
            stroke="#000"
            strokeWidth="1"
          />
        </g>
        
        {/* フィン（側面図なので1つだけ表示） */}
        <g transform={`translate(${bodyWidth / 2}, ${noseHeight + bodyHeight + 10})`}>
          <polygon
            points={`0,0 ${finRootChord},0 ${finRootChord - finSweepLength},${finHeight} ${finRootChord - finSweepLength - finTipChord},${finHeight}`}
            fill={fins.color}
            stroke="#000"
            strokeWidth="1"
          />
        </g>
        
        {/* 寸法線と数値 */}
        <g className={styles.dimensions}>
          {/* 全長 */}
          <line
            x1={Math.max(bodyWidth + finRootChord, 200) - 30}
            y1={10}
            x2={Math.max(bodyWidth + finRootChord, 200) - 30}
            y2={totalHeight + 10}
            stroke="#666"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          <text
            x={Math.max(bodyWidth + finRootChord, 200) - 25}
            y={totalHeight / 2 + 10}
            fill="#666"
            fontSize="10"
            textAnchor="start"
          >
            {((nose.length + body.length + fins.height) / 10).toFixed(1)}cm
          </text>
        </g>
      </svg>
    </div>
  );
};

export default RocketVisualization;