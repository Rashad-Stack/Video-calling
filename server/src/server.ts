import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";
import config from "./config/config";

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const server = httpServer.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

// Error handling
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION 🎆 Shutting down...", err);
  process.exit(1);
});

process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION 🎆 Shutting down...", err);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});

process.on("SIGINT", () => {
  console.log("👋 SIGINT RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
