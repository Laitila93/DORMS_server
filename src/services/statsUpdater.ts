import dotenv from "dotenv";
import { Data } from "../data.js"
import { convertToHourlyConsumption } from "./waterDataConverter.js";
import type { RawReading } from "./waterDataConverter.js";
import type { HourlyConsumption } from "./waterDataConverter.js";

dotenv.config();

const corridorIDs = [1, 2]; //Placeholder, we need something that loads the currently registered corridor ID:s
const days = 2; 
const dataInstance = new Data();

export async function updateStats() {

    for (let slot = 0 ; slot < corridorIDs.length ; slot++) {
        console.log('Running updateStats for corridor: ', corridorIDs[slot]);
    
        //Load raw water data from IoT database and convert it inot valid input for the water xp calculator
        const rawData : RawReading[] = await dataInstance.getDbWaterDataByRange(corridorIDs[slot], {daysBack: days});
        const convertedData : HourlyConsumption[] = convertToHourlyConsumption(rawData);
        console.log('Last 24 hours consumption: ', convertedData);
    
      }
}
