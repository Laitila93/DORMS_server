/**
 * Sets up WebSocket event handlers for various data operations.
 * Handles authentication and different data requests from clients.
 * 
 * @param socket - The Socket.io socket instance for the client connection
 * @param data - Data access object containing methods for database operations
 * @param dormID - The ID of the dormitory for authentication
 * 
 * @throws Will emit "unauthorized" event if dormID is invalid
 * 
 * Socket Events Handled:
 * - getDbWaterData: Fetches water data from database
 * - getMenuData: Retrieves menu labels in specified language
 * - getUnlocks: Gets shop unlock data for a corridor
 * - getEquipped: Retrieves equipped fish data for a corridor
 * - getShopData: Fetches shop data in specified language
 * - getWaterData: Gets water consumption data
 * - updateHat: Updates hat position data
 * - updateFish: Updates fish position data
 * - getXp: Retrieves current XP for a corridor
 * - getFeedback: Updates consumption feedback for a corridor
 */
import { Socket } from "socket.io";
import { Data } from "./data.js";
import { updateConsumptionFeedback } from "./services/feedbackUpdateHandler.js";

function sockets(socket: Socket, data: Data, dormID: number): void {
  if (!dormID || dormID === 0) {
    console.warn(`⚠️ Unauthorized socket (${socket.id}) attempted to access restricted features.`);
    socket.emit("unauthorized", { message: "Authentication required." });
    return;
  }

  socket.on("getDbWaterData", async (dormID) => {
    console.log("Request for test water data for id:" + dormID);
    try {
      const waterLogData = await data.getDbWaterData(dormID); // Fetch testdata
      socket.emit("DbWaterData", waterLogData); // Send testdata back to the client
    } catch (error) {
      console.error("Error fetching db water data:", error);
      socket.emit("error", { message: "Failed to fetch db water data." });
    }
  });

  socket.on("getMenuData", (lang: string) => {
    console.log(`Request for menu data in language: ${lang}`);
    try {
      const labels = data.getMenuData(lang);
      socket.emit("menuData", labels);
    } catch (error) {
      console.error("Error fetching menu data:", error);
      socket.emit("error", { message: "Failed to fetch menu data." });
    }
  });

  socket.on("getUnlocks", async (corridor: number) => {
    try {
      const shopData = await data.getUnlocks(corridor);
      socket.emit("shopUnlocks", shopData);
    } catch (error) {
      console.error("Error fetching shop unlocks:", error);
      socket.emit("error", { message: "Failed to fetch shop unlocks." });
    }
  });
  // Fetch equipped fish data
  socket.on("getEquipped", async (corridor: number) => {
    try {
      const equippedData = await data.getEquippedFish(corridor);
      socket.emit("equippedData", equippedData);
    } catch (error) {
      console.error("Error fetching equipped data:", error);
      socket.emit("error", { message: "Failed to fetch equipped data." });
    }
  });

  socket.on("getShopData", async (lang: string) => {
    console.log(`Request for shop data in language: ${lang}`);
    try {
      const shopData = await data.getShopData(lang);
      socket.emit("shopData", shopData);
    } catch (error) {
      console.error("Error fetching shop data:", error);
      socket.emit("error", { message: "Failed to fetch shop data." });
    }
  });

  socket.on("getWaterData", async ()=>{
    console.log('Request for water data');
    try {
      const waterLogData = await data.getWaterData(); // Fetch testdata
      socket.emit("waterData", waterLogData); // Send testdata back to the client
    } catch (error) {
      console.error("Error fetching water data:", error);
      socket.emit("error", { message: "Failed to fetch water data." });
      }
  });
  socket.on("updateHat", async (hatData: any)=>{
    try {
      await data.updateHat(hatData.hatID, hatData.position, hatData.corridorId);
      console.log('Hat updated successfully');
    } catch (error) {
      console.error('Error updating hat:', error);
      socket.emit('error', { message: 'Failed to update hat.' });
      }
  });
  socket.on("updateFish", async (fishData: any)=>{
    try {
      await data.updateFish(fishData.fishID, fishData.position, fishData.corridorId);
      console.log('Hat updated successfully');
    } catch (error) {
      console.error('Error updating hat:', error);
      socket.emit('error', { message: 'Failed to update hat.' });
      }
  });
  socket.on("getXp", async (corridor: number) => {
    try {
      const xp = await data.getCurrentXP(corridor);
      socket.emit("xp", xp);
    } catch (error) {
      console.error("Error fetching XP:", error);
      socket.emit("error", { message: "Failed to fetch XP." });
    }
  });
  socket.on(("getFeedback"), async (corridor: number) => {
    try {
      updateConsumptionFeedback([corridor]); // Call the function to update feedback
    } catch (error) {
      console.error("Error fetching feedback:", error);
      socket.emit("error", { message: "Failed to fetch feedback." });
    }
  });
  
}

export { sockets };