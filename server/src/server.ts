import { createServer } from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import app from "./app";
import config from "./config/config";

interface IUser {
  _id: string;
  name: string;
  socketId: string;
}

const httpServer = createServer(app);
const onlineUsers: IUser[] = [];

export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

mongoose
  .connect(config.database)
  .then(() => console.log("DB connection successful!"))
  .catch((error) => console.error("DB connection error:", error));

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  // Add user
  socket.on("addNewUser", (user: IUser) => {
    if (!user) {
      return;
    }

    const isUserExist = onlineUsers.some((u) => u._id === user._id);
    if (!isUserExist) {
      const newUser = {
        ...user,
        socketId: socket.id,
      };
      onlineUsers.push(newUser);
      console.log("New user added:", newUser);
    }

    io.emit("getUsers", onlineUsers);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    const index = onlineUsers.findIndex((user) => user.socketId === socket.id);
    if (index !== -1) {
      onlineUsers.splice(index, 1);
      console.log("User disconnected:", socket.id);
      io.emit("getUsers", onlineUsers);
    }
  });
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
