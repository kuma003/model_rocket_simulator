import React from "react";
import styles from "./toppage.module.scss";
import { MenuButton } from "../MenuButton";
import { PlayArrow, SimpleRocket, Settings, Info } from "../Icons";
import Title from "../Title";
import { StarField } from "../StartField";
import { FloatingSpaceObjects } from "../SpaceObjects";
import { Rokenyann, RokenyannSpeech } from "../Rokenyann";
import { useNavigate, useLocation } from "react-router";

export const Top: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.toppage}>
      <StarField count={200} />
      <FloatingSpaceObjects count={12} />
      <Title />
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <Rokenyann size="medium" animated={true} position="right" />
      </div>
      <MenuButton
        buttons={[
          {
            label: "ゲームスタート",
            leftIcon: <PlayArrow />,
            onClick: () => navigate("/design"),
          },
          {
            label: "ランキング",
            leftIcon: <SimpleRocket />,
          },
          {
            label: "設定",
            leftIcon: <Settings />,
            onClick: () =>
              navigate("/", {
                state: { showModal: "settings" },
              }),
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
