/**
 * Motor Data Extraction System
 *
 * This module extracts and processes rocket motor data from RASP .eng files.
 * All physical quantities are converted to and stored in SI (International System of Units).
 *
 * SI Base Units Used:
 * - Length: meter (m)
 * - Mass: kilogram (kg)
 * - Time: second (s)
 *
 * SI Derived Units Used:
 * - Force: Newton (N = kg⋅m⋅s⁻²)
 * - Impulse: Newton-second (N⋅s = kg⋅m⋅s⁻¹)
 *
 * Unit Conversions from RASP Format:
 * - Diameter: millimeters → meters (×0.001)
 * - Length: millimeters → meters (×0.001)
 * - Mass: kilograms (no conversion needed)
 * - Time: seconds (no conversion needed)
 * - Force: Newtons (no conversion needed)
 */

import { useState, useCallback } from "react";

/**
 * Unit conversion utilities for RASP to SI conversion.
 */
const UnitConversions = {
  /** Convert millimeters to meters */
  mmToM: (mm: number): number => mm * 0.001,

  /** Convert meters to millimeters (for display purposes) */
  mToMm: (m: number): number => m * 1000,

  /** Validate that a value is a positive number */
  validatePositive: (value: number, name: string): void => {
    if (isNaN(value) || value < 0) {
      throw new Error(
        `Invalid ${name}: must be a positive number, got ${value}`
      );
    }
  },

  /** Validate that a value is non-negative */
  validateNonNegative: (value: number, name: string): void => {
    if (isNaN(value) || value < 0) {
      throw new Error(`Invalid ${name}: must be non-negative, got ${value}`);
    }
  },

  /** Parse delay string into array of numbers (e.g., "0-3-5-7" → [0, 3, 5, 7]) */
  parseDelays: (delayString: string): number[] => {
    if (!delayString || delayString.trim() === "") {
      return [];
    }

    return delayString
      .split("-")
      .map((delay) => {
        const trimmed = delay.trim();
        const parsed = trimmed == "P" ? Infinity : parseFloat(trimmed); // P means no ejection.
        if (isNaN(parsed)) {
          throw new Error(
            `Invalid delay value: "${delay}" in delay string "${delayString}"`
          );
        }
        UnitConversions.validateNonNegative(parsed, `delay "${delay}"`);
        return parsed;
      })
      .sort((a, b) => a - b); // Sort delays in ascending order
  },
} as const;

/**
 * Represents a single data point in a motor's thrust curve.
 * Each point defines the thrust output at a specific time during motor burn.
 * All units are in SI (International System of Units).
 */
interface ThrustPoint {
  /** Time in seconds from motor ignition (SI base unit) */
  time: number;
  /** Thrust force in Newtons (SI derived unit: kg⋅m⋅s⁻²) */
  thrust: number;
}

/**
 * Motor header information parsed from RASP .eng file format.
 * Contains basic physical specifications and metadata about the motor.
 * All units are in SI (International System of Units).
 */
interface MotorHeader {
  /** Motor designation (e.g., "C6", "A10T", "D12") */
  name: string;
  /** Motor diameter in meters (converted from mm in RASP file) */
  diameter: number;
  /** Motor length in meters (converted from mm in RASP file) */
  length: number;
  /** Available delay times in seconds, parsed from "-" delimited string */
  delays: number[];
  /** Mass of propellant in kilograms (SI base unit) */
  propellantWeight: number;
  /** Mass of empty motor casing in kilograms (SI base unit) */
  dryWeight: number;
  /** Motor manufacturer name (e.g., "Estes", "AeroTech") */
  manufacturer: string;
}

/**
 * Calculated motor performance specifications derived from thrust curve data.
 * These values are computed during parsing and used for simulation calculations.
 * All units are in SI (International System of Units).
 */
