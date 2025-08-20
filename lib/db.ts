import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please provide MONGODB_URI in environment variables");
}

let isConnected = false;

export async function connectToDB() {
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: "complaint-registration",
    });

    isConnected = true;
    console.log("Connected to MongoDB:", db.connection.name);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
