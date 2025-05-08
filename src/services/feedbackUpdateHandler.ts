/* 
DESCRIPTION: This file contains the logic for updating the feedback-nudge on water consumption for each corridor. It takes no input and returns no output. 
The execution order is:
1. Read raw water consumption data from third-party db
2. Convert raw data into valid input
3. Pass valid input into feedback score calculator 
_____________________________________________________________________________________________________________________ */

import dotenv from "dotenv";
import { Data } from "../data.js"
import { convertToDailyConsumption } from "../middleware/waterDataConverter.js";
import { updateFeedbackScore } from "../middleware/feedbackScoreCalculator.js";
import type { RawReading } from "../middleware/waterDataConverter.js";
import type { DailyConsumption } from "../middleware/xpCalculator.js";
import { getIO } from "../routes/socketManager.js";

dotenv.config();

const days = 9; //Feedbackscore is computed based on comparing the past 24 hours to a moving average of the previous 7 days
                // I've set it to 9 to ensure we get enough days from the testdata currently on the server
const dataInstance = new Data();

export async function updateConsumptionFeedback(corridorIDs: number[]) {
  const io = getIO(); // 👈 Access initialized Socket.IO server

  for (let slot = 0; slot < corridorIDs.length; slot++) {
    const corridorId = corridorIDs[slot];
    console.log('Running updateConsumptionFeedback for corridor:', corridorId);

    try {
      const rawData: RawReading[] = await dataInstance.getDbWaterDataByRange(corridorId, { daysBack: days });
      const history: DailyConsumption[] = convertToDailyConsumption(rawData);
      const feedbackScore = updateFeedbackScore(history);

      console.log("Feedback score:", feedbackScore);

      // ✅ Emit to the specific room
      io.to(`dorm-${corridorId}`).emit("feedback:update", { feedbackScore });

      console.log(`📤 Emitted feedback score to dorm-${corridorId}`);
    } catch (err) {
      console.error(`❌ Failed to update feedback for corridor ${corridorId}:`, err);
    }
  }
}




