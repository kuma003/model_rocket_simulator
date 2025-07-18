import React, { useState, useEffect } from "react";
import { Stack, NumberInput, Select, ColorInput } from "@mantine/core";
import UnitNumberInput from "~/components/ui/UnitNumberInput";
import type { RocketParams } from "../../../features/Rocket/types";

interface FinSectionProps {
  params: RocketParams;
  updateParams: (newParams: Partial<RocketParams>) => void;
}

// Memory storage for each fin type
interface FinTypeMemory {
  trapozoidal: {
    rootChord: number;
    tipChord: number;
    sweepLength: number;
    height: number;
  };
  elliptical: {
    rootChord: number;
    height: number;
  };
  freedom: {
    points: { x: number; y: number }[];
  };
}

const defaultFinMemory: FinTypeMemory = {
  trapozoidal: {
    rootChord: 0.05,
    tipChord: 0.02,
    sweepLength: 0.03,
    height: 0.04,
  },
  elliptical: {
    rootChord: 0.05,
    height: 0.04,
  },
  freedom: {
    points: [
      { x: 0, y: 0 },
      { x: 0.05, y: 0 },
      { x: 0.04, y: 0.04 },
      { x: 0, y: 0.04 },
    ],
  },
};

const FinSection: React.FC<FinSectionProps> = ({ params, updateParams }) => {
  const [finMemory, setFinMemory] = useState<FinTypeMemory>(defaultFinMemory);

  // Update memory when current fin values change
  useEffect(() => {
    if (params.fins.type === "trapozoidal") {
      const finData = params.fins as any;
      setFinMemory((prev) => ({
        ...prev,
        trapozoidal: {
          rootChord: finData.rootChord || prev.trapozoidal.rootChord,
          tipChord: finData.tipChord || prev.trapozoidal.tipChord,
          sweepLength: finData.sweepLength || prev.trapozoidal.sweepLength,
          height: finData.height || prev.trapozoidal.height,
        },
      }));
    } else if (params.fins.type === "elliptical") {
      const finData = params.fins as any;
      setFinMemory((prev) => ({
        ...prev,
        elliptical: {
          rootChord: finData.rootChord || prev.elliptical.rootChord,
          height: finData.height || prev.elliptical.height,
        },
      }));
    } else if (params.fins.type === "freedom") {
      const finData = params.fins as any;
      setFinMemory((prev) => ({
        ...prev,
        freedom: {
          points: finData.points || prev.freedom.points,
        },
      }));
    }
  }, [params.fins]);

  const handleFinTypeChange = (value: string | null) => {
    if (!value) return;

    switch (value) {
      case "trapozoidal": {
        updateParams({
          fins: {
            ...params.fins,
            type: "trapozoidal",
            ...finMemory.trapozoidal,
          },
        });
        break;
      }
      case "elliptical": {
        updateParams({
          fins: {
            ...params.fins,
            type: "elliptical",
            ...finMemory.elliptical,
          },
        });
        break;
      }
      case "freedom": {
        updateParams({
          fins: {
            ...params.fins,
            type: "freedom",
            ...finMemory.freedom,
          },
        });
        break;
      }
    }
  };
  return (
    <Stack>
      <NumberInput
        label="フィン数"
        value={params.fins.count}
        onChange={(value) =>
          updateParams({ fins: { ...params.fins, count: Number(value) || 0 } })
        }
        min={1}
        max={8}
        stepHoldDelay={500}
        stepHoldInterval={100}
        clampBehavior="strict"
        allowNegative={false}
      />
      <UnitNumberInput
        label="フィン取り付け位置"
        unitType="length"
        // description="ボディ末端からフィン末端までの距離"
        value={params.fins.offset}
        onChange={(value) =>
          updateParams({ fins: { ...params.fins, offset: value } })
        }
        min={0}
      />
      <Select
        label="フィンタイプ"
        value={params.fins.type}
        onChange={handleFinTypeChange}
        data={[
          { value: "trapozoidal", label: "台形" },
          { value: "elliptical", label: "楕円" },
          { value: "freedom", label: "自由形状" },
        ]}
      />
      {params.fins.type === "trapozoidal" && (
        <>
          <UnitNumberInput
            label="ルートコード"
            unitType="length"
            value={(params.fins as any).rootChord}
            onChange={(value) =>
              updateParams({
                fins: { ...params.fins, rootChord: value } as any,
              })
            }
          />
          <UnitNumberInput
            label="チップコード"
            unitType="length"
            value={(params.fins as any).tipChord}
            onChange={(value) =>
              updateParams({
                fins: { ...params.fins, tipChord: value } as any,
              })
            }
          />
          <UnitNumberInput
            label="スイープ長"
            unitType="length"
            value={(params.fins as any).sweepLength}
            onChange={(value) =>
              updateParams({
                fins: {
                  ...params.fins,
                  sweepLength: value,
                } as any,
              })
            }
          />
          <UnitNumberInput
            label="高さ"
            unitType="length"
            value={(params.fins as any).height}
            onChange={(value) =>
              updateParams({
                fins: { ...params.fins, height: value } as any,
              })
            }
          />
        </>
      )}
      {params.fins.type === "elliptical" && (
        <>
          <UnitNumberInput
            label="ルートコード"
            unitType="length"
            value={(params.fins as any).rootChord}
            onChange={(value) =>
              updateParams({
                fins: { ...params.fins, rootChord: value } as any,
              })
            }
          />
          <UnitNumberInput
            label="高さ"
            unitType="length"
            value={(params.fins as any).height}
            onChange={(value) =>
              updateParams({
                fins: { ...params.fins, height: value } as any,
              })
            }
          />
        </>
      )}
      {params.fins.type === "freedom" && (
        <>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              頂点座標
            </label>
            {((params.fins as any).points || []).map(
              (point: { x: number; y: number }, index: number) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <NumberInput
                    placeholder={`X${index + 1}`}
                    value={point.x}
                    onChange={(value) => {
                      const newPoints = [
                        ...((params.fins as any).points || []),
                      ];
                      newPoints[index] = {
                        ...newPoints[index],
                        x: Number(value) || 0,
                      };
                      updateParams({
                        fins: { ...params.fins, points: newPoints } as any,
                      });
                    }}
                    style={{ flex: 1 }}
                  />
                  <NumberInput
                    placeholder={`Y${index + 1}`}
                    value={point.y}
                    onChange={(value) => {
                      const newPoints = [
                        ...((params.fins as any).points || []),
                      ];
                      newPoints[index] = {
                        ...newPoints[index],
                        y: Number(value) || 0,
                      };
                      updateParams({
                        fins: { ...params.fins, points: newPoints } as any,
                      });
                    }}
                    style={{ flex: 1 }}
                  />
                  {((params.fins as any).points || []).length > 3 && (
                    <button
                      onClick={() => {
                        const newPoints = [
                          ...((params.fins as any).points || []),
                        ];
                        newPoints.splice(index, 1);
                        updateParams({
                          fins: { ...params.fins, points: newPoints } as any,
                        });
                      }}
                      style={{
                        background: "#ff6b6b",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      削除
                    </button>
                  )}
                </div>
              )
            )}
            <button
              onClick={() => {
                const currentPoints = (params.fins as any).points || [];
                const newPoints = [...currentPoints, { x: 0, y: 0 }];
                updateParams({
                  fins: { ...params.fins, points: newPoints } as any,
                });
              }}
              style={{
                background: "#4c6ef5",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}
            >
              頂点を追加
            </button>
          </div>
        </>
      )}
      <UnitNumberInput
        label="厚さ"
        unitType="length"
        value={params.fins.thickness}
        onChange={(value) =>
          updateParams({
            fins: { ...params.fins, thickness: value },
          })
        }
      />
      <Select
        label="材質"
        value={params.fins.material}
        onChange={(value) =>
          updateParams({ fins: { ...params.fins, material: value as any } })
        }
        data={[
          { value: "plastic", label: "プラスチック" },
          { value: "balsa", label: "バルサ" },
          { value: "cardboard", label: "厚紙" },
        ]}
      />
      <ColorInput
        label="色"
        value={params.fins.color}
        onChange={(value) =>
          updateParams({ fins: { ...params.fins, color: value } })
        }
      />
    </Stack>
  );
};

export default FinSection;
