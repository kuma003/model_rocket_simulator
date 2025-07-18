import { Hourglass } from "~/components/ui/Icons";
import styles from "./Timer.module.scss";

const Timer: React.FC<{ time: number }> = ({ time }) => {
  const isNegative = time < 0;
  const absTime = Math.abs(time);
  return (
    <div className={styles.timer}>
      <Hourglass size={47.5} />
      <p>
        {isNegative ? "X ー " : "X ＋ " /* 文字幅の都合であえて長音符 */}
        {Math.floor(absTime / 60)
          .toString()
          .padStart(2, "0")}
        :{(absTime % 60).toFixed(2).padStart(5, "0")}
      </p>
    </div>
  );
};

export default Timer;
