import { readFileSync } from "fs";
import { Pool } from 'pg';
import dotenv from "dotenv";
dotenv.config();

//Inputs:

export interface fetchOptions {
    startDate?: Date;
    endDate?: Date;
    daysBack?: number;
}


// PostgreSQL connection pool
const pgPool = new Pool({
  host: process.env.PG_DB_HOST,
  user: process.env.PG_DB_USER,
  password: process.env.PG_DB_PASSWORD,
  database: process.env.PG_DB_DATABASE,
  port: process.env.PG_DB_PORT ? parseInt(process.env.PG_DB_PORT, 10) : undefined
});

// Explicitly test the DB connection
(async () => {
  try {
    const client = await pgPool.connect();
    console.log('✅ Connected to PostgreSQL database successfully!');
    client.release();
  } catch (err) {
    console.error('❌ Error connecting to the database or creating table:', err);
  }
})();

//2025-04-30T16:19:01:018Z

export async function getDbWaterDataByRange(dormID: number, options: fetchOptions) { // : Promise<any[]> {
    let start : Date;
    let end: Date;

    if(options.startDate && options.endDate) {
      start = options.startDate;
      end = options.endDate;
    }
    else if (options.daysBack !== undefined) {
      start = new Date();
      end = new Date(); 

      start.setDate(end.getDate() - options.daysBack);
      console.log(`Start date: ${start}, end date: ${end}`);

    } else {
        console.error("Please provide either start and end dates or days back");
      }

  }

