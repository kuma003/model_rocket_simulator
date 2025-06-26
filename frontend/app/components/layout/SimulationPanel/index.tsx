import React, { useEffect, useState } from "react";
import type { RocketParams } from "../../features/Rocket/types";
import styles from "./simulationPanel.module.scss";
import { Stack, ScrollArea, Text, Card, Group, Divider } from "@mantine/core";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export interface SimulationPanelProps {
  rocketParams: RocketParams;
}

interface SimulationResults {
  dryMass: number;
  inertiaMoment: number;
  flightTime: number;
  maxAltitude: number;
  altitudeData: { time: number; altitude: number }[];
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({ rocketParams }) => {
  const [results, setResults] = useState<SimulationResults>({
    dryMass: 0,
    inertiaMoment: 0,
    flightTime: 0,
    maxAltitude: 0,
    altitudeData: [],
  });

  // 簡易的な計算関数
  const calculateSimulation = (params: RocketParams): SimulationResults => {
    // 材料密度 (g/cm³)
    const materialDensity = {
      plastic: 1.2,
      balsa: 0.15,
      cardboard: 0.7,
    };

    // ノーズ重量計算
    const noseVolume = Math.PI * Math.pow(params.nose.diameter / 2, 2) * params.nose.length * params.nose.thickness;
    const noseMass = noseVolume * materialDensity[params.nose.material];

    // ボディ重量計算
    const bodyVolume = Math.PI * params.body.diameter * params.body.length * params.body.thickness;
    const bodyMass = bodyVolume * materialDensity[params.body.material];

    // フィン重量計算
    let finMass = 0;
    if (params.fins.type === "trapozoidal") {
      const finArea = (params.fins.rootChord + params.fins.tipChord) * params.fins.height / 2;
      const finVolume = finArea * params.fins.thickness * params.fins.count;
      finMass = finVolume * materialDensity[params.fins.material];
    }

    const dryMass = noseMass + bodyMass + finMass;

    // 慣性モーメント計算（簡易）
    const length = params.nose.length + params.body.length;
    const inertiaMoment = (dryMass * Math.pow(length, 2)) / 12;

    // 飛行時間と高度（簡易計算）
    const flightTime = Math.sqrt(2 * 100 / 9.81); // 100m高度での時間
    const maxAltitude = Math.max(50, dryMass * 3); // 重量に応じた高度

    // 軌道データ生成
    const altitudeData = [];
    for (let i = 0; i <= 20; i++) {
      const time = i * 0.5;
      const altitude = time <= 2 ? 
        Math.pow(time, 2) * 25 : // 上昇フェーズ
        Math.max(0, maxAltitude - Math.pow(time - 2, 2) * 5); // 下降フェーズ
      altitudeData.push({ time, altitude });
    }

    return {
      dryMass,
      inertiaMoment,
      flightTime,
      maxAltitude,
      altitudeData,
    };
  };

  useEffect(() => {
    const newResults = calculateSimulation(rocketParams);
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
                <Text size="sm" c="white">乾燥重量</Text>
                <Text size="sm" c="white" fw={600}>{results.dryMass.toFixed(1)}g</Text>
              </Group>
            </Card>

            <Divider />

            {/* 性能セクション */}
            <Card shadow="sm" padding="md" radius="md">
              <Group justify="space-between">
                <Text size="sm" c="white">慣性モーメント</Text>
                <Text size="sm" c="white" fw={600}>{results.inertiaMoment.toFixed(2)}g·cm²</Text>
              </Group>
            </Card>

            <Card shadow="sm" padding="md" radius="md">
              <Group justify="space-between">
                <Text size="sm" c="white">飛行時間</Text>
                <Text size="sm" c="white" fw={600}>{results.flightTime.toFixed(1)}秒</Text>
              </Group>
            </Card>

            <Card shadow="sm" padding="md" radius="md">
              <Group justify="space-between">
                <Text size="sm" c="white">最高高度</Text>
                <Text size="sm" c="white" fw={600}>{results.maxAltitude.toFixed(1)}m</Text>
              </Group>
            </Card>

            <Divider />

            {/* 軌道グラフ */}
            <Card shadow="sm" padding="md" radius="md">
              <Text size="sm" c="white" mb="sm">高度-時間履歴</Text>
              <div style={{ height: 200, width: "100%" }}>
                <ResponsiveContainer>
                  <BarChart data={results.altitudeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fill: 'white', fontSize: 10 }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                    />
                    <YAxis 
                      tick={{ fill: 'white', fontSize: 10 }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
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