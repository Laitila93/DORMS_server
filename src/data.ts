import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pool from "./db.js";

interface ShopData {
  corridor?: number
  fishes: any;
  hats: any;
  specials: any;
}

class Data {

  getMenuData(lang: string = "en"): any {
    if (!["en", "sv"].some( el => el === lang))
      lang = "en";
    console.log("Loading menu labels for language:", lang);
    try {
      const labels = readFileSync("./src/data/menu-" + lang + ".json", 'utf-8');
      console.log("Loaded menu labels:", labels);
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
      const fishes = await pool.query("SELECT * FROM corridor_fishes WHERE dormId = ?", [corridor]);
      const hats = await pool.query("SELECT * FROM corridor_hats WHERE dormId = ?", [corridor]);
      const specials = await pool.query("SELECT * FROM corridor_specials WHERE dormId = ?", [corridor]);

      return { corridor: corridor, fishes: fishes[0], hats: hats[0], specials: specials[0] };

    } catch (err) {
      console.error("❌ Error fetching shop data:", err);
      throw new Error("Failed to fetch shop data.");
    }
  }
  async getEquippedFish(corridor: number) {
    try {
      const equippedFishes = await pool.query("SELECT * FROM equipped_fishes WHERE dormId = ?", [corridor]);
      const equippedHats = await pool.query("SELECT * FROM equipped_fish_hats WHERE dormId = ?", [corridor]);
      const equippedSpecials = await pool.query("SELECT * FROM equipped_special WHERE dormId = ?", [corridor]); 
  
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
  
}

export { Data };
