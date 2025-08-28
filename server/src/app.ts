import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

import { connectRedis, connectPostgres } from "./config/index.js";
import { GameController } from "./controllers/index.js";
import { healthRouter } from "./routes/index.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/health", healthRouter);

// Initialize game controller
new GameController(io);

// Database connections
const initializeConnections = async () => {
  try {
    await connectRedis();
    await connectPostgres();
    console.log("All database connections established");
  } catch (error) {
    console.error("Failed to establish database connections:", error);
    process.exit(1);
  }
};

export { app, server, initializeConnections };

