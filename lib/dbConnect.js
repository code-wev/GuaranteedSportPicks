import mongoose from "mongoose";

let isConnected = false; 

export const dbConnect = async () => {
  if (isConnected) return;

  if (!process.env.MONGO_URI) {
    throw new Error("Please define the MONGO_URI environment variable in .env.local");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
