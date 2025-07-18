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
  pitch: number[]; // pitch angle in radians
  omega: number[]; // angular velocity in rad/s
  isCombusting: boolean[]; // combustion state
}

const run4DoFSimulation = (
  spec: RocketSpecs,
  initialConditions: {
    launchrodElevation: number; // degrees
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
    pitch: [],
    omega: [],
    isCombusting: [],
  };
  const refArea = Math.PI * Math.pow(spec.diam / 2, 2); // m^2

  // Initial conditions
  let currentTime = 0;
  let position: Point2D = { x: 0, y: 0 };
  let velocity: Point2D = { x: 0, y: 0 };
  let pitch = initialConditions.launchrodElevation * (Math.PI / 180); // Convert to radians
  let omega = 0; // Initial angular velocity
  let mass = spec.mass_i; // Initial mass in kg
  let force: Point2D = { x: 0, y: 0 }; // Initial force vector

  let isLaunchClear = false; // Flag for launch clearance
  let isCombusting = true; // Assume combustion starts immediately

  let touchdown = false; // Flag for touchdown state

  const thrustForceFunction = interpolate(spec.engine.thrustCurve);

  while (currentTime <= maxTime) {
    // Update mass and center of gravity
    mass = isCombusting
      ? spec.mass_i -
        (spec.mass_i - spec.mass_f) * (currentTime / spec.engine.burnTime)
      : spec.mass_f;

    const CG = isCombusting
      ? spec.CGlen_i +
        (spec.CGlen_f - spec.CGlen_i) * (currentTime / spec.engine.burnTime)
      : spec.CGlen_f;

    // Calculate velocity magnitude and unit vector
    const velocityMagnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    const velocityUnitX = velocityMagnitude > 0 ? velocity.x / velocityMagnitude : 0;
    const velocityUnitY = velocityMagnitude > 0 ? velocity.y / velocityMagnitude : 0;

    // Calculate angle of attack
    const velocityAngle = Math.atan2(velocity.y, velocity.x);
    const AoA = pitch - velocityAngle;

    // Calculate forces in inertial coordinate system
    const thrustForce = isCombusting ? thrustForceFunction(currentTime) : 0;
    const dynamicPressure = 0.5 * PHYSICS_CONSTANTS.AIR_DENSITY * velocityMagnitude * velocityMagnitude * refArea;
    
    // Thrust force (along rocket axis)
    const thrustX = thrustForce * Math.cos(pitch);
    const thrustY = thrustForce * Math.sin(pitch);

    // Gravity force (always downward)
    const gravityX = 0;
    const gravityY = -mass * PHYSICS_CONSTANTS.GRAVITY;

    // Drag force (opposite to velocity direction)
    const dragMagnitude = dynamicPressure * spec.Cd;
    const dragX = -dragMagnitude * velocityUnitX;
    const dragY = -dragMagnitude * velocityUnitY;

    // Normal force (perpendicular to rocket axis)
    const normalMagnitude = dynamicPressure * spec.Cna * AoA;
    const normalX = -normalMagnitude * Math.sin(pitch);
    const normalY = normalMagnitude * Math.cos(pitch);

    // Total force in inertial coordinates
    const totalForceX = thrustX + gravityX + dragX + normalX;
    const totalForceY = thrustY + gravityY + dragY + normalY;

    // Check launch rod clearance
    const distanceFromLaunch = Math.sqrt(position.x * position.x + position.y * position.y);
    isLaunchClear = distanceFromLaunch > initialConditions.launchrodLength;

    // During launch rod phase, constrain motion to rod direction
    if (!isLaunchClear) {
      const rodCos = Math.cos(initialConditions.launchrodElevation * Math.PI / 180);
      const rodSin = Math.sin(initialConditions.launchrodElevation * Math.PI / 180);
      
      // Project total force onto rod direction
      const forceAlongRod = totalForceX * rodCos + totalForceY * rodSin;
      
      force = {
        x: forceAlongRod * rodCos,
        y: forceAlongRod * rodSin,
      };
      
      // No rotation during launch rod phase
      const momentArm = 0;
      omega = 0;
    } else {
      // Free flight - use total calculated forces
      force = {
        x: totalForceX,
        y: totalForceY,
      };
      
      // Calculate moment about center of gravity
      const momentArm = spec.CPlen - CG;
      const dampingMoment = -spec.Cmq * (PHYSICS_CONSTANTS.AIR_DENSITY * refArea * spec.ref_len * spec.ref_len / 4) * omega;
      const normalMoment = normalMagnitude * momentArm;
      
      const totalMoment = normalMoment + dampingMoment;
      
      // Update angular velocity
      omega += (totalMoment / spec.Iyz) * timeStep;
    }

    // Update position and velocity (Euler integration)
    position.x += velocity.x * timeStep;
    position.y += velocity.y * timeStep;
    
    const accelerationX = force.x / mass;
    const accelerationY = force.y / mass;
    
    velocity.x += accelerationX * timeStep;
    velocity.y += accelerationY * timeStep;

    // Update pitch angle
    pitch += omega * timeStep;

    // Check for touchdown
    touchdown = position.y <= 0;
    if (touchdown) {
      position.y = 0;
      velocity.y = Math.min(0, velocity.y); // Prevent bouncing
    }

    trajectory.time.push(currentTime);
    trajectory.position.push({ ...position });
    trajectory.velocity.push({ ...velocity });
    trajectory.mass.push(mass);
    trajectory.force.push({ ...force });
    trajectory.pitch.push(pitch);
    trajectory.omega.push(omega);
    trajectory.isCombusting.push(isCombusting);

    // console.log(
    //   `Time: ${currentTime.toFixed(2)}s, Position: (${position.x.toFixed(2)}, ${position.y.toFixed(2)}) m, Velocity: (${velocity.x.toFixed(2)}, ${velocity.y.toFixed(2)}) m/s, Mass: ${mass.toFixed(2)} kg, Force: (${force.x.toFixed(2)}, ${force.y.toFixed(2)}) N, Pitch: ${pitch.toFixed(2)} rad, Omega: ${omega.toFixed(2)} rad/s`
    // );
    // Increment time
    currentTime += timeStep; // increment time by time step
    isCombusting = currentTime <= spec.engine.burnTime; // Check if combustion is still active
    if (touchdown) break;
  }

  return trajectory;
};

export default run4DoFSimulation;
