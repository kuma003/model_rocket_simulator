import type { RocketParams } from "../../components/features/Rocket/types";
import { 
  createExportData,
  parseExportData,
  type RocketExportData,
  type RocketExportMetadata
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
 * Loads rocket data from JSON string (useful for ghost rockets)
 * @param jsonString - JSON string containing rocket export data
 * @returns Promise that resolves to the parsed rocket parameters
 */
export async function loadFromJsonString(jsonString: string): Promise<RocketParams> {
  try {
    const parsedData: RocketExportData = JSON.parse(jsonString);
    return await parseExportData(parsedData);
  } catch (error) {
    console.error("Failed to load rocket from JSON string:", error);
    throw error;
  }
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