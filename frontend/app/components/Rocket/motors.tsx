import { useState, useCallback } from "react";

/**
 * Represents a single data point in a motor's thrust curve.
 * Each point defines the thrust output at a specific time during motor burn.
 */
interface ThrustPoint {
  /** Time in seconds from motor ignition */
  time: number;
  /** Thrust force in Newtons */
  thrust: number;
}

/**
 * Motor header information parsed from RASP .eng file format.
 * Contains basic physical specifications and metadata about the motor.
 */
interface MotorHeader {
  /** Motor designation (e.g., "C6", "A10T", "D12") */
  name: string;
  /** Motor diameter in millimeters */
  diameter: number;
  /** Motor length in millimeters */
  length: number;
  /** Available delay times as string (e.g., "0-3-5-7", "3-100") */
  delays: string;
  /** Mass of propellant in kilograms */
  propellantWeight: number;
  /** Mass of empty motor casing in kilograms */
  dryWeight: number;
  /** Motor manufacturer name (e.g., "Estes", "AeroTech") */
  manufacturer: string;
}

/**
 * Calculated motor performance specifications derived from thrust curve data.
 * These values are computed during parsing and used for simulation calculations.
 */
interface MotorSpecifications {
  /** Combined mass of propellant and motor casing in kilograms */
  totalWeight: number;
  /** Duration of motor burn in seconds */
  burnTime: number;
  /** Peak thrust force achieved during burn in Newtons */
  maxThrust: number;
  /** Mean thrust force over entire burn duration in Newtons */
  averageThrust: number;
  /** Total impulse (area under thrust curve) in Newton-seconds */
  totalImpulse: number;
}

/**
 * Complete motor data structure containing all parsed information from a .eng file.
 * This is the main data structure returned by the motor extraction system.
 */
interface MotorData {
  /** Original filename of the .eng file */
  filename: string;
  /** Basic motor specifications from file header */
  header: MotorHeader;
  /** Calculated performance characteristics */
  specifications: MotorSpecifications;
  /** Array of thrust vs time data points */
  thrustCurve: ThrustPoint[];
}

/**
 * React hook for extracting and managing rocket motor data from .eng files.
 * Provides functionality to load, parse, and query motor specifications.
 * 
 * @returns Object containing motor data, loading state, error state, and extraction methods
 * 
 * @example
 * ```typescript
 * const { motorData, loading, error, extractAllMotors } = useMotorExtractor();
 * 
 * useEffect(() => {
 *   extractAllMotors();
 * }, []);
 * 
 * const c6Motor = getMotorByName("C6");
 * ```
 */
