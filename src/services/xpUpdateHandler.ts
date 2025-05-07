import dotenv from "dotenv";
import { dummyCalculator } from '../services/waterXPCalculator.js';
import { Data } from "../data.js"
import type {RawReading} from "../services/waterDataConverter.js"

dotenv.config();

const corridorID = 1;
const days = 2;
const dataInstance = new Data();

export function updateXP() {
  console.log('Running updateXP...');
  const rawData = dataInstance.getDbWaterDataByRange(corridorID, {daysBack: days});
  console.log(`Rawdata successfully fetched: ${rawData}`);

}