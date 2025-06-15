import { useState, useCallback } from "react";

// TypeScript interfaces
interface ThrustPoint {
  time: number;
  thrust: number;
}

interface MotorHeader {
  name: string;
  diameter: number;
  length: number;
  delays: string;
  propellantWeight: number;
  dryWeight: number;
  manufacturer: string;
}

interface MotorSpecifications {
  totalWeight: number;
  burnTime: number;
  maxThrust: number;
  averageThrust: number;
  totalImpulse: number;
}

interface MotorData {
  filename: string;
  header: MotorHeader;
  specifications: MotorSpecifications;
  thrustCurve: ThrustPoint[];
}

// Motor data extraction hook
export const useMotorExtractor = () => {
  const [motorData, setMotorData] = useState<MotorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Parse RASP .eng file format
  const parseEngFile = useCallback((content: string, filename: any) => {
    const lines = content.split("\n").map((line) => line.trim());
    let headerLine = null;
    let dataPoints = [];

    // Find the header line (first non-comment, non-blank line)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line && !line.startsWith(";") && line.length > 0) {
        headerLine = line;

        // Parse data points from remaining lines
        for (let j = i + 1; j < lines.length; j++) {
          const dataLine = lines[j].trim();
          if (dataLine && !dataLine.startsWith(";")) {
            const parts = dataLine.split(/\s+/);
            if (parts.length >= 2) {
              const time = parseFloat(parts[0]);
              const thrust = parseFloat(parts[1]);
              if (!isNaN(time) && !isNaN(thrust)) {
                dataPoints.push({ time, thrust });
              }
            }
          }
        }
        break;
      }
    }

    if (!headerLine) {
      throw new Error(`No header line found in ${filename}`);
    }

    // Parse header: Name Diameter Length Delays ProWeight DrWeight Manufacturer
    const headerParts = headerLine.split(/\s+/);
    if (headerParts.length < 7) {
      throw new Error(
        `Invalid header format in ${filename}. Expected 7 fields`
      );
    }

    const [
      name,
      diameter,
      length,
      delays,
      propellantWeight,
      dryWeight,
      manufacturer,
    ] = headerParts;

    // Calculate derived values
    const totalWeight = parseFloat(propellantWeight) + parseFloat(dryWeight);
    const burnTime =
      dataPoints.length > 0 ? Math.max(...dataPoints.map((p) => p.time)) : 0;
    const maxThrust =
      dataPoints.length > 0 ? Math.max(...dataPoints.map((p) => p.thrust)) : 0;

    // Calculate total impulse (area under thrust curve)
    const totalImpulse = dataPoints.reduce((impulse, point, i, arr) => {
      if (i === 0) return 0;
      const prevPoint = arr[i - 1];
      const timeInterval = point.time - prevPoint.time;
      const avgThrust = (point.thrust + prevPoint.thrust) / 2;
      return impulse + avgThrust * timeInterval;
    }, 0);

    const averageThrust = burnTime > 0 ? totalImpulse / burnTime : 0;

    return {
      filename,
      header: {
        name,
        diameter: parseFloat(diameter),
        length: parseFloat(length),
        delays,
        propellantWeight: parseFloat(propellantWeight),
        dryWeight: parseFloat(dryWeight),
        manufacturer,
      },
      specifications: {
        totalWeight,
        burnTime,
        maxThrust,
        averageThrust,
        totalImpulse,
      },
      thrustCurve: dataPoints,
    };
  }, []);

  // Discover .eng files in the motors folder
  const discoverMotorFiles = useCallback(async () => {
    try {
      const isDev = process.env.NODE_ENV === "development";
      const basePath = "/motors"; // Always use /motors from public directory

      // Try to load motors manifest first
      console.log("Trying to load manifest from:", `${basePath}/motors-manifest.json`);
      const manifestResponse = await fetch(`${basePath}/motors-manifest.json`);
      if (manifestResponse.ok) {
        const manifest = await manifestResponse.json();
        console.log("Loaded manifest:", manifest);
        return manifest.files || [];
      } else {
        console.log("Manifest not found, status:", manifestResponse.status);
      }

      // Fallback: try common patterns if manifest doesn't exist
      const commonFiles = [
        "Estes_A3.eng",
        "Estes_A10.eng",
        "Estes_B4.eng",
        "Estes_C6.eng",
        "AeroTech_F32.eng",
        "Cesaroni_H115.eng",
        "Quest_A6.eng",
        "Quest_B6.eng",
        "Apogee_D10.eng",
        "Klima_E30.eng",
      ];

      console.log("Fallback: checking for common motor files...");
      const existingFiles = [];
      for (const filename of commonFiles) {
        try {
          const response = await fetch(`${basePath}/${filename}`, {
            method: "HEAD",
          });
          if (response.ok) {
            console.log(`Found motor file: ${filename}`);
            existingFiles.push(filename);
          }
        } catch (err) {
          console.log(`Motor file not found: ${filename}`);
        }
      }

      console.log("Discovered motor files:", existingFiles);
      return existingFiles;
    } catch (err) {
      console.warn("Error discovering motor files:", err);
      return [];
    }
  }, []);

  // Extract all motors from the motors folder
  const extractAllMotors = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Discover available files
      const discoveredFiles = await discoverMotorFiles();

      if (discoveredFiles.length === 0) {
        throw new Error("No .eng files found in motors folder");
      }

      const motors = [];
      const basePath = "/motors"; // Always use /motors from public directory

      // Load and parse each file
      for (const filename of discoveredFiles) {
        try {
          const response = await fetch(`${basePath}/${filename}`);

          if (!response.ok) {
            console.warn(`Failed to load ${filename}: ${response.status}`);
            continue;
          }

          const content = await response.text();
          const motorData = parseEngFile(content, filename);
          motors.push(motorData);
        } catch (err) {
          console.warn(
            `Error parsing ${filename}:`,
            err instanceof Error ? err.message : String(err)
          );
        }
      }

      if (motors.length === 0) {
        throw new Error("No motor files could be parsed successfully");
      }

      setMotorData(motors);
      return motors;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return [];
    } finally {
      setLoading(false);
    }
  }, [discoverMotorFiles, parseEngFile]);

  // Extract single motor file
  const extractSingleMotor = useCallback(
    async (filename: string) => {
      setLoading(true);
      setError("");

      try {
        const basePath = "/motors"; // Always use /motors from public directory

        const response = await fetch(`${basePath}/${filename}`);

        if (!response.ok) {
          throw new Error(`Failed to load ${filename}: ${response.status}`);
        }

        const content = await response.text();
        const motorData = parseEngFile(content, filename);

        return motorData;
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [parseEngFile]
  );

  // Extract motor from file content
  const extractFromContent = useCallback(
    (content: string, filename: any) => {
      try {
        setError("");
        return parseEngFile(content, filename);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        return null;
      }
    },
    [parseEngFile]
  );

  // Get motor by name
  const getMotorByName = useCallback(
    (name: string) => {
      return motorData.find((motor) => motor.header.name === name);
    },
    [motorData]
  );

  // Get motors by manufacturer
  const getMotorsByManufacturer = useCallback(
    (manufacturer: string) => {
      return motorData.filter(
        (motor) =>
          motor.header.manufacturer.toLowerCase() === manufacturer.toLowerCase()
      );
    },
    [motorData]
  );

  // Filter motors by impulse class
  const getMotorsByImpulseClass = useCallback(
    (impulseClass: string) => {
      const impulseRanges = {
        A: [1.26, 2.5],
        B: [2.51, 5.0],
        C: [5.01, 10.0],
        D: [10.01, 20.0],
        E: [20.01, 40.0],
        F: [40.01, 80.0],
        G: [80.01, 160.0],
        H: [160.01, 320.0],
        I: [320.01, 640.0],
        J: [640.01, 1280.0],
        K: [1280.01, 2560.0],
        L: [2560.01, 5120.0],
        M: [5120.01, 10240.0],
        N: [10240.01, 20480.0],
        O: [20480.01, 40960.0],
      };

      const range =
        impulseRanges[impulseClass.toUpperCase() as keyof typeof impulseRanges];
      if (!range) return [];

      return motorData.filter((motor) => {
        const impulse = motor.specifications.totalImpulse;
        return impulse >= range[0] && impulse <= range[1];
      });
    },
    [motorData]
  );

  return {
    // Data
    motorData,
    loading,
    error,

    // Extraction methods
    extractAllMotors,
    extractSingleMotor,
    extractFromContent,
    discoverMotorFiles,

    // Query methods
    getMotorByName,
    getMotorsByManufacturer,
    getMotorsByImpulseClass,

    // Utility
    parseEngFile,
  };
};

// File system utilities for build scripts
export const MotorFileUtils = {
  // Generate motors manifest (for Node.js build scripts)
  generateManifest: (motorsDir: any, outputPath: any) => {
    const fs = require("fs");
    const path = require("path");

    if (!fs.existsSync(motorsDir)) {
      throw new Error(`Motors directory not found: ${motorsDir}`);
    }

    const files = fs
      .readdirSync(motorsDir)
      .filter((file: string) => file.toLowerCase().endsWith(".eng"))
      .sort();

    const manifest = {
      files,
      generated: new Date().toISOString(),
      count: files.length,
    };

    fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
    return manifest;
  },

  // Copy motors to public directory (for build scripts)
  copyMotorsToPublic: (sourceDir: any, targetDir: any) => {
    const fs = require("fs");
    const path = require("path");

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const files = fs
      .readdirSync(sourceDir)
      .filter((file: string) => file.toLowerCase().endsWith(".eng"));

    files.forEach((file: any) => {
      const src = path.join(sourceDir, file);
      const dest = path.join(targetDir, file);
      fs.copyFileSync(src, dest);
    });

    return files;
  },
};

// TypeScript interfaces (for reference)
export const MotorDataTypes = {
  MotorHeader: {
    name: "string",
    diameter: "number",
    length: "number",
    delays: "string",
    propellantWeight: "number",
    dryWeight: "number",
    manufacturer: "string",
  },

  MotorSpecifications: {
    totalWeight: "number",
    burnTime: "number",
    maxThrust: "number",
    averageThrust: "number",
    totalImpulse: "number",
  },

  ThrustPoint: {
    time: "number",
    thrust: "number",
  },

  MotorData: {
    filename: "string",
    header: "MotorHeader",
    specifications: "MotorSpecifications",
    thrustCurve: "ThrustPoint[]",
  },
};

export default useMotorExtractor;