export const useMotorExtractor = () => {
  /** Array of successfully parsed motor data */
  const [motorData, setMotorData] = useState<MotorData[]>([]);
  /** Loading state for async motor extraction operations */
  const [loading, setLoading] = useState<boolean>(false);
  /** Error message from last failed operation, empty string if no error */
  const [error, setError] = useState<string>("");

  /**
   * Parses a RASP .eng file format and extracts motor data.
   * 
   * RASP .eng format:
   * - Comment lines start with ';'
   * - Header line: Name Diameter Length Delays PropWeight DryWeight Manufacturer
   * - Data lines: Time(s) Thrust(N)
   * 
   * @param content - Raw text content of the .eng file
   * @param filename - Name of the source file for error reporting
   * @returns Parsed motor data object
   * @throws Error if file format is invalid or required data is missing
   */
  const parseEngFile = useCallback((content: string, filename: string): MotorData => {
    const lines: string[] = content.split("\n").map((line: string) => line.trim());
    let headerLine: string | null = null;
    const dataPoints: ThrustPoint[] = [];

    // Find the header line (first non-comment, non-blank line)
    for (let i = 0; i < lines.length; i++) {
      const line: string = lines[i];
      if (line && !line.startsWith(";") && line.length > 0) {
        headerLine = line;

        // Parse thrust curve data points from remaining lines
        for (let j = i + 1; j < lines.length; j++) {
          const dataLine: string = lines[j].trim();
          if (dataLine && !dataLine.startsWith(";")) {
            const parts: string[] = dataLine.split(/\s+/);
            if (parts.length >= 2) {
              const time: number = parseFloat(parts[0]);
              const thrust: number = parseFloat(parts[1]);
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
    const headerParts: string[] = headerLine.split(/\s+/);
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
    ]: string[] = headerParts;

    // Calculate derived performance values
    const totalWeight: number = parseFloat(propellantWeight) + parseFloat(dryWeight);
    const burnTime: number =
      dataPoints.length > 0 ? Math.max(...dataPoints.map((p: ThrustPoint) => p.time)) : 0;
    const maxThrust: number =
      dataPoints.length > 0 ? Math.max(...dataPoints.map((p: ThrustPoint) => p.thrust)) : 0;

    // Calculate total impulse using trapezoidal integration (area under thrust curve)
    const totalImpulse: number = dataPoints.reduce((impulse: number, point: ThrustPoint, i: number, arr: ThrustPoint[]) => {
      if (i === 0) return 0;
      const prevPoint: ThrustPoint = arr[i - 1];
      const timeInterval: number = point.time - prevPoint.time;
      const avgThrust: number = (point.thrust + prevPoint.thrust) / 2;
      return impulse + avgThrust * timeInterval;
    }, 0);

    const averageThrust: number = burnTime > 0 ? totalImpulse / burnTime : 0;

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

  /**
   * Discovers available motor .eng files in the motors directory.
   * First attempts to load a manifest file, then falls back to checking common motor names.
   * 
   * @returns Promise resolving to array of available .eng filenames
   */
  const discoverMotorFiles = useCallback(async (): Promise<string[]> => {
    try {
      const isDev: boolean = process.env.NODE_ENV === "development";
      const basePath: string = "/motors"; // Always use /motors from public directory

      // Try to load motors manifest first (preferred method)
      console.log("Trying to load manifest from:", `${basePath}/motors-manifest.json`);
      const manifestResponse: Response = await fetch(`${basePath}/motors-manifest.json`);
      if (manifestResponse.ok) {
        const manifest: { files: string[]; generated: string; count: number } = await manifestResponse.json();
        console.log("Loaded manifest:", manifest);
        return manifest.files || [];
      } else {
        console.log("Manifest not found, status:", manifestResponse.status);
      }

      // Fallback: try common motor file patterns if manifest doesn't exist
      const commonFiles: string[] = [
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
      const existingFiles: string[] = [];
      for (const filename of commonFiles) {
        try {
          const response: Response = await fetch(`${basePath}/${filename}`, {
            method: "HEAD",
          });
          if (response.ok) {
            console.log(`Found motor file: ${filename}`);
            existingFiles.push(filename);
          }
        } catch (err: unknown) {
          console.log(`Motor file not found: ${filename}`);
        }
      }

      console.log("Discovered motor files:", existingFiles);
      return existingFiles;
    } catch (err: unknown) {
      console.warn("Error discovering motor files:", err);
      return [];
    }
  }, []);

  /**
   * Extracts and parses all available motor files from the motors directory.
   * Discovers files, downloads their content, parses the data, and updates the motorData state.
   * 
   * @returns Promise resolving to array of successfully parsed motor data
   */
  const extractAllMotors = useCallback(async (): Promise<MotorData[]> => {
    setLoading(true);
    setError("");

    try {
      // Discover available motor files
      const discoveredFiles: string[] = await discoverMotorFiles();

      if (discoveredFiles.length === 0) {
        throw new Error("No .eng files found in motors folder");
      }

      const motors: MotorData[] = [];
      const basePath: string = "/motors"; // Always use /motors from public directory

      // Load and parse each discovered file
      for (const filename of discoveredFiles) {
        try {
          const response: Response = await fetch(`${basePath}/${filename}`);

          if (!response.ok) {
            console.warn(`Failed to load ${filename}: ${response.status}`);
            continue;
          }

          const content: string = await response.text();
          const motorData: MotorData = parseEngFile(content, filename);
          motors.push(motorData);
        } catch (err: unknown) {
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
    } catch (err: unknown) {
      const errorMessage: string = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [discoverMotorFiles, parseEngFile]);

  /**
   * Extracts and parses a single motor file by filename.
   * 
   * @param filename - Name of the .eng file to extract
   * @returns Promise resolving to parsed motor data or null on error
   */
  const extractSingleMotor = useCallback(
    async (filename: string): Promise<MotorData | null> => {
      setLoading(true);
      setError("");

      try {
        const basePath: string = "/motors"; // Always use /motors from public directory

        const response: Response = await fetch(`${basePath}/${filename}`);

        if (!response.ok) {
          throw new Error(`Failed to load ${filename}: ${response.status}`);
        }

        const content: string = await response.text();
        const motorData: MotorData = parseEngFile(content, filename);

        return motorData;
      } catch (err: unknown) {
        const errorMessage: string = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [parseEngFile]
  );

  /**
   * Extracts motor data from raw file content without fetching from server.
   * Useful for processing uploaded files or content from other sources.
   * 
   * @param content - Raw text content of the .eng file
   * @param filename - Filename for error reporting
   * @returns Parsed motor data or null on error
   */
  const extractFromContent = useCallback(
    (content: string, filename: string): MotorData | null => {
      try {
        setError("");
        return parseEngFile(content, filename);
      } catch (err: unknown) {
        const errorMessage: string = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        return null;
      }
    },
    [parseEngFile]
  );

  /**
   * Finds a motor by its designation name.
   * 
   * @param name - Motor designation (e.g., "C6", "A10T")
   * @returns Motor data if found, undefined otherwise
   */
  const getMotorByName = useCallback(
    (name: string): MotorData | undefined => {
      return motorData.find((motor: MotorData) => motor.header.name === name);
    },
    [motorData]
  );

  /**
   * Filters motors by manufacturer name (case-insensitive).
   * 
   * @param manufacturer - Manufacturer name (e.g., "Estes", "AeroTech")
   * @returns Array of motors from the specified manufacturer
   */
  const getMotorsByManufacturer = useCallback(
    (manufacturer: string): MotorData[] => {
      return motorData.filter(
        (motor: MotorData) =>
          motor.header.manufacturer.toLowerCase() === manufacturer.toLowerCase()
      );
    },
    [motorData]
  );

  /**
   * Filters motors by NAR impulse classification (A, B, C, D, etc.).
   * Each class represents a range of total impulse values.
   * 
   * @param impulseClass - Single letter impulse class (A-O)
   * @returns Array of motors in the specified impulse class
   */
  const getMotorsByImpulseClass = useCallback(
    (impulseClass: string): MotorData[] => {
      // NAR impulse classification ranges (Newton-seconds)
      const impulseRanges: Record<string, [number, number]> = {
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

      const range: [number, number] | undefined =
        impulseRanges[impulseClass.toUpperCase()];
      if (!range) return [];

      return motorData.filter((motor: MotorData) => {
        const impulse: number = motor.specifications.totalImpulse;
        return impulse >= range[0] && impulse <= range[1];
      });
    },
    [motorData]
  );

  return {
    // State data
    /** Array of successfully parsed motor data */
    motorData,
    /** Loading state for async operations */
    loading,
    /** Error message from last failed operation */
    error,

    // Extraction methods
    /** Extract and parse all available motor files */
    extractAllMotors,
    /** Extract and parse a single motor file by name */
    extractSingleMotor,
    /** Parse motor data from raw file content */
    extractFromContent,
    /** Discover available motor files in directory */
    discoverMotorFiles,

    // Query methods
    /** Find motor by designation name */
    getMotorByName,
    /** Filter motors by manufacturer */
    getMotorsByManufacturer,
    /** Filter motors by NAR impulse class */
    getMotorsByImpulseClass,

    // Utility
    /** Parse RASP .eng file format */
    parseEngFile,
  };
};

/**
 * Utility functions for motor file operations in Node.js build scripts.
 * These functions are used during the build process to manage motor files.
 */
export const MotorFileUtils = {
  /**
   * Generates a manifest file listing all .eng files in a directory.
   * Used by build scripts to create file indexes for runtime discovery.
   * 
   * @param motorsDir - Path to directory containing .eng files
   * @param outputPath - Path where manifest JSON file should be written
   * @returns Generated manifest object
   */
  generateManifest: (motorsDir: string, outputPath: string): { files: string[]; generated: string; count: number } => {
    const fs = require("fs");
    const path = require("path");

    if (!fs.existsSync(motorsDir)) {
      throw new Error(`Motors directory not found: ${motorsDir}`);
    }

    const files: string[] = fs
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

  /**
   * Copies all .eng files from source directory to target directory.
   * Used by build scripts to copy motor files to public/build directories.
   * 
   * @param sourceDir - Source directory containing .eng files
   * @param targetDir - Destination directory for copied files
   * @returns Array of copied filenames
   */
  copyMotorsToPublic: (sourceDir: string, targetDir: string): string[] => {
    const fs = require("fs");
    const path = require("path");

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const files: string[] = fs
      .readdirSync(sourceDir)
      .filter((file: string) => file.toLowerCase().endsWith(".eng"));

    files.forEach((file: string) => {
      const src: string = path.join(sourceDir, file);
      const dest: string = path.join(targetDir, file);
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
