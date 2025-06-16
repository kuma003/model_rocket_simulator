import React, { useState, useEffect } from "react";
import type { RocketParams } from "../../features/Rocket/types";
import styles from "./rocketPanel.module.scss";
import { Settings } from "../../ui/Icons";
import {
  SegmentedControl,
  Stack,
  TextInput,
  NumberInput,
  Select,
  ColorInput,
  Button,
  Group,
  Divider,
  ScrollArea,
} from "@mantine/core";
import ThrustCurveChart from "../../features/ThrustCurveChart";
import { loadMotorData, type MotorData } from "../../../utils/motorParser";

export interface RocketPanelProps {
  rocketParams?: RocketParams;
  setRocketParams: (params: RocketParams) => void;
}

const defaultRocketParams: RocketParams = {
  name: "新しいロケット",
  designer: "",
  nose: {
    length: 10,
    diameter: 2.4,
    thickness: 0.1,
    material: "plastic",
    color: "#FF0000",
    type: "conical",
  },
  body: {
    length: 30,
    diameter: 2.4,
    thickness: 0.1,
    material: "cardboard",
    color: "#FFFF00",
  },
  fins: {
    thickness: 0.1,
    material: "balsa",
    color: "#0000FF",
    count: 3,
    type: "trapozoidal",
    rootChord: 5,
    tipChord: 2,
    sweepLength: 3,
    height: 4,
  },
  engine: {
    name: "Estes A10",
  },
};

