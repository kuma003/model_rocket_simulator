export interface ThrustCurveData {
  time: number;
  thrust: number;
}

export interface MotorData {
  name: string;
  thrustCurve: ThrustCurveData[];
  totalImpulse: number;
  averageThrust: number;
  burnTime: number;
  peakThrust: number;
}

export function parseMotorFile(content: string): MotorData | null {
  const lines = content.split('\n').filter(line => line.trim() && !line.startsWith(';'));
  
  if (lines.length < 2) return null;

  // Parse header line (format: NAME diameter length delays propMass totalMass manufacturer)
  const headerParts = lines[0].split(' ');
  const name = headerParts[0];
  
  // Parse thrust curve data points
  const thrustCurve: ThrustCurveData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].trim().split(/\s+/);
    if (parts.length >= 2) {
      const time = parseFloat(parts[0]);
      const thrust = parseFloat(parts[1]);
      
      if (!isNaN(time) && !isNaN(thrust)) {
        thrustCurve.push({ time, thrust });
      }
    }
  }

  if (thrustCurve.length === 0) return null;

  // Calculate motor statistics
  const burnTime = thrustCurve[thrustCurve.length - 1].time;
  const peakThrust = Math.max(...thrustCurve.map(point => point.thrust));
  
  // Calculate total impulse using trapezoidal rule
  let totalImpulse = 0;
  for (let i = 1; i < thrustCurve.length; i++) {
    const dt = thrustCurve[i].time - thrustCurve[i - 1].time;
    const avgThrust = (thrustCurve[i].thrust + thrustCurve[i - 1].thrust) / 2;
    totalImpulse += avgThrust * dt;
  }
  
  const averageThrust = totalImpulse / burnTime;

  return {
    name,
    thrustCurve,
    totalImpulse,
    averageThrust,
    burnTime,
    peakThrust,
  };
}

export async function loadMotorData(motorName: string): Promise<MotorData | null> {
  try {
    // Check if we're in Storybook environment and have mock data
    if (typeof window !== 'undefined' && (window as any).__mockMotorData) {
      const mockData = (window as any).__mockMotorData[motorName];
      if (mockData) {
        return mockData;
      }
    }

    // Convert motor name to filename
    const filename = motorName.replace(/\s+/g, '_') + '.eng';
    const response = await fetch(`/motors/${filename}`);
    
    if (!response.ok) {
      console.warn(`Could not load motor file: ${filename}`);
      return null;
    }
    
    const content = await response.text();
    return parseMotorFile(content);
  } catch (error) {
    console.error('Error loading motor data:', error);
    return null;
  }
}