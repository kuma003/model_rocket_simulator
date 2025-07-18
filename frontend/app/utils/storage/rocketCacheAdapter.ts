import type { RocketParams } from "../../components/features/Rocket/types";
import { 
  toSerializableRocketParams, 
  fromSerializableRocketParams,
  type SerializableRocketParams 
} from "../rocketSerialization";

const ROCKET_PARAMS_KEY = "rocket_design_params";

/**
 * Save rocket parameters to localStorage using unified serialization
 * @param params - Rocket parameters to save
 */
export function saveRocketParams(params: RocketParams): void {
  try {
    const serializableParams = toSerializableRocketParams(params);
    const serialized = JSON.stringify(serializableParams);
    localStorage.setItem(ROCKET_PARAMS_KEY, serialized);
    console.log("Rocket parameters saved to localStorage");
  } catch (error) {
    console.error("Failed to save rocket parameters:", error);
  }
}

/**
 * Load rocket parameters from localStorage using unified serialization
 * @returns Promise resolving to saved rocket parameters or null if not found
 */
export async function loadRocketParams(): Promise<RocketParams | null> {
  try {
    const serialized = localStorage.getItem(ROCKET_PARAMS_KEY);
    if (!serialized) {
      return null;
    }

    const serializableParams: SerializableRocketParams = JSON.parse(serialized);
    const fullParams = await fromSerializableRocketParams(serializableParams);
    
    console.log("Rocket parameters loaded from localStorage");
    return fullParams;
  } catch (error) {
    console.error("Failed to load rocket parameters:", error);
    return null;
  }
}

/**
 * Clear saved rocket parameters from localStorage
 */
export function clearRocketParams(): void {
  try {
    localStorage.removeItem(ROCKET_PARAMS_KEY);
    console.log("Rocket parameters cleared from localStorage");
  } catch (error) {
    console.error("Failed to clear rocket parameters:", error);
  }
}

/**
 * Check if rocket parameters exist in localStorage
 * @returns True if saved parameters exist
 */
export function hasRocketParams(): boolean {
  try {
    return localStorage.getItem(ROCKET_PARAMS_KEY) !== null;
  } catch (error) {
    console.error("Failed to check rocket parameters:", error);
    return false;
  }
}