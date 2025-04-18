// server/data.js
import { readFileSync } from "fs";
import pool from "./db.js";

class Data {
  getMenuData(lang = "en") {
    const safeLang = ["en", "sv"].includes(lang) ? lang : "en";
    const labelsPath = `./data/menu-${safeLang}.json`;
    try {
      return JSON.parse(readFileSync(labelsPath, "utf-8"));
    } catch (error) {
      console.error(`Error reading menu file:`, error);
      throw new Error("Failed to load menu labels.");
    }
  }

  getWaterData() {
    const waterDataPath = './data/testData.json';
    try {
      const waterLogData = readFileSync(waterDataPath, 'utf-8');
      return JSON.parse(waterLogData);
    } catch (error) {
      console.error(`Error reading test data file (${waterDataPath}):`, error);
      throw new Error('Failed to load water data.');
    }
  }
  async getShopData(lang = "en") {
    //const safeLang = ["en", "sv"].includes(lang) ? lang : "en";

    try {
      // Query data from all three tables
      const [fishes] = await pool.query("SELECT * FROM fishes");
      const [hats] = await pool.query("SELECT * FROM hats");
      const [specials] = await pool.query("SELECT * FROM specials");

      // Combine the data into a single object
      const shopData = {
        fishes,
        hats,
        specials,
      };

      // Return the data
      return shopData;
    } catch (err) {
      console.error("❌ Error fetching shop data:", err);
      throw new Error("Failed to fetch shop data.");
    }
  }
}

export { Data };
