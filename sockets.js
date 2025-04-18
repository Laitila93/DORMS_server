function sockets(io, socket, data) {
  // Handle request for UI labels
  socket.on("getMenuData", (lang) => {
    console.log(`Request for menu data in language: ${lang}`);
    try {
      const labels = data.getMenuData(lang); // Fetch labels based on language
      socket.emit("menuData", labels); // Send labels back to the client
    } catch (error) {
      console.error("Error fetching menu data:", error);
      socket.emit("error", { message: "Failed to fetch menu data." });
    }
  });
  socket.on('testConnection', (data) => {
    console.log('Client says:', data.message);
    socket.emit('testResponse', { message: 'Hello, client!' });
  });
  // Add more event handlers as needed
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

  socket.on("getShopData", async (lang) => {
    console.log(`Request for shop data in language: ${lang}`);
    try {
      const labels = await data.getShopData(lang); // Fetch labels based on language
      console.log("Shop data:", labels);
      socket.emit("shopData", labels); // Send labels back to the client
    } catch (error) {
      console.error("Error fetching shop data:", error);
      socket.emit("error", { message: "Failed to fetch shop data." });
    }
  },

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

);
}

export { sockets };