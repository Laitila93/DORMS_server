import { Socket } from "socket.io";
import { Data } from "./data.js";

function sockets(socket: Socket, data: Data): void {
  socket.on("getDbWaterData", async () => {
    console.log("Request for test water data");
    try {
      const waterLogData = await data.getDbWaterData(); // Fetch testdata
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
  socket.on("updateHat", async (hatID: number)=>{
    console.log('request for update hat: ', hatID );
  });
  
}

export { sockets };