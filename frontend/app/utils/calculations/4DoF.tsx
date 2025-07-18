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

// State vector for RK4 integration
interface RocketState {
  x: number;      // position x (m)
  y: number;      // position y (m)
  vx: number;     // velocity x (m/s)
  vy: number;     // velocity y (m/s)
  pitch: number;  // pitch angle (rad)
  omega: number;  // angular velocity (rad/s)
}

// Derivative of state vector
interface RocketDerivative {
  dx: number;     // velocity x
  dy: number;     // velocity y
  dvx: number;    // acceleration x
  dvy: number;    // acceleration y
  dpitch: number; // angular velocity
  domega: number; // angular acceleration
}

// Calculate forces and moments for given state
const calculateDerivatives = (
  state: RocketState,
  spec: RocketSpecs,
  initialConditions: { launchrodElevation: number; launchrodLength: number },
  currentTime: number,
  thrustForceFunction: (t: number) => number,
  refArea: number
): RocketDerivative => {
  const { x, y, vx, vy, pitch, omega } = state;
  
  // Update mass and center of gravity
  const isCombusting = currentTime <= spec.engine.burnTime;
  const mass = isCombusting
    ? spec.mass_i - (spec.mass_i - spec.mass_f) * (currentTime / spec.engine.burnTime)
    : spec.mass_f;

  const CG = isCombusting
    ? spec.CGlen_i + (spec.CGlen_f - spec.CGlen_i) * (currentTime / spec.engine.burnTime)
    : spec.CGlen_f;

  // Calculate velocity magnitude and unit vector
  const velocityMagnitude = Math.sqrt(vx * vx + vy * vy);
  const velocityUnitX = velocityMagnitude > 0 ? vx / velocityMagnitude : 0;
  const velocityUnitY = velocityMagnitude > 0 ? vy / velocityMagnitude : 0;

  // Calculate angle of attack
  const velocityAngle = Math.atan2(vy, vx);
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
  const distanceFromLaunch = Math.sqrt(x * x + y * y);
  const isLaunchClear = distanceFromLaunch > initialConditions.launchrodLength;

  let forceX, forceY, angularAcceleration;

  // During launch rod phase, constrain motion to rod direction
  if (!isLaunchClear) {
    const rodCos = Math.cos(initialConditions.launchrodElevation * Math.PI / 180);
    const rodSin = Math.sin(initialConditions.launchrodElevation * Math.PI / 180);
    
    // Project total force onto rod direction
    const forceAlongRod = totalForceX * rodCos + totalForceY * rodSin;
    
    forceX = forceAlongRod * rodCos;
    forceY = forceAlongRod * rodSin;
    
    // No rotation during launch rod phase
    angularAcceleration = 0;
  } else {
    // Free flight - use total calculated forces
    forceX = totalForceX;
    forceY = totalForceY;
    
    // Calculate moment about center of gravity
    const momentArm = spec.CPlen - CG;
    const dampingMoment = -spec.Cmq * (PHYSICS_CONSTANTS.AIR_DENSITY * refArea * spec.ref_len * spec.ref_len / 4) * omega;
    const normalMoment = normalMagnitude * momentArm;
    
    const totalMoment = normalMoment + dampingMoment;
    
    angularAcceleration = totalMoment / spec.Iyz;
  }

  return {
    dx: vx,
    dy: vy,
    dvx: forceX / mass,
    dvy: forceY / mass,
    dpitch: omega,
    domega: angularAcceleration,
  };
};