const RocketPanel: React.FC<RocketPanelProps> = ({ 
  rocketParams = defaultRocketParams, 
  setRocketParams 
}) => {
  const [activeSection, setActiveSection] = useState("ノーズ");
  const [params, setParams] = useState<RocketParams>(rocketParams);
  const [motorData, setMotorData] = useState<MotorData | null>(null);
  const [loadingMotorData, setLoadingMotorData] = useState(false);

  const updateParams = (newParams: Partial<RocketParams>) => {
    const updatedParams = { ...params, ...newParams };
    setParams(updatedParams);
    setRocketParams(updatedParams);
  };

  useEffect(() => {
    const loadMotor = async () => {
      if (params.engine.name) {
        setLoadingMotorData(true);
        try {
          const data = await loadMotorData(params.engine.name);
          setMotorData(data);
        } catch (error) {
          console.error('Failed to load motor data:', error);
          setMotorData(null);
        } finally {
          setLoadingMotorData(false);
        }
      } else {
        setMotorData(null);
      }
    };

    loadMotor();
  }, [params.engine.name]);

  const handleImport = () => {
    console.log("Import functionality - to be implemented");
  };

  const handleExport = () => {
    console.log("Export functionality - to be implemented");
    console.log("Current params:", params);
  };

  const renderNoseSection = () => (
    <Stack gap="sm">
      <Select
        label="ノーズコーンタイプ"
        value={params.nose.type}
        onChange={(value) => updateParams({ nose: { ...params.nose, type: value as any } })}
        data={[
          { value: "conical", label: "円錐型" },
          { value: "ogive", label: "オジャイブ型" },
          { value: "elliptical", label: "楕円型" },
        ]}
      />
      <NumberInput
        label="長さ (cm)"
        value={params.nose.length}
        onChange={(value) => updateParams({ nose: { ...params.nose, length: Number(value) || 0 } })}
        min={0}
        step={0.1}
      />
      <NumberInput
        label="直径 (cm)"
        value={params.nose.diameter}
        onChange={(value) => updateParams({ nose: { ...params.nose, diameter: Number(value) || 0 } })}
        min={0}
        step={0.1}
      />
      <NumberInput
        label="厚さ (cm)"
        value={params.nose.thickness}
        onChange={(value) => updateParams({ nose: { ...params.nose, thickness: Number(value) || 0 } })}
        min={0}
        step={0.01}
      />
      <Select
        label="材質"
        value={params.nose.material}
        onChange={(value) => updateParams({ nose: { ...params.nose, material: value as any } })}
        data={[
          { value: "plastic", label: "プラスチック" },
          { value: "balsa", label: "バルサ" },
          { value: "cardboard", label: "厚紙" },
        ]}
      />
      <ColorInput
        label="色"
        value={params.nose.color}
        onChange={(value) => updateParams({ nose: { ...params.nose, color: value } })}
      />
    </Stack>
  );

  const renderBodySection = () => (
    <Stack gap="sm">
      <NumberInput
        label="長さ (cm)"
        value={params.body.length}
        onChange={(value) => updateParams({ body: { ...params.body, length: Number(value) || 0 } })}
        min={0}
        step={0.1}
      />
      <NumberInput
        label="直径 (cm)"
        value={params.body.diameter}
        onChange={(value) => updateParams({ body: { ...params.body, diameter: Number(value) || 0 } })}
        min={0}
        step={0.1}
      />
      <NumberInput
        label="厚さ (cm)"
        value={params.body.thickness}
        onChange={(value) => updateParams({ body: { ...params.body, thickness: Number(value) || 0 } })}
        min={0}
        step={0.01}
      />
      <Select
        label="材質"
        value={params.body.material}
        onChange={(value) => updateParams({ body: { ...params.body, material: value as any } })}
        data={[
          { value: "plastic", label: "プラスチック" },
          { value: "balsa", label: "バルサ" },
          { value: "cardboard", label: "厚紙" },
        ]}
      />
      <ColorInput
        label="色"
        value={params.body.color}
        onChange={(value) => updateParams({ body: { ...params.body, color: value } })}
      />
    </Stack>
  );

  const renderFinSection = () => (
    <Stack gap="sm">
      <NumberInput
        label="フィン数"
        value={params.fins.count}
        onChange={(value) => updateParams({ fins: { ...params.fins, count: Number(value) || 0 } })}
        min={1}
        max={8}
      />
      <Select
        label="フィンタイプ"
        value={params.fins.type}
        onChange={(value) => {
          if (value === "trapozoidal") {
            updateParams({
              fins: {
                ...params.fins,
                type: "trapozoidal",
                rootChord: 5,
                tipChord: 2,
                sweepLength: 3,
                height: 4,
              }
            });
          }
        }}
        data={[
          { value: "trapozoidal", label: "台形" },
          { value: "elliptical", label: "楕円" },
          { value: "freedom", label: "自由形状" },
        ]}
      />
      {params.fins.type === "trapozoidal" && (
        <>
          <NumberInput
            label="ルートコード (cm)"
            value={(params.fins as any).rootChord}
            onChange={(value) => updateParams({ fins: { ...params.fins, rootChord: Number(value) || 0 } as any })}
            min={0}
            step={0.1}
          />
          <NumberInput
            label="チップコード (cm)"
            value={(params.fins as any).tipChord}
            onChange={(value) => updateParams({ fins: { ...params.fins, tipChord: Number(value) || 0 } as any })}
            min={0}
            step={0.1}
          />
          <NumberInput
            label="スイープ長 (cm)"
            value={(params.fins as any).sweepLength}
            onChange={(value) => updateParams({ fins: { ...params.fins, sweepLength: Number(value) || 0 } as any })}
            min={0}
            step={0.1}
          />
          <NumberInput
            label="高さ (cm)"
            value={(params.fins as any).height}
            onChange={(value) => updateParams({ fins: { ...params.fins, height: Number(value) || 0 } as any })}
            min={0}
            step={0.1}
          />
        </>
      )}
      <NumberInput
        label="厚さ (cm)"
        value={params.fins.thickness}
        onChange={(value) => updateParams({ fins: { ...params.fins, thickness: Number(value) || 0 } })}
        min={0}
        step={0.01}
      />
      <Select
        label="材質"
        value={params.fins.material}
        onChange={(value) => updateParams({ fins: { ...params.fins, material: value as any } })}
        data={[
          { value: "plastic", label: "プラスチック" },
          { value: "balsa", label: "バルサ" },
          { value: "cardboard", label: "厚紙" },
        ]}
      />
      <ColorInput
        label="色"
        value={params.fins.color}
        onChange={(value) => updateParams({ fins: { ...params.fins, color: value } })}
      />
    </Stack>
  );

  const renderEngineSection = () => (
    <Stack gap="sm">
      <Select
        label="エンジン"
        value={params.engine.name}
        onChange={(value) => updateParams({ engine: { name: value || "" } })}
        data={[
          { value: "Estes A10", label: "Estes A10" },
          { value: "Estes A3", label: "Estes A3" },
          { value: "Estes B4", label: "Estes B4" },
          { value: "Estes C6", label: "Estes C6" },
        ]}
        searchable
      />
      <ThrustCurveChart motorData={motorData} loading={loadingMotorData} />
    </Stack>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case "ノーズ":
        return renderNoseSection();
      case "ボディ":
        return renderBodySection();
      case "フィン":
        return renderFinSection();
      case "エンジン":
        return renderEngineSection();
      default:
        return null;
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <Settings className={styles.icon} />
        <h2>コンポーネント設定</h2>
      </div>

      <Stack gap="md" className={styles.content}>
        <Stack gap="xs">
          <TextInput
            label="ロケット名"
            value={params.name}
            onChange={(event) => updateParams({ name: event.currentTarget.value })}
            placeholder="ロケット名を入力"
          />
          <TextInput
            label="設計者"
            value={params.designer}
            onChange={(event) => updateParams({ designer: event.currentTarget.value })}
            placeholder="設計者名を入力"
          />
        </Stack>

        <Divider />

        <Group justify="space-between">
          <Button variant="outline" size="sm" onClick={handleImport}>
            インポート
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            エクスポート
          </Button>
        </Group>

        <Divider />

        <SegmentedControl
          value={activeSection}
          onChange={setActiveSection}
          data={["ノーズ", "ボディ", "フィン", "エンジン"]}
          className={styles.segmentedControl}
        />

        <ScrollArea className={styles.scrollArea}>
          {renderActiveSection()}
        </ScrollArea>
      </Stack>
    </div>
  );
};

export default RocketPanel;
