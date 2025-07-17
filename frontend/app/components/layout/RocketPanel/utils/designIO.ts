import type { RocketParams } from "../../../features/Rocket/types";
import { Materials } from "../../../features/Rocket/types";

/**
 * Exports rocket design data as a JSON file
 * RocketParams already uses SI units internally
 * @param rocketParams - The rocket parameters to export (SI units)
 */
export const exportDesignData = (rocketParams: RocketParams): void => {
  // Add metadata to indicate units
  const exportData = {
    version: "1.0",
    units: "SI", // meters, kg, seconds
    exported: new Date().toISOString(),
    data: rocketParams
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const exportFileDefaultName = `${rocketParams.name || "rocket_design"}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

/**
 * Imports rocket design data from a JSON file
 * Expects data in the new format with SI units
 * @param file - The file to import
 * @returns Promise that resolves to the parsed rocket parameters (SI units)
 */
export const importDesignData = (file: File): Promise<RocketParams> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        
        // Expect new format with metadata
        if (parsedData.version && parsedData.units && parsedData.data) {
          if (parsedData.units === "SI") {
            resolve(parsedData.data as RocketParams);
          } else {
            reject(new Error("Unsupported unit system. Expected SI units."));
          }
        } else {
          reject(new Error("Invalid file format. Expected versioned format with metadata."));
        }
      } catch (error) {
        reject(new Error("Invalid JSON format"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Validates if the imported data conforms to RocketParams structure
 * @param data - The data to validate
 * @returns true if valid, false otherwise
 */
export const validateRocketParams = (data: any): data is RocketParams => {
  if (!data || typeof data !== "object") {
    return false;
  }

  // Check required top-level properties
  if (typeof data.name !== "string" || typeof data.designer !== "string") {
    return false;
  }

  // Validate nose section
  if (!validateNose(data.nose)) {
    return false;
  }

  // Validate body section
  if (!validateBody(data.body)) {
    return false;
  }

  // Validate fins section
  if (!validateFins(data.fins)) {
    return false;
  }

  // Validate engine section
  if (!validateEngine(data.engine)) {
    return false;
  }

  return true;
};


/**
 * Validates nose section
 */
const validateNose = (nose: any): boolean => {
  if (!nose || typeof nose !== "object") {
    return false;
  }

  return (
    typeof nose.length === "number" &&
    typeof nose.diameter === "number" &&
    typeof nose.thickness === "number" &&
    typeof nose.material === "string" &&
    nose.material in Materials &&
    typeof nose.color === "string" &&
    typeof nose.type === "string" &&
    ["conical", "ogive", "elliptical"].includes(nose.type)
  );
};

/**
 * Validates body section
 */
const validateBody = (body: any): boolean => {
  if (!body || typeof body !== "object") {
    return false;
  }

  return (
    typeof body.length === "number" &&
    typeof body.diameter === "number" &&
    typeof body.thickness === "number" &&
    typeof body.material === "string" &&
    body.material in Materials &&
    typeof body.color === "string"
  );
};

/**
 * Validates fins section
 */
const validateFins = (fins: any): boolean => {
  if (!fins || typeof fins !== "object") {
    return false;
  }

  const baseValid = (
    typeof fins.thickness === "number" &&
    typeof fins.material === "string" &&
    fins.material in Materials &&
    typeof fins.color === "string" &&
    typeof fins.count === "number" &&
    typeof fins.offset === "number" &&
    typeof fins.type === "string"
  );

  if (!baseValid) {
    return false;
  }

  // Type-specific validation
  switch (fins.type) {
    case "trapozoidal":
      return (
        typeof fins.rootChord === "number" &&
        typeof fins.tipChord === "number" &&
        typeof fins.sweepLength === "number" &&
        typeof fins.height === "number"
      );
    case "elliptical":
      return (
        typeof fins.rootChord === "number" &&
        typeof fins.height === "number"
      );
    case "freedom":
      return (
        Array.isArray(fins.points) &&
        fins.points.every((point: any) => 
          typeof point.x === "number" && typeof point.y === "number"
        )
      );
    default:
      return false;
  }
};

/**
 * Validates engine section
 */
const validateEngine = (engine: any): boolean => {
  if (!engine || typeof engine !== "object") {
    return false;
  }

  return typeof engine.name === "string";
};