import React from "react";
import type { RocketParams } from "../Rocket/types";
import RocketComponent from "./RocketComponent";
import styles from "./rocketVisualization.module.scss";

interface RocketVisualizationProps {
  rocketParams: RocketParams;
  scale?: number; // px/cm - ピクセル/センチメートル比
  pitchAngle?: number; // ピッチ角（度）
  rollAngle?: number; // ロール角（度）
}

const RocketVisualization: React.FC<RocketVisualizationProps> = ({
  rocketParams,
  scale = 2,
  pitchAngle = 0,
  rollAngle = 0,
}) => {
  const { nose, body, fins } = rocketParams;

  // 物理寸法をピクセルに変換
  const pixelsPerCm = scale;

  // 各部品の寸法をピクセルに変換して全体サイズを計算
  const noseHeight = nose.length * pixelsPerCm;
  const bodyHeight = body.length * pixelsPerCm;
  const finHeight = fins.type === "trapozoidal" ? fins.height * pixelsPerCm : 0;
  const finRootChord =
    fins.type === "trapozoidal" ? fins.rootChord * pixelsPerCm : 0;
  const bodyWidth = body.diameter * pixelsPerCm;

  const totalHeight = noseHeight + bodyHeight + finHeight;
  const totalWidth = Math.max(bodyWidth + finRootChord, 200);

  return (
    <div className={styles.container}>
      <svg
        width={totalWidth + 40}
        height={totalHeight + 40}
        viewBox={`0 0 ${totalWidth + 40} ${totalHeight + 40}`}
        className={styles.rocketSvg}
      >
        <g transform="translate(20, 20)">
          <RocketComponent
            rocketParams={rocketParams}
            scale={scale}
            pitchAngle={pitchAngle}
            rollAngle={rollAngle}
          />
        </g>
      </svg>
    </div>
  );
};

export default RocketVisualization;
