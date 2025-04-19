

import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import express, { Application } from "express";
//import userRoutes from "./routes/users"; // <-- your API routes
import { Data } from "./data.js";
import { sockets } from "./sockets.js";
import { Socket } from "socket.io";


dotenv.config();

const app = express();
const httpServer = createServer(app); // Pass express app to HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow frontend dev server, or replace with your domain
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Express middleware
app.use(cors());
app.use(express.json());
//app.use("/api", userRoutes);

// Data handler for socket usage
const data = new Data();

// WebSocket setup
io.on("connection", (socket: Socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);
  sockets(io, socket, data);
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server with Socket.io running on port ${PORT}`);
});

import pool from "./db.js";

async function testConnection() {
  try {
    const [rows]: any[] = await pool.query("SELECT 1 + 1 AS result");
    const result = rows[0]?.result;
    console.log("✅ Database connection successful! Test query result:", result);
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
}

testConnection();