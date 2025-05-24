import dotenv from "dotenv";
import ms from "ms";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  jwtExpiresIn: number | ms.StringValue;
  database: string;
  cookieDomain: string;
}

function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: getEnvVariable("JWT_SECRET"),
  jwtExpiresIn: "72h" as ms.StringValue, // Valid ms string format
  database: getEnvVariable("DATABASE"),
  cookieDomain: getEnvVariable("COOKIE_DOMAIN"),
};

export default config;
