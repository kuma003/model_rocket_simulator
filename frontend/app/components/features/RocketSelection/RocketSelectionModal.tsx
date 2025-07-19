import React from "react";
import { Card, Group, Text, Button, SimpleGrid, Stack } from "@mantine/core";
import { useNavigate } from "react-router";
import type { RocketParams } from "../Rocket/types";
import RocketVisualization from "../Design/RocketVisualization";
import { calculateRocketProperties } from "~/utils/calculations/simulationEngine";
import presetRockets from "~/data/presetRockets.json";
import styles from "./rocketSelectionModal.module.scss";

/**
 * Props for RocketSelectionModal component
 * @interface RocketSelectionModalProps
 * @property {boolean} opened - Whether the modal is open
 * @property {() => void} onClose - Function to call when modal should close
 */
interface RocketSelectionModalProps {
  opened: boolean;
  onClose: () => void;
}

/**
 * Preset rocket data interface
 * @interface PresetRocket
 * @property {string} id - Unique identifier for the rocket
 * @property {string} displayName - Display name for the rocket
 * @property {string} description - Description of the rocket characteristics
 * @property {RocketParams} rocketParams - Rocket parameters
 */
interface PresetRocket {
  id: string;
  displayName: string;
  description: string;
  rocketParams: RocketParams;
}

/**
 * Modal component for selecting between preset rockets or custom design
 * @component
 * @param {RocketSelectionModalProps} props - Component properties
 * @returns {JSX.Element} Modal with rocket selection options
 * @description
 * Displays a modal window where users can choose between existing preset rockets
 * or create their own custom design. Preset rockets are displayed using Mantine Cards
 * with horizontal rocket visualization and descriptions.
 */
const RocketSelectionModal: React.FC<RocketSelectionModalProps> = ({
  opened,
  onClose,
}) => {
  const navigate = useNavigate();

  /**
   * Handles selection of a preset rocket
   * @param {string} rocketId - ID of the selected rocket
   */
  const handlePresetSelect = (rocketId: string) => {
    onClose();
    navigate(`/launch?preset=${rocketId}`);
  };

  /**
   * Handles selection of custom design option
   */
  const handleCustomDesign = () => {
    onClose();
    navigate("/design");
  };

  if (!opened) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rocket-selection-title"
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <div className={styles.modalHeader}>
          <h2 id="rocket-selection-title" className={styles.modalTitle}>
            ロケット選択
          </h2>
          <button
            onClick={onClose}
            aria-label="Close rocket selection modal"
            className={styles.closeButton}
          >
            ×
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <Stack gap="lg">
            <Text size="sm" c="dimmed">
              既存のロケットから選択するか、オリジナルの機体を設計してください
            </Text>

            <SimpleGrid cols={2} spacing="md">
              {(presetRockets as PresetRocket[]).map((rocket) => {
                const rocketProperties = calculateRocketProperties(rocket.rocketParams);
                
                return (
                  <Card
                    key={rocket.id}
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    className={styles.rocketCard}
                    onClick={() => handlePresetSelect(rocket.id)}
                  >
                    <Card.Section className={styles.rocketVisualizationSection}>
                      <div className={styles.rocketVisualizationContainer}>
                        <RocketVisualization
                          rocketParams={rocket.rocketParams}
                          rocketProperties={rocketProperties}
                          pitchAngle={90}
                        />
                      </div>
                    </Card.Section>

                    <Stack gap="xs" mt="md">
                      <Text fw={500} size="lg">
                        {rocket.displayName}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {rocket.description}
                      </Text>
                    </Stack>
                  </Card>
                );
              })}
            </SimpleGrid>

            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              className={styles.customDesignCard}
              onClick={handleCustomDesign}
            >
              <Group justify="center">
                <Stack align="center" gap="xs">
                  <Text fw={500} size="lg">
                    オリジナル機体を設計
                  </Text>
                  <Text size="sm" c="dimmed" ta="center">
                    デザインページで自分だけのロケットを作成します
                  </Text>
                </Stack>
              </Group>
            </Card>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={onClose}>
                キャンセル
              </Button>
            </Group>
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default RocketSelectionModal;