import React, { useState, useEffect } from "react";
import type { RocketParams } from "../../features/Rocket/types";
import styles from "./rocketPanel.module.scss";
import { SegmentedControl, Stack, Divider, ScrollArea } from "@mantine/core";
import { loadMotorData, type MotorData } from "../../../utils/motorParser";
import {
  exportDesignData,
  importDesignData,
  validateRocketParams,
} from "./utils/designIO";

// Import sub-components
import PanelHeader from "./components/PanelHeader";
import BasicInfo from "./components/BasicInfo";
import ImportExportButtons from "./components/ImportExportButtons";
import NoseSection from "./sections/NoseSection";
import BodySection from "./sections/BodySection";
import FinSection from "./sections/FinSection";
import EngineSection from "./sections/EngineSection";

export interface RocketPanelProps {
  rocketParams?: RocketParams;
  setRocketParams: (params: RocketParams) => void;
}

const defaultRocketParams: RocketParams = {
  name: "新しいロケット",
  designer: "",
  nose: {
    length: 0.1,
    diameter: 0.024,
    thickness: 0.001,
    material: "plastic",
    color: "#FF0000",
    type: "conical",
  },
  body: {
    length: 0.3,
    diameter: 0.024,
    thickness: 0.001,
    material: "cardboard",
    color: "#FFFF00",
  },
  fins: {
    thickness: 0.001,
    material: "balsa",
    color: "#0000FF",
    count: 3,
    offset: 0,
    type: "trapozoidal",
    rootChord: 0.05,
    tipChord: 0.02,
    sweepLength: 0.03,
    height: 0.04,
  },
  engine: {
    name: "Estes A10",
  },
};

const RocketPanel: React.FC<RocketPanelProps> = ({
  rocketParams = defaultRocketParams,
  setRocketParams,
}) => {
  const sections = [
    { label: "ノーズ", value: "nose" },
    { label: "ボディ", value: "body" },
    { label: "フィン", value: "fins" },
    { label: "エンジン", value: "engine" },
  ];
  const [activeSection, setActiveSection] = useState(sections[0].value);
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
          console.error("Failed to load motor data:", error);
          setMotorData(null);
        } finally {
          setLoadingMotorData(false);
        }
      } else {
        setMotorData(null);
      }
    };

    loadMotor();
  }, [params.engine]);

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        importDesignData(file)
          .then((data) => {
            if (validateRocketParams(data)) {
              setParams(data);
              setRocketParams(data);
              alert("デザインデータが正常にインポートされました。");
            } else {
              alert("無効なデザインデータファイルです。");
            }
          })
          .catch((error) => {
            alert("ファイルの読み込みに失敗しました: " + error.message);
          });
      }
    };
    input.click();
  };

  const handleExport = () => {
    exportDesignData(params);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "nose":
        return <NoseSection params={params} updateParams={updateParams} />;
      case "body":
        return <BodySection params={params} updateParams={updateParams} />;
      case "fins":
        return <FinSection params={params} updateParams={updateParams} />;
      case "engine":
        return (
          <EngineSection
            params={params}
            updateParams={updateParams}
            motorData={motorData}
            loadingMotorData={loadingMotorData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.panel}>
      <PanelHeader />

      <Stack className={styles.content}>
        <BasicInfo params={params} updateParams={updateParams} />

        <Divider />

        <ImportExportButtons onImport={handleImport} onExport={handleExport} />

        <Divider />

        <SegmentedControl
          value={activeSection}
          onChange={setActiveSection}
          data={sections}
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
