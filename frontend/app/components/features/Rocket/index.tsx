import react, { useEffect } from "react";
import useMotorExtractor from "./motors";
import type { RocketParams } from "./types";
import RocketPanel from "~/components/layout/RocketPanel";

const Rocket = () => {
  const { motorData, loading, error, extractAllMotors, getMotorByName } =
    useMotorExtractor();

  useEffect(() => {
    extractAllMotors();
  }, []);

  // useEffect(() => {
  //   console.log("Motor data updated:", {
  //     motorCount: motorData.length,
  //     loading,
  //     error,
  //     motors: motorData.map((m) => m.header.name),
  //   });
  // }, [motorData, loading, error]);

  return <></>;
};

export default Rocket;
