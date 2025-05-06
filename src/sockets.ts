import { Socket } from "socket.io";
import { Data } from "./data.js";

function sockets(socket: Socket, data: Data): void {
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
  
}

export { sockets };