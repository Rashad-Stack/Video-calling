import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

import { createServer } from "http";
import { Server } from "socket.io";
import config from "./config/config";
import errorHandler from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoute";
import userRoutes from "./routes/userRoute";

const app = express();

// Set secure HTTP headers
app.use(cookieParser());
app.use(helmet());
app.use(morgan(config.nodeEnv === "development" ? "combined" : "tiny"));

// Limit request from same api
const limit = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP. please try again in an hour!",
});

//  Body parser, reading data from body into req.body
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
    maxAge: 3600, // allow CORS requests to be cached for 1 hour
    exposedHeaders: ["Content-Type", "Authorization"], // expose these headers to CORS requests
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// routes middleware
app.use("/api", limit);

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

// app.all("*", (req, res, next) => {
//   res.status(404).json({
//     status: "fail",
//     message: `Can't find ${req.originalUrl} on this server!`,
//   });
//   next();
// });

// Global error handler (should be after routes)
app.use(errorHandler);

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
export default httpServer;
