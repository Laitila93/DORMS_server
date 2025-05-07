/* 
DESCRIPTION: This file contains the logic for updating the feedback-nudge on water consumption for each corridor. It takes no input and returns no output. 
The execution order is:
1. Read raw water consumption data from third-party db
2. Convert raw data into valid input
3. Pass valid input into feedback score calculator 
_____________________________________________________________________________________________________________________ */

import dotenv from "dotenv";
import { Data } from "../data.js"
import { convertToDailyConsumption } from "./waterDataConverter.js";
import { updateFeedbackScore } from "./feedbackScoreCalculator.js";
import type { RawReading } from "./waterDataConverter.js";
import type { DailyConsumption } from "./xpCalculator.js";

dotenv.config();

const corridorIDs = [1, 2]; //Placeholder, we need something that loads the currently registered corridor ID:s
const days = 9; //Feedbackscore is computed based on comparing the past 24 hours to a moving average of the previous 7 days
                // I've set it to 9 to ensure we get enough days from the testdata currently on the server
const dataInstance = new Data();

export async function updateConsumptionFeedback() {

  for (let slot = 0 ; slot < corridorIDs.length ; slot++) {
    console.log('Running updateConsumptionFeedback for corridor: ', corridorIDs[slot]);

    //Load raw water data from IoT database and convert it inot valid input for the water xp calculator
    const rawData : RawReading[] = await dataInstance.getDbWaterDataByRange(corridorIDs[slot], {daysBack: days});
    const history : DailyConsumption[] = convertToDailyConsumption(rawData);
    console.log('ConsumptionHistory: ', history);

    const feedbackScore = updateFeedbackScore(history);
    console.log("Feedback score: ", feedbackScore);

  }
  
}




