import React from "react";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router";
import type { RocketParams } from "../../features/Rocket/types";
import { saveRocketParams } from "../../../utils/storage/rocketStorage";
import styles from "./LaunchButton.module.scss";

interface LaunchButtonProps {
  rocketParams: RocketParams;
  disabled?: boolean;
}

const LaunchButton: React.FC<LaunchButtonProps> = ({ 
  rocketParams, 
  disabled = false 
}) => {
  const navigate = useNavigate();

  const handleLaunch = () => {
    // Save current rocket parameters to localStorage
    saveRocketParams(rocketParams);
    
    // Navigate to launch page
    navigate("/launch");
  };

  return (
    <Button
      onClick={handleLaunch}
      disabled={disabled}
      className={styles.launchButton}
      size="lg"
      leftSection={<span className={styles.rocketIcon}>🚀</span>}
    >
      打ち上げ
    </Button>
  );
};

export default LaunchButton;