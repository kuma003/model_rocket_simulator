import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MotorData } from "../../../utils/motorParser";
import styles from "./thrustCurveChart.module.scss";

export interface ThrustCurveChartProps {
  motorData: MotorData | null;
  loading?: boolean;
}

const ThrustCurveChart: React.FC<ThrustCurveChartProps> = ({
  motorData,
  loading,
}) => {
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>スラストカーブを読み込み中...</div>
      </div>
    );
  }

  if (!motorData) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>エンジンデータが見つかりません</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>スラストカーブ - {motorData.name}</h3>
        <div className={styles.specs}>
          <span>最大推力: {motorData.peakThrust.toFixed(1)}N</span>
          <span>平均推力: {motorData.averageThrust.toFixed(1)}N</span>
          <span>燃焼時間: {motorData.burnTime.toFixed(2)}s</span>
          <span>総インパルス: {motorData.totalImpulse.toFixed(1)}Ns</span>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={motorData.thrustCurve}
            margin={{
              top: 5,
              right: 30,
              left: 5,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              label={{
                value: "時間 (s)",
                position: "insideBottom",
                offset: -10,
              }}
              domain={[0, "dataMax"]}
              tickCount={5}
              type="number"
            />
            <YAxis
              label={{
                value: "推力 (N)",
                angle: -90,
                position: "insideLeft",
              }}
              style={{ margin: "0" }}
              domain={[0, "dataMax"]}
              tickCount={5}
            />
            <Tooltip
              formatter={(value, name) => [
                `${(value as number).toFixed(2)}N`,
                name === "thrust" ? "推力" : name,
              ]}
              labelFormatter={(label) =>
                `時間: ${(label as number).toFixed(3)}s`
              }
            />
            <Line
              type="monotone"
              dataKey="thrust"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
              name="推力"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ThrustCurveChart;