// RK4 integration step
const rk4Step = (
  state: RocketState,
  spec: RocketSpecs,
  initialConditions: { launchrodElevation: number; launchrodLength: number },
  currentTime: number,
  timeStep: number,
  thrustForceFunction: (t: number) => number,
  refArea: number
): RocketState => {
  // Calculate k1
  const k1 = calculateDerivatives(state, spec, initialConditions, currentTime, thrustForceFunction, refArea);
  
  // Calculate k2
  const state2: RocketState = {
    x: state.x + k1.dx * timeStep / 2,
    y: state.y + k1.dy * timeStep / 2,
    vx: state.vx + k1.dvx * timeStep / 2,
    vy: state.vy + k1.dvy * timeStep / 2,
    pitch: state.pitch + k1.dpitch * timeStep / 2,
    omega: state.omega + k1.domega * timeStep / 2,
  };
  const k2 = calculateDerivatives(state2, spec, initialConditions, currentTime + timeStep / 2, thrustForceFunction, refArea);
  
  // Calculate k3
  const state3: RocketState = {
    x: state.x + k2.dx * timeStep / 2,
    y: state.y + k2.dy * timeStep / 2,
    vx: state.vx + k2.dvx * timeStep / 2,
    vy: state.vy + k2.dvy * timeStep / 2,
    pitch: state.pitch + k2.dpitch * timeStep / 2,
    omega: state.omega + k2.domega * timeStep / 2,
  };
  const k3 = calculateDerivatives(state3, spec, initialConditions, currentTime + timeStep / 2, thrustForceFunction, refArea);
  
  // Calculate k4
  const state4: RocketState = {
    x: state.x + k3.dx * timeStep,
    y: state.y + k3.dy * timeStep,
    vx: state.vx + k3.dvx * timeStep,
    vy: state.vy + k3.dvy * timeStep,
    pitch: state.pitch + k3.dpitch * timeStep,
    omega: state.omega + k3.domega * timeStep,
  };
  const k4 = calculateDerivatives(state4, spec, initialConditions, currentTime + timeStep, thrustForceFunction, refArea);
  
  // Combine using RK4 formula
  return {
    x: state.x + (k1.dx + 2*k2.dx + 2*k3.dx + k4.dx) * timeStep / 6,
    y: state.y + (k1.dy + 2*k2.dy + 2*k3.dy + k4.dy) * timeStep / 6,
    vx: state.vx + (k1.dvx + 2*k2.dvx + 2*k3.dvx + k4.dvx) * timeStep / 6,
    vy: state.vy + (k1.dvy + 2*k2.dvy + 2*k3.dvy + k4.dvy) * timeStep / 6,
    pitch: state.pitch + (k1.dpitch + 2*k2.dpitch + 2*k3.dpitch + k4.dpitch) * timeStep / 6,
    omega: state.omega + (k1.domega + 2*k2.domega + 2*k3.domega + k4.domega) * timeStep / 6,
  };
};

const run4DoFSimulation = (
  spec: RocketSpecs,
  initialConditions: {
    launchrodElevation: number; // degrees
    launchrodLength: number; // meters
  },

  timeStep: number = 0.01, // seconds (reduced for better accuracy with RK4)
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

  // Initial state
  let currentTime = 0;
  let state: RocketState = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    pitch: initialConditions.launchrodElevation * (Math.PI / 180),
    omega: 0,
  };

  let touchdown = false; // Flag for touchdown state

  const thrustForceFunction = interpolate(spec.engine.thrustCurve);

  while (currentTime <= maxTime) {
    // Use RK4 integration to update state
    const newState = rk4Step(state, spec, initialConditions, currentTime, timeStep, thrustForceFunction, refArea);
    
    // Check for touchdown
    if (newState.y <= 0) {
      newState.y = 0;
      newState.vy = Math.min(0, newState.vy); // Prevent bouncing
      touchdown = true;
    }
    
    state = newState;
    
    // Calculate current mass and forces for trajectory recording
    const isCombusting = currentTime <= spec.engine.burnTime;
    const mass = isCombusting
      ? spec.mass_i - (spec.mass_i - spec.mass_f) * (currentTime / spec.engine.burnTime)
      : spec.mass_f;
    
    // Calculate current forces for recording (using derivatives function)
    const derivatives = calculateDerivatives(state, spec, initialConditions, currentTime, thrustForceFunction, refArea);
    const force = {
      x: derivatives.dvx * mass,
      y: derivatives.dvy * mass,
    };

    // Record trajectory data
    trajectory.time.push(currentTime);
    trajectory.position.push({ x: state.x, y: state.y });
    trajectory.velocity.push({ x: state.vx, y: state.vy });
    trajectory.mass.push(mass);
    trajectory.force.push({ ...force });
    trajectory.pitch.push(state.pitch);
    trajectory.omega.push(state.omega);
    trajectory.isCombusting.push(isCombusting);

    // Increment time
    currentTime += timeStep;
    
    if (touchdown) break;
  }

  return trajectory;
};

export default run4DoFSimulation;
