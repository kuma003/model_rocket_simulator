import React from "react";
import styles from "./toppage.module.scss";
import MenuButton from "../MenuButton";
import { PlayArrow, SimpleRocket, Settings, Info } from "../Icons";
import Title from "../Title";
import { FloatingParticles } from "../FloatingParticles";
import { StarField } from "../StartField";

const Top: React.FC = () => {
  return (
    <>
      <div className={styles.toppage}>
        <StarField count={200} />
        <Title />
        <MenuButton
          buttons={[
            {
              label: "ゲームスタート",
              leftIcon: <PlayArrow />,
              onClick: () => console.log("Home button clicked"),
            },
            {
              label: "ランキング",
              leftIcon: <SimpleRocket />,
            },
            {
              label: "設定",
              leftIcon: <Settings />,
            },
            {
              label: "情報",
              leftIcon: <Info />,
            },
          ]}
        />
      </div>
    </>
  );
};

export default Top;
