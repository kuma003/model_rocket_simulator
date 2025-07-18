import React from "react";
import { Button } from "@mantine/core";
import ArrowLeftIcon from "../icons/ArrowLeftIcon";

interface BackButtonProps {
  onClick?: () => void;
  label?: string;
}

/**
 * Back button component for navigation
 */
const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  label = "戻る" 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior - go back in history
      window.history.back();
    }
  };

  return (
    <Button
      leftSection={<ArrowLeftIcon size={16} />}
      variant="light"
      onClick={handleClick}
      size="sm"
      style={{
        background: "linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "white",
        backdropFilter: "blur(8px)",
      }}
    >
      {label}
    </Button>
  );
};

export default BackButton;