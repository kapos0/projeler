import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
let isConnected = false;

export async function connectDB() {
    if (process.env.MONGODB_URI === undefined)
        throw new Error("MONGODB_URI is not defined");
    mongoose.set("strictQuery", true);

    if (isConnected) {
        console.log("Using existing connection");
        return mongoose.connection.getClient();
    }

    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "mernStoreDB",
        });

        isConnected = true;
        console.log("MongoDB connected");

        return connection.connection.getClient();
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw new Error("Failed to connect to MongoDB");
    }
}
