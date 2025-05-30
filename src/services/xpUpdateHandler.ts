/* 
DESCRIPTION: This file contains the logic for updating the daily XP for each user (corridor). It takes no input and returns no output. 
The execution order is:
1. Read raw water consumption data from third-party db
2. Convert raw data into valid input
3. Pass valid input into XP calculator 
4. Read corridor's current XP from our db
5. Increment corridor's current XP locally
6. Update corridor's XP in our db
7. Update the "xp-log" in our db
_____________________________________________________________________________________________________________________ */


import dotenv from "dotenv";
import { Data } from "../data.js";
import { convertToDailyConsumption } from "../middleware/waterDataConverter.js";
import { calculateScore } from "../middleware/xpCalculator.js";
import type { RawReading } from "../middleware/waterDataConverter.js";
import type { DailyConsumption } from "../middleware/xpCalculator.js";
import { getIO } from "../routes/socketManager.js";

dotenv.config();

const days = 32;
const dataInstance = new Data();

export async function updateXP(corridorIDs: number[]) {
  const io = getIO(); // 👈 Get Socket.IO instance

  for (let slot = 0; slot < corridorIDs.length; slot++) {
    const corridorId = corridorIDs[slot];

    try {
      const rawData: RawReading[] = await dataInstance.getDbWaterDataByRange(corridorId, { daysBack: days });
      const convertedData: DailyConsumption[] = convertToDailyConsumption(rawData);
      const prevXP = await dataInstance.getCurrentXP(corridorId);
      const updatedXP = prevXP + calculateScore(convertedData);

      const timestamp = new Date();
      await dataInstance.setNewXP(updatedXP, corridorId, timestamp); // Await to ensure it's written

      // ✅ Emit to room
      io.to(`dorm-${corridorId}`).emit("xp:update", { updatedXP });

    } catch (err) {
      console.error(`❌ Failed to update XP for corridor ${corridorId}:`, err);
    }
  }
}
