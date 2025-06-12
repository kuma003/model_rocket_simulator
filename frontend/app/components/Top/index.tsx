import React from "react";
import styles from "./toppage.module.scss";
import MenuButton from "../MenuButton";
import { PlayArrow, SimpleRocket, Settings, Info } from "../Icons";

const Top: React.FC = () => {
  return (
    <div className={styles.toppage}>
      <MenuButton
        buttons={[
          {
            label: "プレイ",
            leftIcon: <PlayArrow />,
            onClick: () => console.log("Home button clicked"),
          },
          {
            label: "設定",
            leftIcon: <Settings />,
          },
          {
            label: "ランキング",
            leftIcon: <SimpleRocket />,
          },
          {
            label: "インフォ",
            leftIcon: <Info />,
          },
        ]}
      />
    </div>
  );
};

export default Top;