interface MotorSpecifications {
  /** Combined mass of propellant and motor casing in kilograms (SI base unit) */
  totalWeight: number;
  /** Duration of motor burn in seconds (SI base unit) */
  burnTime: number;
  /** Peak thrust force achieved during burn in Newtons (SI derived unit) */
  maxThrust: number;
  /** Mean thrust force over entire burn duration in Newtons (SI derived unit) */
  averageThrust: number;
  /** Total impulse (area under thrust curve) in Newton-seconds (SI derived unit) */
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
   * Converts all units to SI (International System of Units).
   *
   * RASP .eng format:
   * - Comment lines start with ';'
   * - Header line: Name Diameter(mm) Length(mm) Delays PropWeight(kg) DryWeight(kg) Manufacturer
   * - Data lines: Time(s) Thrust(N)
   *
   * Unit conversions applied:
   * - Diameter: mm → m (×0.001)
   * - Length: mm → m (×0.001)
   * - Time: s (already SI)
   * - Thrust: N (already SI)
   * - Mass: kg (already SI)
   *
   * @param content - Raw text content of the .eng file
   * @param filename - Name of the source file for error reporting
   * @returns Parsed motor data object with all values in SI units
   * @throws Error if file format is invalid or required data is missing
   */
  const parseEngFile = useCallback(
    (content: string, filename: string): MotorData => {
      const lines: string[] = content
        .split("\n")
        .map((line: string) => line.trim());
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

      // Parse header: Name Diameter(mm) Length(mm) Delays PropWeight(kg) DryWeight(kg) Manufacturer
      const headerParts: string[] = headerLine.split(/\s+/);
      if (headerParts.length < 7) {
        throw new Error(
          `Invalid header format in ${filename}. Expected 7 fields`
        );
      }

      const [
        name,
        diameterMm,
        lengthMm,
        delays,
        propellantWeightKg,
        dryWeightKg,
        manufacturer,
      ]: string[] = headerParts;

      // Convert RASP units to SI units with validation
      const diameterMmValue: number = parseFloat(diameterMm);
      const lengthMmValue: number = parseFloat(lengthMm);
      const propellantWeightValue: number = parseFloat(propellantWeightKg);
      const dryWeightValue: number = parseFloat(dryWeightKg);

      // Validate parsed values
      UnitConversions.validatePositive(
        diameterMmValue,
        `diameter in ${filename}`
      );
      UnitConversions.validatePositive(lengthMmValue, `length in ${filename}`);
      UnitConversions.validateNonNegative(
        propellantWeightValue,
        `propellant weight in ${filename}`
      );
      UnitConversions.validateNonNegative(
        dryWeightValue,
        `dry weight in ${filename}`
      );

      // Apply unit conversions and parse delays
      const diameterM: number = UnitConversions.mmToM(diameterMmValue); // mm → m
      const lengthM: number = UnitConversions.mmToM(lengthMmValue); // mm → m
      const propellantWeightSI: number = propellantWeightValue; // kg (already SI)
      const dryWeightSI: number = dryWeightValue; // kg (already SI)
      const delaysList: number[] = UnitConversions.parseDelays(delays); // parse "-" delimited delays.
      // Time and thrust data points are already in SI units (s, N)

      // Calculate derived performance values (all in SI units)
      const totalWeight: number = propellantWeightSI + dryWeightSI; // kg
      const burnTime: number =
        dataPoints.length > 0
          ? Math.max(...dataPoints.map((p: ThrustPoint) => p.time))
          : 0; // s
      const maxThrust: number =
        dataPoints.length > 0
          ? Math.max(...dataPoints.map((p: ThrustPoint) => p.thrust))
          : 0; // N

      // Calculate total impulse using trapezoidal integration (area under thrust curve)
      const totalImpulse: number = dataPoints.reduce(
        (
          impulse: number,
          point: ThrustPoint,
          i: number,
          arr: ThrustPoint[]
        ) => {
          if (i === 0) return 0;
          const prevPoint: ThrustPoint = arr[i - 1];
          const timeInterval: number = point.time - prevPoint.time; // s
          const avgThrust: number = (point.thrust + prevPoint.thrust) / 2; // N
          return impulse + avgThrust * timeInterval; // N⋅s
        },
        0
      );

      const averageThrust: number = burnTime > 0 ? totalImpulse / burnTime : 0; // N

      return {
        filename,
        header: {
          name,
          diameter: diameterM, // m (SI)
          length: lengthM, // m (SI)
          delays: delaysList, // s (SI, parsed from string)
          propellantWeight: propellantWeightSI, // kg (SI)
          dryWeight: dryWeightSI, // kg (SI)
          manufacturer,
        },
        specifications: {
          totalWeight, // kg (SI)
          burnTime, // s (SI)
          maxThrust, // N (SI)
          averageThrust, // N (SI)
          totalImpulse, // N⋅s (SI)
        },
        thrustCurve: dataPoints, // time: s, thrust: N (SI)
      };
    },
    []
  );

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
      console.log(
        "Trying to load manifest from:",
        `${basePath}/motors-manifest.json`
      );
      const manifestResponse: Response = await fetch(
        `${basePath}/motors-manifest.json`
      );
      if (manifestResponse.ok) {
        const manifest: { files: string[]; generated: string; count: number } =
          await manifestResponse.json();
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
      const errorMessage: string =
        err instanceof Error ? err.message : String(err);
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
        const errorMessage: string =
          err instanceof Error ? err.message : String(err);
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
        const errorMessage: string =
          err instanceof Error ? err.message : String(err);
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
   * Each class represents a range of total impulse values in Newton-seconds (SI units).
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
  generateManifest: (
    motorsDir: string,
    outputPath: string
  ): { files: string[]; generated: string; count: number } => {
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
