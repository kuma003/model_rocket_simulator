import type { RocketParams } from "../../components/features/Rocket/types";
import { loadMotorData } from "../motorParser";

const ROCKET_PARAMS_KEY = "rocket_design_params";

/**
 * Save rocket parameters to localStorage
 * @param params - Rocket parameters to save
 */
export function saveRocketParams(params: RocketParams): void {
  try {
    const serialized = JSON.stringify({
      ...params,
      engine: { name: params.engine.name },
      // Only save engine name to reduce size, full data can be fetched later
    });
    localStorage.setItem(ROCKET_PARAMS_KEY, serialized);
    console.log("Rocket parameters saved to localStorage");
  } catch (error) {
    console.error("Failed to save rocket parameters:", error);
  }
}

/**
 * Load rocket parameters from localStorage
 * @returns Saved rocket parameters or null if not found
 */
export function loadRocketParams(): RocketParams | null {
  try {
    const serialized = localStorage.getItem(ROCKET_PARAMS_KEY);
    if (serialized) {
      const json = JSON.parse(serialized);
      const fetchMotor = async () => {
        try {
          const data = await loadMotorData(json.engine.name);

          if (data) {
            json.engine = data; // Replace with full engine data
          }
        } catch (error) {
          console.error("Failed to load motor data:", error);
        }
      };
      fetchMotor();
      console.log("Rocket parameters loaded from localStorage");
      return json;
    }
  } catch (error) {
    console.error("Failed to load motor data:", error);
  }
  return null;
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
