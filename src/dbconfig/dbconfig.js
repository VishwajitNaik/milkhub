import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectRedis } from "./redis";
// require("../app/api/Postgre/milk/addMilk/route")

dotenv.config();

// Use global cache to maintain connection across hot reloads in Next.js
let cached = global.mongoose || { conn: null, promise: null };

export async function connect() {
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection.");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⏳ Connecting to MongoDB...");
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      autoIndex: false,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 60000, // 60 seconds
      connectTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 20, // Limit connection pool size to 20
      minPoolSize: 5, // Keep at least 5 connections alive
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB connected successfully.");

    // Start Keep-Alive Pinging
    keepMongoAlive();

    // Initialize Redis only after MongoDB is connected
    connectRedis();
    
    global.mongoose = cached;
    return cached.conn;
  } catch (error) {
    cached.promise = null; // Reset promise if connection fails
    console.error("❌ MongoDB connection failed:", error);
  }
}

// Connection event listeners
mongoose.connection.on("connected", () => console.log("✅ MongoDB connected event triggered."));
mongoose.connection.on("error", (err) => console.error("❌ MongoDB connection error:", err));
mongoose.connection.on("disconnected", () => console.log("⚠️ MongoDB disconnected."));

// 🔹 Function to Prevent Cold Starts (Keep-Alive Pinging)
function keepMongoAlive() {
  setInterval(async () => {
    if (mongoose.connection.readyState === 1) {
      console.log("🔄 Pinging MongoDB to keep connection alive...");
      try {
        await mongoose.connection.db.command({ ping: 1 });
        console.log("✅ MongoDB is active.");
      } catch (error) {
        console.error("❌ MongoDB ping failed:", error);
      }
    }
  }, 5 * 60 * 1000); // Run every 5 minutes
}
