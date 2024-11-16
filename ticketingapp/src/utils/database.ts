import mongoose from "mongoose";

let isConnected = false;

export async function connectToDB() {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "ticketingapp",
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}
