// server/data.js
import { readFileSync } from "fs";

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

  getShopData(lang = "en") {
    const safeLang = ["en", "sv"].includes(lang) ? lang : "en";
    const labelsPath = `./data/shopData-${safeLang}.json`;
    try {
      return JSON.parse(readFileSync(labelsPath, "utf-8"));
    } catch (error) {
      console.error(`Error reading shop file:`, error);
      throw new Error("Failed to load shop data.");
    }
  }
}

export { Data };
