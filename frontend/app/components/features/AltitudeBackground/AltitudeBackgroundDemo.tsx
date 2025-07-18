import React, { useState, useEffect } from "react";
import AltitudeBackground from "./index";

const AltitudeBackgroundDemo: React.FC = () => {
  const [altitude, setAltitude] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [stepInterval, setStepInterval] = useState(50);

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setAltitude((prev) => {
          const newAltitude = prev + 2;
          if (newAltitude >= 500) {
            setIsAnimating(false);
            return 0;
          }
          return newAltitude;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>Altitude Background Demo</h2>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Altitude: {altitude.toFixed(1)}m
            <input
              type="range"
              min="0"
              max="500"
              value={altitude}
              onChange={(e) => setAltitude(Number(e.target.value))}
              style={{ marginLeft: "10px", width: "300px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Step Interval: {stepInterval}m
            <input
              type="range"
              min="25"
              max="100"
              step="25"
              value={stepInterval}
              onChange={(e) => setStepInterval(Number(e.target.value))}
              style={{ marginLeft: "10px", width: "200px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            style={{
              padding: "10px 20px",
              marginRight: "10px",
              backgroundColor: isAnimating ? "#ff4444" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {isAnimating ? "Stop Animation" : "Start Animation"}
          </button>

          <button
            onClick={() => setAltitude(0)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div
        style={{
          width: "800px",
          height: "600px",
          border: "2px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <AltitudeBackground
          altitudeLevel={altitude / stepInterval}
          containerHeight={600}
          containerWidth={800}
        />
      </div>
    </div>
  );
};

export default AltitudeBackgroundDemo;
