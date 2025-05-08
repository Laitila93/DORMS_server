

import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import { Data } from "./data.js";
import { Socket } from "socket.io";
import { sockets } from "./sockets.js";
import "./jobs/scheduler.js";
import jwt from "jsonwebtoken";
import { setIO } from "./routes/socketManager.js";
console.log('Scoring scheduler started...');


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

setIO(io); // 👈 Register the io instance

// Express middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Data handler for socket usage
const data = new Data();

// Use example io.to(`dorm-${dormID}`).emit("score:update", { newScore: 50 });
// WebSocket setup
io.on("connection", (socket: Socket) => {
  const token = socket.handshake.auth.token;

  let dormID: number | null = null;

  if (token) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      dormID = decoded.dormID;

      if (dormID) {
        socket.join(`dorm-${dormID}`);
        console.log(`✅ Authenticated socket ${socket.id} joined dorm room: dorm-${dormID}`);
        sockets(socket, data, dormID); // <-- You must call this
      }
    } catch (err) {
      console.warn(`⚠️ Invalid token for socket ${socket.id}, continuing unauthenticated.`);
    }
  } else {
    console.log(`🟡 Unauthenticated socket connected: ${socket.id}`);
  }

  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
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
