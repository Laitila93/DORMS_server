/* 
DESCRIPTION: This file contains the logic for converting raw data from the Cubicmeter IoT devices into the "DailyConsumption" 
interface format, the vaild input for the waterXPCalculator. It takes raw data as input and returns an array of "DailyConsumption" 
objects as output.
_____________________________________________________________________________________________________________________ */

import type { DailyConsumption } from './xpCalculator';

//Inputs:
export interface RawReading {
  id: number,
  room: string,
  type: string,
  amount: number,
  timestamp: string | Date // ISO format e.g. "2025-04-30T16:19:01:018Z"
}

export function convertToDailyConsumption(rawData: RawReading[]): DailyConsumption[] { //input should maybe be filtered by date range in the future
    
  // Group water consumption by date
  const dailyTotals = new Map<string, number>(); // Map to temporarily store key-value pairs of dates and consumption in liters

  for (const entry of rawData) {
    const isoDate = typeof entry.timestamp === 'string' //ensure date value is of type string 
      ? entry.timestamp 
      : entry.timestamp.toISOString();
    
    const date = isoDate.split('T')[0]; // Extract date part from timestamp

    const prevAmount = dailyTotals.get(date) || 0; // Check if the date already exists in the map 
    dailyTotals.set(date, Number(prevAmount) + Number(entry.amount)); // Update the total amount for each date, or insert a new entry for the date if it doesn't exist in the map yet 
  }

  // Convert map to sorted array of DailyConsumption objects in ascending order of date
  const history: DailyConsumption[] = Array.from(dailyTotals.entries()).map(([date, amount]) => ({date, amount}));
  history.sort((a, b) => a.date.localeCompare(b.date)); //AI magic


  return history

}
