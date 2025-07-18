import { Home, Planet, Satellite } from "~/components/ui/Icons";
import styles from "./AltitudeMeter.module.scss";

const AltitudeMeter: React.FC<{ alt: number; step: number }> = ({
  alt,
  step,
}) => {
  const iconList = [
    <Home size={55} />,
    <Satellite size={55} />,
    <Planet size={55} />,
  ];

  return (
    <div className={styles.altitudeMater}>
      {iconList[Math.min(Math.floor(alt / step), iconList.length - 1)]}
      <p>
        <ruby>
          高度<rt>こうど</rt>
        </ruby>
        ：{alt.toFixed(1).padStart(5, "0")}
        <ruby>
          m<rt>メートル</rt>
        </ruby>
      </p>
    </div>
  );
};

export default AltitudeMeter;
