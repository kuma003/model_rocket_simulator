import React from "react";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router";
import type { RocketParams } from "../../features/Rocket/types";
import { saveRocketParams } from "../../../utils/storage/rocketStorage";
import styles from "./LaunchButton.module.scss";

interface LaunchButtonProps {
  rocketParams: RocketParams;
  disabled?: boolean;
  onNavigate?: () => void;
}

const LaunchButton: React.FC<LaunchButtonProps> = ({ 
  rocketParams, 
  disabled = false,
  onNavigate
}) => {
  const navigate = useNavigate();

  const handleLaunch = () => {
    // Allow next navigation to bypass warning
    if (onNavigate) {
      onNavigate();
    }
    
    // Save current rocket parameters to localStorage
    saveRocketParams(rocketParams);
    
    // Navigate to launch page without history
    navigate("/launch", { replace: true });
  };

  return (
    <Button
      onClick={handleLaunch}
      disabled={disabled}
      className={styles.launchButton}
      variant="light"
      size="lg"
      leftSection={<span className={styles.rocketIcon}>🚀</span>}
      style={{
        background:
          "linear-gradient(45deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.02))",
        border: "1px solid rgba(0, 0, 0, 0.2)",
        color: "#333",
        backdropFilter: "blur(8px)",
      }}
    >
      打ち上げ
    </Button>
  );
};

export default LaunchButton;