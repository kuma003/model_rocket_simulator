import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import {
  loadRocketParams,
  hasRocketParams,
} from "~/utils/storage/rocketStorage";
import type { RocketParams, RocketSpecs } from "../Rocket/types";
import AltitudeBackground from "./components/AltitudeBackground";
import AltitudeMeter from "./components/AltitudeMeter";
import Timer from "./components/Timer";
import {
  calculateRocketProperties,
  type RocketProperties,
} from "~/utils/calculations/simulationEngine";
import presetRockets from "~/data/presetRockets.json";
import { loadFromJson } from "~/utils/storage/rocketFileAdapter";
import type { RocketTrajectory } from "~/utils/calculations/4DoF";
import run4DoFSimulation from "~/utils/calculations/4DoF";
import RocketComponent from "../Design/RocketComponent";
import RocketVisualization from "../Design/RocketVisualization";
import TrajectoryPath from "./components/TrajectoryPath";
import BackButton from "~/components/common/BackButton/BackButton";

const Launch: React.FC = () => {
  const navigate = useNavigate();
  const [rocketParams, setRocketParams] = useState<RocketParams | null>(null);
  const [rocketProperties, setRocketProperties] =
    useState<RocketProperties | null>(null);
  const [trajectoryData, setTrajectoryData] = useState<RocketTrajectory | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [time, setTime] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const [rivalRocketParams, setRivalRocketParams] = useState<RocketParams[]>(
    []
  );
  const [rivalRocketTrajectory, setRivalRocketTrajectory] = useState<
    RocketTrajectory[]
  >([]);

  let maxLength = 0.1;
  let [flightTime, setFlightTime] = useState(0);

  const dt = 0.0005;
  const step = 50; // meters

  useEffect(() => {
    // check query parameters for rocket selection
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("preset")) {
      const checkRocketQuery = async () => {
        try {
          const preset = urlParams.get("preset");
          const userRocket = presetRockets.find(
            (rocket) => rocket.id === preset
          );
          // Check if the preset rocket exists
          if (!userRocket) {
            setError("指定されたプリセットロケットが見つかりません。");
            setTimeout(() => {
              navigate("/", { replace: true });
            }, 5000);
            return;
          }

          const params = await loadFromJson(userRocket.rocketParams);
          if (!params) {
            setError("ロケットデータの読み込みに失敗しました。");
            setTimeout(() => {
              navigate("/", { replace: true });
            }, 5000);
            return;
          }
          setRocketParams(params);

          const rivals = presetRockets.filter((rocket) => rocket.id !== preset);
          const randomRivals = rivals
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);
          const rivalParams = await Promise.all(
            randomRivals.map((rival) => loadFromJson(rival.rocketParams))
          );
          setRivalRocketParams(rivalParams.filter((param) => param !== null));
          console.log("userRocket:", userRocket);
          console.log("Rival Rockets:", rivalParams);

          maxLength = Math.max(
            params.nose.length + params.body.length,
            ...rivalParams.map(
              (rocket) => rocket.nose.length + rocket.body.length
            )
          );
        } catch (err) {
          console.error("Error loading rocket parameters:", err);
          setError("ロケットデータの読み込み中にエラーが発生しました。");
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 5000);
        } finally {
          setLoading(false);
        }
      };
      checkRocketQuery();
    } else {
      const checkRocketCache = async () => {
        try {
          // Check if rocket parameters exist in cache
          if (!hasRocketParams()) {
            setError(
              "ロケットデータが見つかりません。デザインページからロケットを作成してください。"
            );
            // Auto-redirect to previous page after 2 seconds
            setTimeout(() => {
              navigate("/design", { replace: true });
            }, 5000);
            return;
          }

          // Load rocket parameters from cache
          const params = await loadRocketParams();
          if (!params) {
            setError(
              "ロケットデータの読み込みに失敗しました。デザインページからやり直してください。"
            );
            setTimeout(() => {
              navigate("/design", { replace: true });
            }, 5000);
            return;
          }

          const rivals = presetRockets;
          const randomRivals = rivals
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);
          const rivalParams = await Promise.all(
            randomRivals.map((rival) => loadFromJson(rival.rocketParams))
          );
          setRivalRocketParams(rivalParams.filter((param) => param !== null));

          setRocketParams(params);

          maxLength = Math.max(
            params.nose.length + params.body.length,
            ...rivalParams.map(
              (rocket) => rocket.nose.length + rocket.body.length
            )
          );
        } catch (err) {
          console.error("Error loading rocket parameters:", err);
          setError("ロケットデータの読み込み中にエラーが発生しました。");
          setTimeout(() => {
            navigate("/design", { replace: true });
          }, 5000);
        } finally {
          setLoading(false);
        }
      };

      checkRocketCache();
    }
  }, [navigate]);

  useEffect(() => {
    if (!rocketParams) return;
    console.log("Rocket Params:", rocketParams);
    const properties = calculateRocketProperties(rocketParams);
    setRocketProperties(properties);
    const trajectory = run4DoFSimulation(
      properties.specs,
      { launchrodElevation: 89, launchrodLength: 1 },
      dt
    );
    setTrajectoryData(trajectory);

    // // Set initial flight time, will be updated when rival rockets are calculated
    // const initialFlightTime = trajectory.time[trajectory.time.length - 1];
    // if (rivalRocketTrajectory.length === 0) {
    //   setFlightTime(initialFlightTime);
    // } else {
    //   // Calculate max flight time including rival rockets
    //   const allFlightTimes = [
    //     initialFlightTime,
    //     ...rivalRocketTrajectory.map((traj) => traj.time[traj.time.length - 1]),
    //   ];
    //   const maxFlightTime = Math.max(...allFlightTimes);
    //   setFlightTime(maxFlightTime);
    // }
  }, [rocketParams]);

  useEffect(() => {
    if (rivalRocketParams.length === 0) return;

    const rivalTrajectories = rivalRocketParams.map((params) => {
      const properties = calculateRocketProperties(params);
      return run4DoFSimulation(
        properties.specs,
        { launchrodElevation: 89, launchrodLength: 1 },
        dt
      );
    });

    setRivalRocketTrajectory(rivalTrajectories);

    // // Update flight time to maximum among all rockets
    // if (trajectoryData) {
    //   const allFlightTimes = [
    //     trajectoryData.time[trajectoryData.time.length - 1],
    //     ...rivalTrajectories.map((traj) => traj.time[traj.time.length - 1]),
    //   ];
    //   const maxFlightTime = Math.max(...allFlightTimes);
    //   setFlightTime(maxFlightTime);
    // }
  }, [rivalRocketParams]);

  useEffect(() => {
    const idx = time < 0 ? 0 : Math.floor(time / dt);
    setCurrentIndex(idx); // Assume that dt is quite small
    setAltitude(
      trajectoryData
        ? Math.max(
            trajectoryData.position[
              Math.min(idx, trajectoryData.position.length - 1)
            ].y,
            0
          )
        : 0
    );
  }, [time, dt, trajectoryData]);

  // Timer control functions
  const startTimer = useCallback(() => {
    if (!isRunning) {
      setTime(-3.0);
      const id = setInterval(() => {
        setTime((prevTime) => {
          // if (prevTime >= flightTime) {
          //   clearInterval(id);
          //   setIsRunning(false);
          //   return flightTime; // Stop at flight time
          // }
          if (prevTime < 0) {
            return prevTime + 0.01;
          } else {
            return prevTime + 0.005; // little bit slow
          }
        });
      }, 10);
      setIntervalId(id);
      setIsRunning(true);
    }
  }, [isRunning]);

  const pauseTimer = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsRunning(false);
  }, [intervalId]);

  const resetTimer = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setTime(0);
    setIsRunning(false);
  }, [intervalId]);

  // Keyboard event handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
          event.preventDefault();
          startTimer();
          break;
        case " ":
          event.preventDefault();
          if (isRunning) {
            pauseTimer();
          } else {
            startTimer();
          }
          break;
        case "q":
        case "Q":
          event.preventDefault();
          resetTimer();
          break;
      }
    },
    [startTimer, pauseTimer, resetTimer, isRunning]
  );

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [handleKeyDown, intervalId]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>ロケットデータを読み込んでいます...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
        <h2>エラー</h2>
        <p>{error}</p>
        <p>5秒後に前のページに戻ります...</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <AltitudeBackground altitude={altitude} step={50} />
      {/* {trajectoryData && (
        <TrajectoryPath
          trajectoryData={trajectoryData}
          index={currentIndex}
          step={50}
        />
      )} */}
      <BackButton
        warningTitle="確認"
        warningMessage="打ち上げを終了しますか？"
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          zIndex: 100,
        }}
      />
      <AltitudeMeter alt={altitude} step={50} />
      {rocketParams && rocketProperties && trajectoryData && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <RocketVisualization
            rocketParams={rocketParams}
            rocketProperties={rocketProperties}
            targetWidth={120}
            targetHeight={120}
            referenceLength={maxLength}
            pitchAngle={
              (trajectoryData.pitch[
                Math.min(currentIndex, trajectoryData.pitch.length - 1)
              ] *
                180) /
              Math.PI
            }
            marginPercent={0.9}
            isCombustion={0 < time && rocketParams.engine.burnTime > time}
            shouldPlaySound={true}
          />
        </div>
      )}
      {/* Rival rockets with ghost effect */}
      {rivalRocketParams.length > 0 && rivalRocketTrajectory.length > 0 && (
        <div
          style={{
            overflow: "hidden",
          }}
        >
          {rivalRocketParams.map((rivalParams, index) => {
            const rivalProperties = calculateRocketProperties(rivalParams);
            const rivalTrajectory = rivalRocketTrajectory[index];
            const rivalCurrentIndex = Math.min(
              currentIndex,
              rivalTrajectory.position.length - 1
            );
            const rivalAltitude = Math.max(
              rivalTrajectory.position[rivalCurrentIndex].y,
              0
            );
            const altitudeDiff = rivalAltitude - altitude;

            return (
              <div
                key={`rival-${index}`}
                style={{
                  position: "absolute",
                  top: `calc(50% - ${(altitudeDiff / step) * 500}vw)`,
                  left: index === 0 ? "20%" : "80%", // Left and right positions
                  transform: "translate(-50%, -50%)",
                  zIndex: 8,
                  opacity: 0.85, // Ghost effect
                  filter: "brightness(0.85) saturate(0.7)", // Additional ghost styling
                }}
              >
                <RocketVisualization
                  rocketParams={rivalParams}
                  rocketProperties={rivalProperties}
                  targetWidth={100}
                  targetHeight={100}
                  referenceLength={maxLength}
                  pitchAngle={
                    (rivalTrajectory.pitch[rivalCurrentIndex] * 180) / Math.PI
                  }
                  marginPercent={0.9}
                  isGhost={true}
                  isCombustion={
                    0 < time && rivalRocketParams[index].engine.burnTime > time
                  }
                />
              </div>
            );
          })}
        </div>
      )}
      <Timer time={time} />
    </div>
  );
};
export default Launch;

const RocketWrapper: React.FC<{
  rocketParams: RocketParams;
  rocketProperties: RocketProperties;
  trajectory: RocketTrajectory;
  idx: number;
}> = ({ rocketParams, rocketProperties, trajectory, idx }) => {
  if (idx < 0) idx = 0;
  idx = Math.min(idx, trajectory.position.length - 1);
  const pitch = trajectory.pitch[idx];

  return (
    <RocketComponent
      rocketParams={rocketParams}
      rocketProperties={rocketProperties}
      pitchAngle={pitch}
    ></RocketComponent>
  );
};
