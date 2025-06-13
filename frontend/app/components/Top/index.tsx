import React from "react";
import styles from "./toppage.module.scss";
import { MenuButton } from "../MenuButton";
import { PlayArrow, SimpleRocket, Settings, Info } from "../Icons";
import Title from "../Title";
import { StarField } from "../StartField";
import { FloatingSpaceObjects } from "../SpaceObjects";
import { RocketMascot, MascotSpeech } from "../RocketMascot";

export const Top: React.FC = () => {
  return (
    <div className={styles.toppage}>
      <StarField count={200} />
      <FloatingSpaceObjects count={12} />
      <Title />
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <RocketMascot size="small" animated={true} position="right" />
        <MascotSpeech 
          message="宇宙へようこそ！🚀" 
          visible={true} 
        />
      </div>
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
  );
};
