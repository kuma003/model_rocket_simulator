import type { RocketParams } from "../../components/features/Rocket/types";
import {
  createExportData,
  parseExportData,
  validateSerializableRocketParams,
  fromSerializableRocketParams,
  type RocketExportData,
  type RocketExportMetadata,
  type SerializableRocketParams,
} from "../rocketSerialization";

/**
 * Exports rocket design data as a JSON file using unified serialization
 * @param rocketParams - The rocket parameters to export
 * @param metadata - Optional metadata for the export
 */
export function exportDesignData(
  rocketParams: RocketParams,
  metadata?: Partial<RocketExportMetadata>
): void {
  try {
    const exportData = createExportData(rocketParams, metadata);
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `${rocketParams.name || "rocket_design"}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error("Failed to export rocket design:", error);
    throw error;
  }
}

/**
 * Imports rocket design data from a JSON file using unified serialization
 * @param file - The file to import
 * @returns Promise that resolves to the parsed rocket parameters
 */
export function importDesignData(file: File): Promise<RocketParams> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData: RocketExportData = JSON.parse(content);

        const rocketParams = await parseExportData(parsedData);
        resolve(rocketParams);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
}

/**
 * Loads rocket data from JSON (useful for ghost rockets and preset rockets)
 * @param json - JSON object containing rocket export data or direct SerializableRocketParams
 * @returns Promise that resolves to the parsed rocket parameters
 */
export async function loadFromJson(json: object): Promise<RocketParams> {
  try {
    // Check if it's a full export format (has version, units, exported, data)
    if (isRocketExportData(json)) {
      return await parseExportData(json as RocketExportData);
    }
    
    // Otherwise, treat it as direct SerializableRocketParams
    if (validateSerializableRocketParams(json)) {
      return await fromSerializableRocketParams(json as SerializableRocketParams);
    }
    
    throw new Error("Invalid JSON format: not a valid rocket export data or rocket parameters");
  } catch (error) {
    console.error("Failed to load rocket from JSON:", error);
    throw error;
  }
}

/**
 * Type guard to check if object is RocketExportData format
 * @param obj - Object to check
 * @returns true if object has RocketExportData structure
 */
function isRocketExportData(obj: any): obj is RocketExportData {
  return obj && 
         typeof obj === "object" && 
         "version" in obj && 
         "units" in obj && 
         "exported" in obj && 
         "data" in obj;
}

/**
 * Converts rocket parameters to JSON string format (useful for ghost rockets)
 * @param rocketParams - The rocket parameters to serialize
 * @param metadata - Optional metadata for the export
 * @returns JSON string representation
 */
export function toJsonString(
  rocketParams: RocketParams,
  metadata?: Partial<RocketExportMetadata>
): string {
  try {
    const exportData = createExportData(rocketParams, metadata);
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error("Failed to convert rocket to JSON string:", error);
    throw error;
  }
}
