import { Server, Socket } from "socket.io";
import { Data } from "./data.js";

function sockets(io: Server, socket: Socket, data: Data): void {
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

  })
}

export { sockets };