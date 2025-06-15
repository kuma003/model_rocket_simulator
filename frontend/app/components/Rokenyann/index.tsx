import React from "react";
import styles from "./Rokenyann.module.scss";

interface RokenyannProps {
  size?: "small" | "medium" | "large";
  className?: string;
  animated?: boolean;
  position?: "left" | "right" | "center";
  showPlaceholder?: boolean;
}

export const Rokenyann: React.FC<RokenyannProps> = ({
  size = "medium",
  className,
  animated = true,
  position = "center",
}) => {
  const getClassNames = () => {
    let classes = [styles.mascotContainer, styles[size], styles[position]];
    if (animated) classes.push(styles.animated);
    if (className) classes.push(className);
    return classes.join(" ");
  };

  return (
    <div className={getClassNames()}>
      <img
        src="./rokenyann_rocket.png"
        alt="Rocket Mascot"
        className={styles.mascotImage}
      />
    </div>
  );
};

// Additional component for mascot speech bubble
interface RokenyannSpeechProps {
  message: string;
  visible?: boolean;
  className?: string;
}

export const RokenyannSpeech: React.FC<RokenyannSpeechProps> = ({
  message,
  visible = true,
  className,
}) => {
  if (!visible) return null;

  return (
    <div className={`${styles.speechBubble} ${className || ""}`}>
      <p>{message}</p>
      <div className={styles.speechTail}></div>
    </div>
  );
};
