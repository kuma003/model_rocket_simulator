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
    
    // Use appropriate base path for development vs production (GitHub Pages)
    const isDev = import.meta.env.DEV;
    const basePath = isDev ? "/motors" : "/model_rocket_simulator/motors";
    const fileUrl = `${basePath}/${filename}`;
    
    console.log(`Loading motor file from: ${fileUrl} (isDev: ${isDev})`);
    
    const response = await fetch(fileUrl, {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Accept": "text/plain",
      }
    });
    
    console.log(`Motor file response for ${filename}:`, {
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });
    
    if (!response.ok) {
      console.warn(`Could not load motor file: ${filename} from ${fileUrl} (status: ${response.status})`);
      return null;
    }
    
    const content = await response.text();
    console.log(`Successfully loaded motor file ${filename}, content length: ${content.length}`);
    return parseMotorFile(content);
  } catch (error) {
    console.error('Error loading motor data:', error);
    return null;
  }
}