import React from "react";
import type { RocketParams } from "../../features/Rocket/types";
import {
  type RocketProperties,
  type TrajectoryData,
} from "../../../utils/calculations/simulationEngine";
import styles from "./simulationPanel.module.scss";
import { Stack, ScrollArea, Text, Card, Group, Divider } from "@mantine/core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { UNIT_CONVERSIONS } from "~/utils/physics/constants";
import LaunchButton from "~/components/common/LaunchButton/LaunchButton";

export interface SimulationPanelProps {
  rocketParams: RocketParams;
  rocketProperties: RocketProperties;
  trajectoryData: TrajectoryData;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({
  rocketParams,
  rocketProperties,
  trajectoryData,
}) => {
  const { G_TO_KG, CM_TO_M } = UNIT_CONVERSIONS;

  return (
    <div className={styles.panelContainer}>
      <div className={styles.topButtonArea}>
        <LaunchButton rocketParams={rocketParams} />
      </div>
      
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.icon}>📊</div>
          <h2>シミュレーション結果</h2>
        </div>

        <Stack className={styles.content}>
        <ScrollArea className={styles.scrollArea}>
          <Stack gap="md">
            {/* 重量セクション */}
            <Card shadow="sm" padding="md" radius="md">
              <Group justify="space-between">
                <Text size="sm" c="white">
                  乾燥重量
                </Text>
                <Text size="sm" c="white" fw={600}>
                  {(rocketProperties.dryMass / G_TO_KG).toFixed(1) + " "}g
                </Text>
              </Group>
            </Card>

            <Divider />

            {/* 性能セクション */}
            <Card shadow="sm" padding="md" radius="md">
              <Group justify="space-between">
                <Text size="sm" c="white">
                  機体全長
                </Text>
                <Text size="sm" c="white" fw={600}>
                  {(rocketProperties.specs.ref_len / CM_TO_M).toFixed(1) + " "}
                  cm
                </Text>
              </Group>
            </Card>

            <Card shadow="sm" padding="md" radius="md">
              <Group justify="space-between">
                <Text size="sm" c="white">
                  飛行時間
                </Text>
                <Text size="sm" c="white" fw={600}>
                  {trajectoryData.flightTime.toFixed(1) + " "}秒
                </Text>
              </Group>
            </Card>

            <Card shadow="sm" padding="md" radius="md">
              <Group justify="space-between">
                <Text size="sm" c="white">
                  最高高度
                </Text>
                <Text size="sm" c="white" fw={600}>
                  {trajectoryData.maxAltitude.toFixed(1) + " "}m
                </Text>
              </Group>
            </Card>

            <Card shadow="sm" padding="md" radius="md">
              <Group justify="space-between">
                <Text size="sm" c="white">
                  安定比
                </Text>
                <Text
                  size="sm"
                  c={rocketProperties.stabilityMargin > 0 ? "white" : "red"}
                  fw={600}
                >
                  {(rocketProperties.stabilityMargin * 100).toFixed(1) + " "}%
                </Text>
              </Group>
            </Card>

            <Divider />

            {/* 軌道グラフ */}
            <Card shadow="sm" padding="md" radius="md">
              <Text size="sm" c="white" mb="sm">
                高度-時間履歴
              </Text>
              <div style={{ height: 200, width: "100%" }}>
                <ResponsiveContainer>
                  <LineChart data={trajectoryData.altitudeData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis
                      dataKey="time"
                      tick={{ fill: "white", fontSize: 10 }}
                      axisLine={{ stroke: "rgba(255,255,255,0.3)" }}
                      tickCount={5}
                      tickFormatter={(value) => value.toFixed(0)}
                    />
                    <YAxis
                      tick={{ fill: "white", fontSize: 10 }}
                      axisLine={{ stroke: "rgba(255,255,255,0.3)" }}
                      tickFormatter={(value) => value.toFixed(0)}
                      domain={[0, "dataMax"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="altitude"
                      stroke="white"
                      strokeWidth={2}
                      dot={false}
                      name="altitude"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Stack>
        </ScrollArea>
      </Stack>
      </div>
    </div>
  );
};

export default SimulationPanel;
