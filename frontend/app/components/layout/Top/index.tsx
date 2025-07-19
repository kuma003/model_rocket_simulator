import React from "react";
import styles from "./toppage.module.scss";
import { MenuButton } from "../../ui/MenuButton";
import { PlayArrow, SimpleRocket, Settings, Info } from "../../ui/Icons";
import Title from "../../ui/Title";
import { StarField } from "../../effects/StarField";
import { FloatingSpaceObjects } from "../../effects/SpaceObjects";
import { Rokenyann, RokenyannSpeech } from "../../features/Rokenyann";
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
            onClick: () => navigate("/", { state: { showModal: "rocketSelection" }, replace: true }),
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
                replace: true,
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
