import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";

import config from "./config/config";
import errorHandler from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoute";
import userRoutes from "./routes/userRoute";

const app = express();

// Set secure HTTP headers
app.use(helmet());
app.use(morgan(config.nodeEnv === "development" ? "combined" : "tiny"));

// Limit request from same api
const limit = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP. please try again in an hour!",
});

//  Body parser, reading data from body into req.body
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Prevent parameter Pollution/duplication
app.use(
  hpp({
    whitelist: [
      "duration",
      "maxGroupSize",
      "ratingsAverage",
      "ratingQuantity",
      "price",
      "startDates",
      "durationWeeks",
      "difficulty",
    ],
  }),
);

// routes middleware
app.use("/api", limit);

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
