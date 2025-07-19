import type { RocketParams } from "../components/features/Rocket/types";
import { Materials } from "../components/features/Rocket/types";
import { loadMotorData } from "./motorParser";

/**
 * Serializable rocket parameters with reduced engine data
 */
export interface SerializableRocketParams extends Omit<RocketParams, 'engine'> {
  engine: {
    name: string;
  };
}

/**
 * Metadata for exported rocket files
 */
export interface RocketExportMetadata {
  version: string;
  units: string;
  exported: string;
}

/**
 * Complete export format with metadata
 */
export interface RocketExportData {
  version: string;
  units: string;
  exported: string;
  data: SerializableRocketParams;
}

/**
 * Converts full RocketParams to serializable format by reducing engine data
 * @param params - Full rocket parameters
 * @returns Serializable rocket parameters with reduced engine data
 */
export function toSerializableRocketParams(params: RocketParams): SerializableRocketParams {
  return {
    ...params,
    engine: { name: params.engine.name },
  };
}

/**
 * Converts serializable rocket params back to full RocketParams by fetching engine data
 * @param params - Serializable rocket parameters
 * @returns Promise resolving to full rocket parameters
 */
export async function fromSerializableRocketParams(
  params: SerializableRocketParams
): Promise<RocketParams> {
  try {
    const motorData = await loadMotorData(params.engine.name);
    if (!motorData) {
      throw new Error(`Motor data not found for engine: ${params.engine.name}`);
    }
    
    return {
      ...params,
      engine: motorData,
    };
  } catch (error) {
    console.error("Failed to load motor data:", error);
    throw error;
  }
}

/**
 * Creates export data with metadata
 * @param params - Rocket parameters to export
 * @param metadata - Optional metadata (defaults will be used if not provided)
 * @returns Export data with metadata
 */
export function createExportData(
  params: RocketParams,
  metadata?: Partial<RocketExportMetadata>
): RocketExportData {
  return {
    version: metadata?.version || "1.0",
    units: metadata?.units || "SI",
    exported: metadata?.exported || new Date().toISOString(),
    data: toSerializableRocketParams(params),
  };
}

/**
 * Parses export data and returns full rocket parameters
 * @param exportData - Export data with metadata
 * @returns Promise resolving to full rocket parameters
 */
export async function parseExportData(exportData: RocketExportData): Promise<RocketParams> {
  if (!exportData.version || !exportData.units || !exportData.data) {
    throw new Error("Invalid export data format");
  }

  if (exportData.units !== "SI") {
    throw new Error("Unsupported unit system. Expected SI units.");
  }

  if (!validateSerializableRocketParams(exportData.data)) {
    throw new Error("Invalid rocket parameters data");
  }

  return await fromSerializableRocketParams(exportData.data);
}

/**
 * Validates if the data conforms to SerializableRocketParams structure
 * @param data - The data to validate
 * @returns true if valid, false otherwise
 */
export function validateSerializableRocketParams(data: any): data is SerializableRocketParams {
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

  // Validate payload section
  if (!validatePayload(data.payload)) {
    return false;
  }

  // Validate engine section (simplified)
  if (!validateSimpleEngine(data.engine)) {
    return false;
  }

  return true;
}

/**
 * Validates nose section
 */
function validateNose(nose: any): boolean {
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
}

/**
 * Validates body section
 */
function validateBody(body: any): boolean {
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
}

/**
 * Validates fins section
 */
function validateFins(fins: any): boolean {
  if (!fins || typeof fins !== "object") {
    return false;
  }

  const baseValid =
    typeof fins.thickness === "number" &&
    typeof fins.material === "string" &&
    fins.material in Materials &&
    typeof fins.color === "string" &&
    typeof fins.count === "number" &&
    typeof fins.offset === "number" &&
    typeof fins.type === "string";

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
        typeof fins.rootChord === "number" && typeof fins.height === "number"
      );
    case "freedom":
      return (
        Array.isArray(fins.points) &&
        fins.points.every(
          (point: any) =>
            typeof point.x === "number" && typeof point.y === "number"
        )
      );
    default:
      return false;
  }
}

/**
 * Validates payload section
 */
function validatePayload(payload: any): boolean {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  return (
    typeof payload.offset === "number" &&
    typeof payload.diameter === "number" &&
    typeof payload.length === "number" &&
    typeof payload.mass === "number"
  );
}

/**
 * Validates simplified engine section (only name required)
 */
function validateSimpleEngine(engine: any): boolean {
  if (!engine || typeof engine !== "object") {
    return false;
  }

  return typeof engine.name === "string";
}