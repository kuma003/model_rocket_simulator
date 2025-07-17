import type { RocketParams } from "../../../features/Rocket/types";
import { Materials } from "../../../features/Rocket/types";
import { toSIRocketParams, fromSIRocketParams, type RocketParamsDisplay, type RocketParamsSI } from "~/utils/units";

/**
 * Exports rocket design data as a JSON file
 * Data is exported in SI units for consistency
 * @param rocketParams - The rocket parameters to export (in display units)
 */
export const exportDesignData = (rocketParams: RocketParams): void => {
  // Convert to SI units before export
  const siParams = toSIRocketParams(rocketParams as RocketParamsDisplay);
  
  // Add metadata to indicate units
  const exportData = {
    version: "1.0",
    units: "SI", // meters, kg, seconds
    exported: new Date().toISOString(),
    data: siParams
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
 * Handles both old format (display units) and new format (SI units)
 * @param file - The file to import
 * @returns Promise that resolves to the parsed rocket parameters (in display units)
 */
export const importDesignData = (file: File): Promise<RocketParams> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        
        let rocketParams: RocketParams;
        
        // Check if this is the new format with metadata
        if (parsedData.version && parsedData.units && parsedData.data) {
          // New format - convert from SI to display units
          if (parsedData.units === "SI") {
            rocketParams = fromSIRocketParams(parsedData.data as RocketParamsSI) as RocketParams;
          } else {
            // Unknown units, assume SI for safety
            rocketParams = fromSIRocketParams(parsedData.data as RocketParamsSI) as RocketParams;
          }
        } else {
          // Old format - assume display units (cm)
          rocketParams = parsedData as RocketParams;
        }
        
        resolve(rocketParams);
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
 * Validates if the imported data conforms to the new export format
 * @param data - The data to validate
 * @returns true if valid, false otherwise
 */
export const validateExportFormat = (data: any): boolean => {
  if (!data || typeof data !== "object") {
    return false;
  }

  // Check metadata
  if (typeof data.version !== "string" || typeof data.units !== "string") {
    return false;
  }

  // Check if data field exists and is valid
  if (!data.data || !validateRocketParams(data.data)) {
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