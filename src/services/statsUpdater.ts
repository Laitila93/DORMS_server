/**
 * Updates water consumption statistics for specified corridors and broadcasts updates via Socket.IO
 * 
 * This function:
 * 1. Iterates through provided corridor IDs
 * 2. Fetches raw water consumption data for each corridor
 * 3. Converts raw data to hourly consumption format
 * 4. Emits the converted stats to connected clients in corridor-specific Socket.IO rooms
 * 
 * @param corridorIDs - Array of corridor identification numbers to process
 * 
 * @throws Will log error to console if data fetching or processing fails for any corridor
 * 
 * @example
 * ```typescript
 * await updateStats([1, 2, 3]); // Updates stats for corridors 1, 2, and 3
 * ```
 */
import dotenv from "dotenv";
import { Data } from "../data.js";
import { convertToHourlyConsumption } from "../middleware/waterDataConverter.js";
import type { RawReading, HourlyConsumption } from "../middleware/waterDataConverter.js";
import { getIO } from "../routes/socketManager.js";

dotenv.config();

const days = 2; 
const dataInstance = new Data();

export async function updateStats(corridorIDs: number[]) {
  const io = getIO(); // 👈 Access the initialized Socket.IO server

  for (let slot = 0; slot < corridorIDs.length; slot++) {
    const corridorId = corridorIDs[slot];

    try {
      const rawData: RawReading[] = await dataInstance.getDbWaterDataByRange(corridorId, { daysBack: days });
      const convertedData: HourlyConsumption[] = convertToHourlyConsumption(rawData);

      // ✅ Emit stats to connected clients in the appropriate room
      io.to(`dorm-${corridorId}`).emit("stats:update", { stats: convertedData });

    } catch (err) {
      console.error(`❌ Failed to update stats for corridor ${corridorId}:`, err);
    }
  }
}

