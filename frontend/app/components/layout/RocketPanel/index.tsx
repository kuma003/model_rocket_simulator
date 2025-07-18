import React, { useState, useEffect, useCallback } from "react";
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
import PayloadSection from "./sections/PayloadSection";
import EngineSection from "./sections/EngineSection";
import BackButton from "../../common/BackButton/BackButton";

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
  payload: {
    offset: 0.05,
    diameter: 0.02,
    length: 0.03,
    mass: 0.0,
  },
  engine: {
    name: "Estes A10",
    peakThrust: 0,
    averageThrust: 0,
    burnTime: 0,
    totalImpulse: 0,
    thrustCurve: [],
    diameter: 18,
    length: 70,
    delays: "3-5-7",
    propMass: 0.0038,
    totalMass: 0.0087,
    manufacturer: "Estes",
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
    { label: "ペイロード", value: "payload" },
    { label: "エンジン", value: "engine" },
  ];
  const [activeSection, setActiveSection] = useState(sections[0].value);
  const [params, setParams] = useState<RocketParams>(rocketParams);

  const updateParams = useCallback((newParams: Partial<RocketParams>) => {
    setParams((prevParams) => {
      const updatedParams = { ...prevParams, ...newParams };
      return updatedParams;
    });
  }, []);
  // タブを2段に分ける
  const primarySections = [
    { label: "ノーズ", value: "nose" },
    { label: "ボディ", value: "body" },
    { label: "フィン", value: "fins" },
  ];

  const secondarySections = [
    { label: "ペイロード", value: "payload" },
    { label: "エンジン", value: "engine" },
  ];

  // Update parent component when params change
  useEffect(() => {
    setRocketParams(params);
  }, [params, setRocketParams]);

  useEffect(() => {
    const fetchMotor = async () => {
      try {
        const data = await loadMotorData(params.engine.name);

        if (data) {
          updateParams({ engine: data });
        }
      } catch (error) {
        console.error("Failed to load motor data:", error);
      }
    };
    fetchMotor();
  }, []);

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
      case "payload":
        return <PayloadSection params={params} updateParams={updateParams} />;
      case "engine":
        return <EngineSection params={params} updateParams={updateParams} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.panelContainer}>
      <div className={styles.topButtonArea}>
        <BackButton />
      </div>
      
      <div className={styles.panel}>
        <PanelHeader />

        <Stack className={styles.content}>
        <BasicInfo params={params} updateParams={updateParams} />

        <Divider />

        <ImportExportButtons onImport={handleImport} onExport={handleExport} />

        <Divider />

        <Stack style={{ gap: 0 }}>
          <SegmentedControl
            value={activeSection}
            onChange={setActiveSection}
            data={primarySections}
            className={styles.segmentedControl}
            radius={"5px 5px 0 0"}
            transitionDuration={0}
          />
          <SegmentedControl
            value={activeSection}
            onChange={setActiveSection}
            data={secondarySections}
            className={styles.segmentedControl}
            radius={"0 0 5px 5px"}
            transitionDuration={0}
          />
        </Stack>

        <ScrollArea className={styles.scrollArea}>
          {renderActiveSection()}
        </ScrollArea>
      </Stack>
      </div>
    </div>
  );
};

export default RocketPanel;
