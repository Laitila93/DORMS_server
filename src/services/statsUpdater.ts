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
    console.log('Running updateStats for corridor:', corridorId);

    try {
      const rawData: RawReading[] = await dataInstance.getDbWaterDataByRange(corridorId, { daysBack: days });
      const convertedData: HourlyConsumption[] = convertToHourlyConsumption(rawData);

      // ✅ Emit stats to connected clients in the appropriate room
      io.to(`dorm-${corridorId}`).emit("stats:update", { stats: convertedData });

      console.log(`📤 Emitted stats update to dorm-${corridorId}`);
    } catch (err) {
      console.error(`❌ Failed to update stats for corridor ${corridorId}:`, err);
    }
  }
}

