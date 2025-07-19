import React from "react";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router";
import { ArrowLeft } from "../../ui/Icons";

interface BackButtonProps {
  onClick?: () => void;
  label?: string;
  to?: string;
  showWarning?: boolean;
  warningTitle?: string;
  warningMessage?: string;
  style: React.CSSProperties;
}

/**
 * Back button component for navigation
 */
const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label = "戻る",
  to = "/",
  showWarning = false,
  warningTitle = "進捗が保存されていません",
  warningMessage = "現在の進捗が保存されていません。このページを離れてもよろしいですか？",
  style = {},
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (showWarning) {
      // Use browser native confirm dialog
      if (window.confirm(warningMessage)) {
        performNavigation();
      }
    } else {
      performNavigation();
    }
  };

  const performNavigation = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior - navigate to specified URL
      navigate(to, { replace: true });
    }
  };

  return (
    <Button
      leftSection={<ArrowLeft size={16} />}
      variant="light"
      onClick={handleClick}
      size="sm"
      style={{
        ...{
          background:
            "linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "white",
          backdropFilter: "blur(8px)",
        },
        ...style,
      }}
    >
      {label}
    </Button>
  );
};

export default BackButton;
