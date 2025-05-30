/**
 * Class handling data operations for the DORMS application
 * @class Data
 */

/**
 * Interface defining the structure of shop data
 * @interface ShopData
 * @property {number} [corridor] - Optional corridor identifier
 * @property {any} fishes - Fish items data
 * @property {any} hats - Hat items data
 * @property {any} specials - Special items data
 */

/**
 * Interface for water data fetch options
 * @interface fetchOptions
 * @property {Date} [startDate] - Optional start date for the range
 * @property {Date} [endDate] - Optional end date for the range
 * @property {number} [daysBack] - Optional number of days to look back
 */

/**
 * Retrieves water usage data for a specific dorm
 * @param {number} dormID - The ID of the dorm
 * @returns {Promise<any[]>} Array of water usage records
 * @throws {Error} If database query fails
 */

/**
 * Retrieves menu data in specified language
 * @param {string} [lang="en"] - Language code ("en" or "sv")
 * @returns {any} Menu data in specified language
 * @throws {Error} If file loading fails
 */

/**
 * Retrieves water test data from JSON file
 * @returns {any} Water test data
 * @throws {Error} If file loading fails
 */

/**
 * Retrieves shop data in specified language
 * @param {string} [lang="en"] - Language code
 * @returns {Promise<ShopData>} Shop items data
 * @throws {Error} If database query fails
 */

/**
 * Retrieves unlocked items for a specific corridor
 * @param {number} corridor - Corridor identifier
 * @returns {Promise<ShopData>} Unlocked items data
 * @throws {Error} If database query fails
 */

/**
 * Retrieves equipped items for a specific corridor
 * @param {number} corridor - Corridor identifier
 * @returns {Promise<ShopData>} Equipped items data
 * @throws {Error} If database query fails
 */

/**
 * Updates hat assignment for a fish
 * @param {number} hatID - Hat identifier
 * @param {number} position - Position of the fish
 * @param {number} corridorId - Corridor identifier
 * @throws {Error} If database update fails
 */

/**
 * Updates fish in a specific position
 * @param {number} fishID - Fish identifier
 * @param {number} position - Position to place the fish
 * @param {number} corridorId - Corridor identifier
 * @throws {Error} If database update fails
 */

/**
 * Retrieves water consumption data for a specified date range
 * @param {number} dormID - Dorm identifier
 * @param {fetchOptions} options - Date range options
 * @returns {Promise<any[]>} Water consumption data
 * @throws {Error} If date range is invalid or query fails
 */

/**
 * Retrieves current XP for a corridor
 * @param {number} corridorID - Corridor identifier
 * @returns {Promise<number>} Current XP value
 * @throws {Error} If database query fails or XP not found
 */

/**
 * Updates XP value for a corridor
 * @param {number} newXP - New XP value
 * @param {number} corridorID - Corridor identifier
 * @param {Date} timestamp - Time of XP update
 * @throws {Error} If database update fails
 */

/**
 * Retrieves all dorm IDs from the database
 * @returns {Promise<number[]>} Array of dorm IDs
 * @throws {Error} If database query fails
 */
import { readFileSync } from "fs";
import pool from "./db.js";
import { Pool } from 'pg';
import dotenv from "dotenv";
dotenv.config();

interface ShopData {
  corridor?: number
  fishes: any;
  hats: any;
  specials: any;
}

//Input to getDbWaterDataByRange
interface fetchOptions {
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

class Data {

  async getDbWaterData(dormID: number): Promise<any[]> {
    try {
      const result = await pgPool.query(
        `
        SELECT *
        FROM WaterUsage
        WHERE dorm_id = $1
        ORDER BY timestamp DESC
        `,
        [dormID]
      );
      return result.rows;
    } catch (err) {
      console.error("❌ Error fetching water data from db:", err);
      throw new Error("Failed to fetch water data from db.");
    }
  }
  

  getMenuData(lang: string = "en"): any {
    if (!["en", "sv"].some( el => el === lang))
      lang = "en";
    try {
      const labels = readFileSync("./src/data/menu-" + lang + ".json", 'utf-8');
      return JSON.parse(labels);
    } catch (error) {
      throw new Error("Failed to load menu labels. Please check the file path and content.");
    }
  }

  getWaterData(): any {
    try {
      const labels = readFileSync("./src/data/testData.json", 'utf-8');
      return JSON.parse(labels);
    } catch (error) {
      throw new Error("Failed to load test data. Please check the file path and content.");
    }
  }

  async getShopData(lang: string = "en"): Promise<ShopData> {
    try {
      const fishes = await pool.query("SELECT * FROM fishes");
      const hats = await pool.query("SELECT * FROM hats");
      const specials = await pool.query("SELECT * FROM specials");

      return {fishes: fishes[0], hats: hats[0], specials: specials[0] };

    } catch (err) {
      console.error("❌ Error fetching shop unlocks:", err);
      throw new Error("Failed to fetch shop unlocks.");
    }
  }

