
import { readFileSync } from "fs";
import pool from "./db.js";

interface ShopData {
  corridor?: number
  fishes: any;
  hats: any;
  specials: any;
}

class Data {
  getMenuData(lang: string = "en"): any {
    const safeLang = ["en", "sv"].includes(lang) ? lang : "en";
    const labelsPath = `./data/menu-${safeLang}.json`;
    try {
      return JSON.parse(readFileSync(labelsPath, "utf-8"));
    } catch (error) {
      console.error(`Error reading menu file:`, error);
      throw new Error("Failed to load menu labels.");
    }
  }

  getWaterData(): any {
    const waterDataPath = './data/testData.json';
    try {
      const waterLogData = readFileSync(waterDataPath, 'utf-8');
      return JSON.parse(waterLogData);
    } catch (error) {
      console.error(`Error reading test data file (${waterDataPath}):`, error);
      throw new Error('Failed to load water data.');
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

  async getUnlocks(corridor: number): Promise<ShopData> {
    try {
      const fishes = await pool.query("SELECT * FROM corridor_fishes WHERE corridor = ?", [corridor]);
      const hats = await pool.query("SELECT * FROM corridor_hats WHERE corridor = ?", [corridor]);
      const specials = await pool.query("SELECT * FROM corridor_specials WHERE corridor = ?", [corridor]);

      return { corridor: corridor, fishes: fishes[0], hats: hats[0], specials: specials[0] };

    } catch (err) {
      console.error("❌ Error fetching shop data:", err);
      throw new Error("Failed to fetch shop data.");
    }
  }
}

export { Data };
