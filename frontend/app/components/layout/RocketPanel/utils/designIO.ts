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
 * Handles both old format (display units) and new format (SI units)
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
        
        let rocketParams: RocketParams;
        
        // Check if this is the new format with metadata
        if (parsedData.version && parsedData.units && parsedData.data) {
          // New format - data is already in SI units
          if (parsedData.units === "SI") {
            rocketParams = parsedData.data as RocketParams;
          } else {
            // Unknown units, assume SI for safety
            rocketParams = parsedData.data as RocketParams;
          }
        } else {
          // Old format - assume display units (cm), convert to SI
          rocketParams = convertLegacyParamsToSI(parsedData);
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
 * Converts legacy rocket parameters (display units) to SI units
 * @param legacyParams - Legacy parameters in display units (cm)
 * @returns Parameters in SI units (meters)
 */
const convertLegacyParamsToSI = (legacyParams: any): RocketParams => {
  const params = { ...legacyParams };
  
  // Convert nose parameters
  if (params.nose) {
    params.nose.length = (params.nose.length || 0) / 100;
    params.nose.diameter = (params.nose.diameter || 0) / 100;
    params.nose.thickness = (params.nose.thickness || 0) / 100;
  }
  
  // Convert body parameters
  if (params.body) {
    params.body.length = (params.body.length || 0) / 100;
    params.body.diameter = (params.body.diameter || 0) / 100;
    params.body.thickness = (params.body.thickness || 0) / 100;
  }
  
  // Convert fins parameters
  if (params.fins) {
    params.fins.thickness = (params.fins.thickness || 0) / 100;
    params.fins.offset = (params.fins.offset || 0) / 100;
    
    if (params.fins.rootChord !== undefined) {
      params.fins.rootChord = params.fins.rootChord / 100;
    }
    if (params.fins.tipChord !== undefined) {
      params.fins.tipChord = params.fins.tipChord / 100;
    }
    if (params.fins.sweepLength !== undefined) {
      params.fins.sweepLength = params.fins.sweepLength / 100;
    }
    if (params.fins.height !== undefined) {
      params.fins.height = params.fins.height / 100;
    }
    if (params.fins.points) {
      params.fins.points = params.fins.points.map((point: any) => ({
        x: point.x / 100,
        y: point.y / 100,
      }));
    }
  }
  
  return params as RocketParams;
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