  async getUnlocks(corridor: number) {
    try {
      const fishes = await pool.query("SELECT * FROM corridor_fishes WHERE dormID = ?", [corridor]);
      const hats = await pool.query("SELECT * FROM corridor_hats WHERE dormID = ?", [corridor]);
      const specials = await pool.query("SELECT * FROM corridor_specials WHERE dormID = ?", [corridor]);

      return { corridor: corridor, fishes: fishes[0], hats: hats[0], specials: specials[0] };

    } catch (err) {
      console.error("❌ Error fetching shop data:", err);
      throw new Error("Failed to fetch shop data.");
    }
  }
  async getEquippedFish(corridor: number) {
    try {
      const equippedFishes = await pool.query("SELECT * FROM equipped_fishes WHERE dormID = ?", [corridor]);
      const equippedHats = await pool.query("SELECT * FROM equipped_fish_hats WHERE dormID = ?", [corridor]);
      const equippedSpecials = await pool.query("SELECT * FROM equipped_special WHERE dormID = ?", [corridor]); 
  
      return {
        corridor: corridor,
        fishes: equippedFishes[0],
        hats: equippedHats[0],
        specials: equippedSpecials[0],
      };
  
    } catch (err) {
      console.error("❌ Error fetching equipped data:", err);
      throw new Error("Failed to fetch equipped data.");
    }
  }
  async updateHat(hatID: number, position: number, corridorId: number) {
    try{
      await pool.query("UPDATE equipped_fish_hats SET hatID = ? WHERE position = ? AND dormID = ?", [hatID, position, corridorId]);
    } catch (err) {
      console.error('Error updating hat:', err);
      throw new Error('Failed to update hat.');
    }
  }
  async updateFish(fishID: number, position: number, corridorId: number) {
    try{
      await pool.query("UPDATE equipped_fishes SET fishID = ? WHERE position = ? AND dormID = ?", [fishID, position, corridorId]);
    } catch (err) {
      console.error('Error updating hat:', err);
      throw new Error('Failed to update hat.');
    }
  }

  //Function for fetching water consumption data for arbitrary date range
  async getDbWaterDataByRange(dormID: number, options: fetchOptions): Promise<any[]> {
      let start: Date | undefined;
      let end: Date | undefined;
  
      if(options.startDate && options.endDate) {
        start = options.startDate;
        end = options.endDate;
      }
      else if (options.daysBack !== undefined) {
        start = new Date();
        end = new Date(); 
  
        start.setDate(end.getDate() - options.daysBack);
        console.log(`Start date: ${start}, end date: ${end}`);
  
      } 
      if(!start || !end) {
        throw new Error('Please provide either start date and end date or days back');
      }
      try {
        const result = await pgPool.query(
        `
        SELECT *
        FROM WaterUsage
        WHERE dorm_id = $1 AND (timestamp BETWEEN $2 AND $3)
        ORDER BY timestamp DESC
          `,
        [dormID, start, end]
      );
      return result.rows;
    } catch (err) {
      console.error("❌ Error fetching water data from db:", err);
      throw new Error("Failed to fetch water data from db.");
    }
  }

  //Function for fetching the current XP held by a corridor
  async getCurrentXP (corridorID: number): Promise<any> {
    try {
      const [rows] : any = await pool.query(
        `
        SELECT xp
        FROM dorms
        Where dormID = ?
          `,
        [corridorID]  
      );
      console.log("Query result:", rows, corridorID);

      const xp = rows[0]?.xp

      if (xp === undefined || xp === null) {
        throw new Error("XP not found for given corridor ID");
      }
      return Number(xp);
    } catch (err) {
      console.error("Error fetching XP data from db: ", err);
      throw new Error ("Failed to fetch XP data from db.")
    }
  }
  //Function for updating a corridor's XP
  async setNewXP (newXP: number, corridorID: number, timestamp: Date) {
    try {
      const updateDorm = await pool.query(
        `
        UPDATE dorms
        SET xp = ?
        WHERE dormID = ?
          `,
        [newXP, corridorID]  
      );
    } catch (err1) {
      console.log("Error updating dorm total xp: ", err1);
      throw new Error("Failed to update dorm xp");
    }
    try {  
      const updateXPLog = await pool.query(
        `
        INSERT INTO xp_log
        VALUES (?, ?, ?)
        `,
        [corridorID, newXP, timestamp]
      );

    } catch (err2) {
      console.error("Error updating xp log: ", err2);
      throw new Error ("Failed to update xp log.")
    }
  }

  async getDorms(): Promise<number[]> {
    try {
      const [rows] = await pool.query(`SELECT dormID FROM dorms`);
      return (rows as any[]).map(row => row.dormID);
    } catch (err) {
      console.error("❌ Error fetching dormID:", err);
      throw new Error("Failed to fetch dormID from db.");
    }
  }
  
  
}

export { Data };
