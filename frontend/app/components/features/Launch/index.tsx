import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  loadRocketParams,
  hasRocketParams,
} from "~/utils/storage/rocketStorage";
import type { RocketParams } from "../Rocket/types";
import AltitudeBackground from "./components/AltitudeBackground";
import AltitudeMeter from "./components/AltitudeMeter";
import Timer from "./components/Timer";
import {
  calculateRocketProperties,
  calculateTrajectory,
  type TrajectoryData,
} from "~/utils/calculations/simulationEngine";

const Launch: React.FC = () => {
  const navigate = useNavigate();
  const [rocketParams, setRocketParams] = useState<RocketParams | null>(null);
  const [trajectoryData, setTrajectoryData] = useState<TrajectoryData>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
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
          }, 2000);
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
          }, 2000);
          return;
        }

        setRocketParams(params);
      } catch (err) {
        console.error("Error loading rocket parameters:", err);
        setError("ロケットデータの読み込み中にエラーが発生しました。");
        setTimeout(() => {
          navigate("/design", { replace: true });
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    checkRocketCache();
  }, [navigate]);

  useEffect(() => {
    if (!rocketParams) return;
    const properties = calculateRocketProperties(rocketParams);
    setTrajectoryData(calculateTrajectory(properties, 0.025));
  }, [rocketParams]);

  useEffect(() => {
    console.log("Trajectory Data:", trajectoryData);
  }, [trajectoryData]);

  // Timer control functions
  const startTimer = useCallback(() => {
    if (!isRunning) {
      setTime(-5);
      const id = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
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
        <p>2秒後に前のページに戻ります...</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <AltitudeBackground altitudeLevel={0} />
      <RocketCarts 
      <AltitudeMeter alt={0} step={50} />
      <Timer time={time} />
    </div>
  );
};
export default Launch;
