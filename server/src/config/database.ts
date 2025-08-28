import { createClient } from "redis";
import pkg from "pg";
const { Pool } = pkg;

export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export const connectRedis = async () => {
  await redisClient.connect();
  console.log("Connected to Redis");
  return redisClient;
};

export const pgPool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:password@localhost:5432/palavras_mmo",
});

export const connectPostgres = async () => {
  try {
    await pgPool.query("SELECT NOW()");
    console.log("Connected to PostgreSQL");
    return pgPool;
  } catch (error) {
    console.error("PostgreSQL connection error:", error);
    throw error;
  }
};

