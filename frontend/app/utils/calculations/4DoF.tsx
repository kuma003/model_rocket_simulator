import type { RocketSpecs } from "~/components/features/Rocket/types";
import { useMemo } from "react";
import type { ThrustCurveData } from "../motorParser";
import { PHYSICS_CONSTANTS } from "../physics/constants";

// Interpolation function
const interpolate = (points: ThrustCurveData[]) => {
  return (x: number): number => {
    // Find the segment where x falls
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      if (x >= a.time && x <= b.time) {
        // Linear interpolation
        const t = (x - a.time) / (b.time - a.time);
        return a.thrust + t * (b.thrust - a.thrust);
      }
    }
    return 0; // Out of bounds
  };
};

export interface Point2D {
  x: number; // x coordinate in meters
  y: number; // y coordinate in meters
}

export interface RocketTrajectory {
  time: number[]; // seconds
  position: Point2D[]; // [x, y] in meters
  velocity: Point2D[]; // [vx, vy] in m/s
  mass: number[]; // mass in kg
  force: Point2D[]; // [ax, ay] in m/s²
  pich: number[]; // pitch angle in radians
  omega: number[]; // angular velocity in rad/s
  isCombusting: boolean[]; // combustion state
}

const run4DoFSimulation = (
  spec: RocketSpecs,
  initialConditions: {
    lauchrodElevation: number; // degrees
    launchrodLength: number; // meters
  },

  timeStep: number = 0.1, // seconds
  maxTime: number = 30 // seconds
): RocketTrajectory => {
  // Initialize trajectory data
  const trajectory: RocketTrajectory = {
    time: [],
    position: [],
    velocity: [],
    mass: [],
    force: [],
    pich: [],
    omega: [],
    isCombusting: [],
  };
  const refArea = Math.PI * Math.pow(spec.diam / 2, 2); // m^2

  // Initial conditions
  let currentTime = 0;
  let position: Point2D = { x: 0, y: 0 };
  let velocity: Point2D = { x: 0, y: 0 };
  let pitch = initialConditions.lauchrodElevation * (Math.PI / 180); // Convert to radians
  let omega = 0; // Initial angular velocity
  let mass = spec.mass_i; // Initial mass in kg
  let force: Point2D = { x: 0, y: 0 }; // Initial force vector

  let isLaunchClear = false; // Flag for launch clearance
  let isCombusting = true; // Assume combustion starts immediately

  let touchdown = false; // Flag for touchdown state

  const thrustForceFunction = interpolate(spec.engine.thrustCurve);

  while (currentTime <= maxTime) {
    // Calculate forces and torques
    const velocityMagnitude = Math.sqrt(
      Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2)
    );
    const AoA = pitch - Math.atan2(velocity.y, velocity.x);
    const thrustForce = isCombusting ? thrustForceFunction(currentTime) : 0;
    const preForceCalc =
      0.5 * PHYSICS_CONSTANTS.AIR_DENSITY * velocityMagnitude * refArea;
    const dragForce = -preForceCalc * spec.Cd;
    const normalForce = -preForceCalc * spec.Cna * AoA;
    mass = isCombusting
      ? spec.mass_i -
        (spec.mass_f - spec.mass_i) * (currentTime / spec.engine.burnTime)
      : spec.mass_f;
    const weightForce = -mass * PHYSICS_CONSTANTS.GRAVITY; // kg⋅m/s²

    if (isLaunchClear) {
      // Calculate acceleration
      const sin = Math.sin(pitch);
      const cos = Math.cos(pitch);
      force = {
        x: -sin * normalForce + cos * (thrustForce + dragForce),
        y: cos * normalForce + sin * (thrustForce + dragForce) + weightForce,
      };

      // Update position based on previous velocity and time step
      position.x += velocity.x * timeStep;
      position.y += velocity.y * timeStep;
      // Update velocity based on acceleration and time step
      velocity.x += (force.x * timeStep) / mass;
      velocity.y += (force.y * timeStep) / mass;

      const preMomentCalc =
        (PHYSICS_CONSTANTS.AIR_DENSITY *
          refArea *
          spec.ref_len *
          spec.ref_len) /
        4;

      const CG = isCombusting
        ? spec.CGlen_i +
          (spec.CGlen_f - spec.CGlen_i) * (currentTime / spec.engine.burnTime)
        : spec.CGlen_f;

      // Update pitch and angular velocity
      pitch += omega * timeStep; // update pich angle before update omega
      omega +=
        (spec.Cmq * preMomentCalc + normalForce * (spec.CPlen - CG)) * timeStep;

      touchdown = position.y <= 0; // Check if rocket has touched down
      if (touchdown) position.y = 0; // Reset position to ground level
    } else {
      // Calculate acceleration
      const sin = Math.sin(pitch);
      const cos = Math.cos(pitch);
      force = {
        x: cos * (thrustForce + dragForce + weightForce * sin), // weight force acts along the launch rod
        y: sin * (thrustForce + dragForce + weightForce * sin),
      };

      // Update position based on previous velocity and time step
      position.x += velocity.x * timeStep;
      position.y += velocity.y * timeStep;
      // Update velocity based on acceleration and time step
      velocity.x += (force.x * timeStep) / mass;
      velocity.y += (force.y * timeStep) / mass;

      // Update pitch and angular velocity (assuming no rotation during launch rod phase)
      pitch += 0;
      omega += 0;

      isLaunchClear =
        Math.pow(position.x, 2) + Math.pow(position.y, 2) >
        Math.pow(initialConditions.launchrodLength, 2); // Launch is clear if the rocket is beyond the launch rod length
    }

    trajectory.time.push(currentTime);
    trajectory.position.push({ ...position });
    trajectory.velocity.push({ ...velocity });
    trajectory.mass.push(mass);
    trajectory.force.push({ ...force });
    trajectory.pich.push(pitch);
    trajectory.omega.push(omega);
    trajectory.isCombusting.push(isCombusting);

    // console.log(
    //   `Time: ${currentTime.toFixed(2)}s, Position: (${position.x.toFixed(2)}, ${position.y.toFixed(2)}) m, Velocity: (${velocity.x.toFixed(2)}, ${velocity.y.toFixed(2)}) m/s, Mass: ${mass.toFixed(2)} kg, Force: (${force.x.toFixed(2)}, ${force.y.toFixed(2)}) N, Pitch: ${pitch.toFixed(2)} rad, Omega: ${omega.toFixed(2)} rad/s`
    // );
    // Increment time
    currentTime += timeStep;
    if (touchdown) break;
  }

  return trajectory;
};

export default run4DoFSimulation;
