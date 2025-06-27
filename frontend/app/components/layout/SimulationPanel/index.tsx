import React, { useEffect, useState } from "react";
import type { RocketParams } from "../../features/Rocket/types";
import { runSimulation, type SimulationResults } from "../../../utils/calculations/simulationEngine";
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
} from "recharts";

export interface SimulationPanelProps {
  rocketParams: RocketParams;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({ rocketParams }) => {
  const [results, setResults] = useState<SimulationResults>({
    dryMass: 0,
    inertiaMoment: 0,
    flightTime: 0,
    maxAltitude: 0,
    altitudeData: [],
  });

  useEffect(() => {
    const newResults = runSimulation(rocketParams);
    setResults(newResults);
  }, [rocketParams]);

  return (
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
                  {results.dryMass.toFixed(1)}g
                </Text>
              </Group>
            </Card>

            <Divider />

            {/* 性能セクション */}
            <Card shadow="sm" padding="md" radius="md">
              <Group justify="space-between">
                <Text size="sm" c="white">
                  慣性モーメント
                </Text>
                <Text size="sm" c="white" fw={600}>
                  {results.inertiaMoment.toFixed(2)}g·cm²
                </Text>
              </Group>
            </Card>

            <Card shadow="sm" padding="md" radius="md">
              <Group justify="space-between">
                <Text size="sm" c="white">
                  飛行時間
                </Text>
                <Text size="sm" c="white" fw={600}>
                  {results.flightTime.toFixed(1)}秒
                </Text>
              </Group>
            </Card>

            <Card shadow="sm" padding="md" radius="md">
              <Group justify="space-between">
                <Text size="sm" c="white">
                  最高高度
                </Text>
                <Text size="sm" c="white" fw={600}>
                  {results.maxAltitude.toFixed(1)}m
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
                  <BarChart data={results.altitudeData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis
                      dataKey="time"
                      tick={{ fill: "white", fontSize: 10 }}
                      axisLine={{ stroke: "rgba(255,255,255,0.3)" }}
                    />
                    <YAxis
                      tick={{ fill: "white", fontSize: 10 }}
                      axisLine={{ stroke: "rgba(255,255,255,0.3)" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="altitude" fill="#4ecdc4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Stack>
        </ScrollArea>
      </Stack>
    </div>
  );
};

export default SimulationPanel;
