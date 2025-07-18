import { Hourglass } from "~/components/ui/Icons";
import styles from "./Timer.module.scss";

const Timer: React.FC<{ time: number }> = ({ time }) => {
  return (
    <div className={styles.timer}>
      <Hourglass size={47.5} />
      <p>
        {"X ＋ "}
        {Math.floor(time / 60)
          .toString()
          .padStart(2, "0")}
        :{(time % 60).toFixed(2).padStart(5, "0")}
      </p>
    </div>
  );
};

export default Timer;
